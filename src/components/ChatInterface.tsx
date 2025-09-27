import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Progress, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { 
  addChatMessage, 
  setCurrentQuestion, 
  setTimeRemaining, 
  setInterviewActive,
  addAnswer,
  updateCandidate
} from '../store/slices/interviewSlice';
import { AIService } from '../services/aiService';
import { formatTime } from '../utils/sessionUtils';
import { Candidate, Question } from '../types';

interface ChatInterfaceProps {
  candidate: Candidate;
  onComplete: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ candidate, onComplete }) => {
  const dispatch = useDispatch();
  const { currentQuestion, timeRemaining, isInterviewActive, chatMessages } = useSelector((state: RootState) => state.interview);
  const [inputValue, setInputValue] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = AIService.getInstance();

  useEffect(() => {
    if (!isInterviewActive && questions.length === 0) {
      initializeInterview();
    }
  }, []);

  useEffect(() => {
    if (isInterviewActive && currentQuestion) {
      startTimer();
    }
  }, [currentQuestion, isInterviewActive]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeInterview = async () => {
    try {
      const generatedQuestions = await aiService.generateQuestions();
      setQuestions(generatedQuestions);
      
      dispatch(addChatMessage({
        id: `msg_${Date.now()}`,
        type: 'system',
        content: `Welcome to your interview, ${candidate.name}! You'll answer 6 questions: 2 Easy (20s each), 2 Medium (60s each), and 2 Hard (120s each). Let's begin!`,
        timestamp: new Date().toISOString(),
      }));

      // Start with first question
      if (generatedQuestions.length > 0) {
        const firstQuestion = generatedQuestions[0];
        dispatch(setCurrentQuestion(firstQuestion));
        dispatch(setTimeRemaining(firstQuestion.timeLimit));
        dispatch(setInterviewActive(true));
        
        dispatch(addChatMessage({
          id: `msg_${Date.now()}`,
          type: 'ai',
          content: `Question 1 of 6 (${firstQuestion.difficulty.toUpperCase()}): ${firstQuestion.text}`,
          timestamp: new Date().toISOString(),
          questionId: firstQuestion.id,
        }));
      }
    } catch (error) {
      message.error('Failed to initialize interview');
      console.error('Interview initialization error:', error);
    }
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      dispatch(setTimeRemaining(timeRemaining - 1));
      
      if (timeRemaining <= 1) {
        clearInterval(timer);
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  };

  const handleTimeUp = () => {
    if (currentQuestion && !isSubmitting) {
      dispatch(addChatMessage({
        id: `msg_${Date.now()}`,
        type: 'system',
        content: 'Time\'s up! Moving to the next question.',
        timestamp: new Date().toISOString(),
      }));
      
      submitAnswer('');
    }
  };

  const submitAnswer = async (answer: string) => {
    if (!currentQuestion || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Add user message
      if (answer.trim()) {
        dispatch(addChatMessage({
          id: `msg_${Date.now()}`,
          type: 'user',
          content: answer,
          timestamp: new Date().toISOString(),
        }));
      }

      // Evaluate answer
      const score = await aiService.evaluateAnswer(currentQuestion.text, answer, currentQuestion.difficulty);
      const timeSpent = currentQuestion.timeLimit - timeRemaining;
      
      // Add answer to candidate
      const answerData = {
        questionId: currentQuestion.id,
        question: currentQuestion.text,
        answer: answer || 'No answer provided',
        difficulty: currentQuestion.difficulty,
        score: Math.round(score),
        timeSpent,
        timestamp: new Date().toISOString(),
      };

      dispatch(addAnswer(answerData));
      
      // Add AI feedback
      dispatch(addChatMessage({
        id: `msg_${Date.now()}`,
        type: 'ai',
        content: `Thank you for your answer. Score: ${Math.round(score)}/100`,
        timestamp: new Date().toISOString(),
      }));

      // Move to next question or complete interview
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        const nextQuestion = questions[nextIndex];
        dispatch(setCurrentQuestion(nextQuestion));
        dispatch(setTimeRemaining(nextQuestion.timeLimit));
        
        dispatch(addChatMessage({
          id: `msg_${Date.now()}`,
          type: 'ai',
          content: `Question ${nextIndex + 1} of 6 (${nextQuestion.difficulty.toUpperCase()}): ${nextQuestion.text}`,
          timestamp: new Date().toISOString(),
          questionId: nextQuestion.id,
        }));
      } else {
        // Interview completed
        await completeInterview();
      }
    } catch (error) {
      message.error('Failed to process answer');
      console.error('Answer processing error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeInterview = async () => {
    try {
      const updatedCandidate = { ...candidate, answers: [...candidate.answers] };
      const summary = await aiService.generateSummary(updatedCandidate, updatedCandidate.answers);
      const finalScore = Math.round(updatedCandidate.answers.reduce((sum, a) => sum + a.score, 0) / updatedCandidate.answers.length);
      
      dispatch(updateCandidate({
        id: candidate.id,
        interviewStatus: 'completed',
        finalScore,
        summary,
        endTime: new Date().toISOString(),
      }));

      dispatch(addChatMessage({
        id: `msg_${Date.now()}`,
        type: 'system',
        content: `Interview completed! Your final score: ${finalScore}/100`,
        timestamp: new Date().toISOString(),
      }));

      dispatch(setInterviewActive(false));
      onComplete();
    } catch (error) {
      message.error('Failed to complete interview');
      console.error('Interview completion error:', error);
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim() && !isSubmitting) {
      submitAnswer(inputValue);
      setInputValue('');
    }
  };

  const getTimerColor = () => {
    if (timeRemaining <= 10) return '#ff4d4f';
    if (timeRemaining <= 30) return '#faad14';
    return '#1890ff';
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.type === 'user' ? 'user-message' : 'ai-message'}`}
            style={{
              margin: '8px 0',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: msg.type === 'user' ? '#1890ff' : '#f0f0f0',
              color: msg.type === 'user' ? 'white' : 'black',
              maxWidth: '80%',
              marginLeft: msg.type === 'user' ? 'auto' : '0',
            }}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isInterviewActive && currentQuestion && (
        <div style={{ padding: '16px', background: 'white', borderTop: '1px solid #d9d9d9' }}>
          <div className="timer-display" style={{ color: getTimerColor() }}>
            Time Remaining: {formatTime(timeRemaining)}
          </div>
          
          <Progress 
            percent={((currentQuestion.timeLimit - timeRemaining) / currentQuestion.timeLimit) * 100}
            strokeColor={getTimerColor()}
            style={{ marginBottom: 16 }}
          />
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer here..."
              onPressEnter={handleSubmit}
              disabled={isSubmitting}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
