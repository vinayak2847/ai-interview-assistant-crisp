import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Card, Button, Upload, Form, Input, Steps, Progress, message, Modal, List, Avatar, Badge } from 'antd';
import { UploadOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { AIService } from './services/aiService';

const { Header, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('interviewee');
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [candidateData, setCandidateData] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showCandidateDetail, setShowCandidateDetail] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answerValidation, setAnswerValidation] = useState<{isValid: boolean, feedback: string} | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCandidates = localStorage.getItem('candidates');
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    }

    const savedCandidate = localStorage.getItem('currentCandidate');
    if (savedCandidate) {
      const candidate = JSON.parse(savedCandidate);
      setCandidateData(candidate);
      if (candidate.interviewStatus === 'in_progress') {
        setShowWelcomeBack(true);
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isInterviewActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isInterviewActive, timeRemaining]);

  const questions = [
    { id: 'q1', text: 'What is React and what are its main advantages over traditional DOM manipulation?', difficulty: 'easy', timeLimit: 20 },
    { id: 'q2', text: 'Explain the difference between state and props in React components.', difficulty: 'easy', timeLimit: 20 },
    { id: 'q3', text: 'How would you implement a custom hook in React? Provide a practical example.', difficulty: 'medium', timeLimit: 60 },
    { id: 'q4', text: 'Describe the Node.js event loop and how it handles asynchronous operations.', difficulty: 'medium', timeLimit: 60 },
    { id: 'q5', text: 'Design a scalable microservices architecture for an e-commerce platform. What technologies would you use and why?', difficulty: 'hard', timeLimit: 120 },
    { id: 'q6', text: 'Implement a real-time chat application using WebSockets. Walk through the architecture and key implementation details.', difficulty: 'hard', timeLimit: 120 },
  ];

  const handleResumeUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // Mock resume parsing - in real app, this would extract data
    const mockExtractedData = {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567'
    };
    setCandidateData(mockExtractedData);
    form.setFieldsValue(mockExtractedData);
    setCurrentStep(1);
    message.success('Resume parsed successfully! Please review the extracted information.');
    return false;
  };

  const sendCompletionEmail = (candidate: any, finalScore: number) => {
    const emailContent = `
Dear ${candidate.name},

Congratulations on completing your AI Interview!

Your Results:
- Final Score: ${finalScore}/100
- Interview Date: ${new Date().toLocaleDateString()}
- Position: Full Stack Developer

Thank you for participating in our AI-powered interview process. Your results have been saved and will be reviewed by our team.

Best regards,
AI Interview Team
    `;
    
    console.log(`Sending completion email to ${candidate.email}:`, emailContent);
    message.success(`Completion email sent to ${candidate.email}!`);
  };

  const handleFormSubmit = (values: any) => {
    const candidate = {
      id: `candidate_${Date.now()}`,
      ...values,
      interviewStatus: 'not_started',
      startTime: new Date().toISOString(),
    };
    setCandidateData(candidate);
    localStorage.setItem('currentCandidate', JSON.stringify(candidate));
    setCurrentStep(2);
    message.success('Information saved! Ready to start interview.');
  };

  const startInterview = () => {
    setIsInterviewActive(true);
    setCurrentQuestionIndex(0);
    setTimeRemaining(questions[0].timeLimit);
    setChatMessages([
      { id: 1, type: 'system', content: `Welcome ${candidateData.name}! You'll answer 6 questions: 2 Easy (20s each), 2 Medium (60s each), and 2 Hard (120s each). Let's begin!`, timestamp: new Date().toISOString() },
      { id: 2, type: 'ai', content: `Question 1 of 6 (${questions[0].difficulty.toUpperCase()}): ${questions[0].text}`, timestamp: new Date().toISOString() }
    ]);
    setCurrentStep(3);
    
    // Update candidate status
    const updatedCandidate = { ...candidateData, interviewStatus: 'in_progress' };
    setCandidateData(updatedCandidate);
    localStorage.setItem('currentCandidate', JSON.stringify(updatedCandidate));
  };

  const handleTimeUp = () => {
    if (questions[currentQuestionIndex]) {
      submitAnswer('');
    }
  };

  const submitAnswer = async (answer: string) => {
    const question = questions[currentQuestionIndex];
    
    // Use AI service to evaluate answer with validation
    const aiService = AIService.getInstance();
    const evaluation = await aiService.evaluateAnswer(question.text, answer || 'No answer provided', question.difficulty);
    
    const answerData = {
      questionId: question.id,
      question: question.text,
      answer: answer || 'No answer provided',
      difficulty: question.difficulty,
      score: evaluation.score,
      timeSpent: question.timeLimit - timeRemaining,
      timestamp: new Date().toISOString(),
      isValid: evaluation.isValid,
      feedback: evaluation.feedback
    };

    setAnswers(prev => [...prev, answerData]);

    // Add user message if there's an answer
    if (answer.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        type: 'user',
        content: answer,
        timestamp: new Date().toISOString()
      }]);
    }

    // Add AI feedback with validation
    const validationMessage = evaluation.isValid 
      ? "✅ Your answer looks good!" 
      : "⚠️ Your answer seems incomplete. Consider adding more detail.";
    
    setChatMessages(prev => [...prev, {
      id: Date.now() + 1,
      type: 'ai',
      content: `${validationMessage} Score: ${evaluation.score}/100. ${evaluation.feedback}`,
      timestamp: new Date().toISOString()
    }]);

    // Move to next question or complete interview
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setTimeRemaining(questions[nextIndex].timeLimit);
      setChatMessages(prev => [...prev, {
        id: Date.now() + 2,
        type: 'ai',
        content: `Question ${nextIndex + 1} of 6 (${questions[nextIndex].difficulty.toUpperCase()}): ${questions[nextIndex].text}`,
        timestamp: new Date().toISOString()
      }]);
    } else {
      completeInterview();
    }
  };

  const handleSubmitAnswer = () => {
    const input = document.querySelector('textarea') as HTMLTextAreaElement;
    if (input) {
      submitAnswer(input.value);
      input.value = '';
      setCurrentAnswer('');
      setAnswerValidation(null);
    }
  };

  const handleAnswerChange = async (value: string) => {
    setCurrentAnswer(value);
    
    // Real-time validation for longer answers
    if (value.length > 20) {
      const aiService = AIService.getInstance();
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        const evaluation = await aiService.evaluateAnswer(currentQuestion.text, value, currentQuestion.difficulty);
        setAnswerValidation({
          isValid: evaluation.isValid,
          feedback: evaluation.feedback
        });
      }
    } else {
      setAnswerValidation(null);
    }
  };

  const completeInterview = () => {
    const finalScore = Math.round(answers.reduce((sum, a) => sum + a.score, 0) / answers.length);
    const completedCandidate = {
      ...candidateData,
      interviewStatus: 'completed',
      finalScore,
      answers,
      endTime: new Date().toISOString(),
      summary: `Candidate ${candidateData.name} achieved an overall score of ${finalScore}/100. The candidate demonstrated ${finalScore >= 70 ? 'strong' : finalScore >= 50 ? 'moderate' : 'limited'} technical knowledge.`
    };

    setCandidates(prev => [...prev, completedCandidate]);
    localStorage.setItem('candidates', JSON.stringify([...candidates, completedCandidate]));
    localStorage.removeItem('currentCandidate');

    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'system',
      content: `Interview completed! Your final score: ${finalScore}/100. Check the Interviewer dashboard to see your results.`,
      timestamp: new Date().toISOString()
    }]);

    setIsInterviewActive(false);
    setCurrentStep(4);
    message.success('Interview completed successfully!');
    
    // Send completion email
    sendCompletionEmail(completedCandidate, finalScore);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 10) return '#ff4d4f';
    if (timeRemaining <= 30) return '#faad14';
    return '#1890ff';
  };

  const renderIntervieweeContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card title="Upload Resume" style={{ maxWidth: 600, margin: '0 auto' }}>
            <Upload beforeUpload={handleResumeUpload} accept=".pdf,.docx" showUploadList={false}>
              <Button icon={<UploadOutlined />} size="large">Upload Resume (PDF or DOCX)</Button>
            </Upload>
            <p style={{ marginTop: 8, color: '#666' }}>Supported formats: PDF, DOCX</p>
          </Card>
        );
      case 1:
        return (
          <Card title="Complete Your Information" style={{ maxWidth: 600, margin: '0 auto' }}>
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                <Input placeholder="Enter your full name" />
              </Form.Item>
              
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
                <Input placeholder="Enter your email address" />
              </Form.Item>

              <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter your phone number' }]}>
                <Input placeholder="Enter your phone number" />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Continue to Interview
                </Button>
              </Form.Item>
            </Form>
          </Card>
        );
      case 2:
        return (
          <Card title="Ready to Start Interview" style={{ maxWidth: 600, margin: '0 auto' }}>
            <p>Your information has been collected. Click below to start the interview.</p>
            <p><strong>Name:</strong> {candidateData?.name}</p>
            <p><strong>Email:</strong> {candidateData?.email}</p>
            <p><strong>Phone:</strong> {candidateData?.phone}</p>
            <Button type="primary" size="large" onClick={startInterview} disabled={isInterviewActive} style={{ marginTop: 16 }}>
              {isInterviewActive ? 'Interview in Progress...' : 'Start Interview'}
            </Button>
          </Card>
        );
      case 3:
        return (
          <Card title="Interview in Progress" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: getTimerColor() }}>
                <ClockCircleOutlined /> Time Remaining: {formatTime(timeRemaining)}
              </div>
            </div>
            
            <Progress 
              percent={((questions[currentQuestionIndex]?.timeLimit - timeRemaining) / questions[currentQuestionIndex]?.timeLimit) * 100}
              strokeColor={getTimerColor()}
              style={{ marginBottom: 20 }}
            />

            <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #d9d9d9', padding: '16px', marginBottom: '20px', backgroundColor: '#fafafa' }}>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    margin: '8px 0',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: msg.type === 'user' ? '#1890ff' : msg.type === 'ai' ? '#f0f0f0' : '#e6f7ff',
                    color: msg.type === 'user' ? 'white' : 'black',
                    maxWidth: '80%',
                    marginLeft: msg.type === 'user' ? 'auto' : '0',
                  }}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <TextArea
                  placeholder="Type your answer here..."
                  rows={3}
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  onPressEnter={(e) => {
                    if (e.ctrlKey) {
                      handleSubmitAnswer();
                    }
                  }}
                />
                {answerValidation && (
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '8px', 
                    borderRadius: '4px',
                    backgroundColor: answerValidation.isValid ? '#f6ffed' : '#fff2f0',
                    border: `1px solid ${answerValidation.isValid ? '#b7eb8f' : '#ffccc7'}`,
                    fontSize: '12px'
                  }}>
                    <div style={{ 
                      color: answerValidation.isValid ? '#52c41a' : '#ff4d4f',
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}>
                      {answerValidation.isValid ? '✅ Answer looks good!' : '⚠️ Answer needs improvement'}
                    </div>
                    <div style={{ color: '#666' }}>
                      {answerValidation.feedback}
                    </div>
                  </div>
                )}
              </div>
              <Button type="primary" onClick={handleSubmitAnswer}>
                Submit Answer
              </Button>
            </div>
          </Card>
        );
      case 4:
        const finalScore = answers.length > 0 ? Math.round(answers.reduce((sum, a) => sum + a.score, 0) / answers.length) : 0;
        const getScoreMessage = (score: number) => {
          if (score >= 90) return { title: "Outstanding Performance! 🌟", message: "You've demonstrated exceptional technical knowledge and problem-solving skills. You're ready for any challenge!", color: "#52c41a" };
          if (score >= 80) return { title: "Excellent Work! 🎉", message: "Your strong technical foundation and clear communication make you a valuable team member!", color: "#52c41a" };
          if (score >= 70) return { title: "Great Job! 👍", message: "You've shown solid understanding of key concepts. Keep learning and you'll continue to grow!", color: "#1890ff" };
          if (score >= 60) return { title: "Good Effort! 💪", message: "You have a decent foundation. Focus on the areas that need improvement and you'll excel!", color: "#faad14" };
          if (score >= 50) return { title: "Keep Learning! 📚", message: "Every expert was once a beginner. Review the concepts and practice more - you've got this!", color: "#faad14" };
          return { title: "Don't Give Up! 🚀", message: "This is just the beginning of your journey. With dedication and practice, you'll achieve great things!", color: "#ff4d4f" };
        };
        
        const scoreInfo = getScoreMessage(finalScore);
        
        return (
          <div style={{ 
            minHeight: '100vh', 
            background: `linear-gradient(135deg, ${scoreInfo.color}15, #f0f8ff)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <Card style={{ 
              maxWidth: 800, 
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: 'none',
              borderRadius: '20px'
            }}>
              <div style={{ padding: '40px 20px' }}>
                {/* Score Display */}
                <div style={{ 
                  fontSize: '120px', 
                  fontWeight: 'bold', 
                  color: scoreInfo.color,
                  marginBottom: '20px',
                  textShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  {finalScore}
                </div>
                
                <div style={{ 
                  fontSize: '24px', 
                  color: '#666',
                  marginBottom: '30px'
                }}>
                  out of 100
                </div>

                {/* Congratulations Message */}
                <h1 style={{ 
                  fontSize: '36px', 
                  color: scoreInfo.color,
                  marginBottom: '20px',
                  fontWeight: 'bold'
                }}>
                  {scoreInfo.title}
                </h1>

                <p style={{ 
                  fontSize: '18px', 
                  color: '#666',
                  marginBottom: '40px',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  margin: '0 auto 40px'
                }}>
                  {scoreInfo.message}
                </p>

                {/* Score Breakdown */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '20px',
                  marginBottom: '40px',
                  flexWrap: 'wrap'
                }}>
                  {answers.map((answer, index) => (
                    <div key={index} style={{
                      background: '#f8f9fa',
                      padding: '15px 20px',
                      borderRadius: '10px',
                      border: '2px solid #e9ecef',
                      minWidth: '120px'
                    }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                        Q{index + 1} ({answer.difficulty})
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold',
                        color: answer.score >= 70 ? '#52c41a' : answer.score >= 50 ? '#faad14' : '#ff4d4f'
                      }}>
                        {answer.score}/100
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => {
                      setCurrentStep(0);
                      setCandidateData(null);
                      setChatMessages([]);
                      setIsInterviewActive(false);
                      setAnswers([]);
                    }}
                    style={{
                      background: scoreInfo.color,
                      borderColor: scoreInfo.color,
                      borderRadius: '25px',
                      padding: '10px 30px',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    Take Another Interview
                  </Button>
                  
                  <Button 
                    size="large"
                    onClick={() => setActiveTab('interviewer')}
                    style={{
                      borderRadius: '25px',
                      padding: '10px 30px',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    View All Results
                  </Button>
                </div>

                {/* Motivational Quote */}
                <div style={{ 
                  marginTop: '40px',
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '15px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '16px', color: '#666', fontStyle: 'italic' }}>
                    "Success is not final, failure is not fatal: it is the courage to continue that counts."
                  </div>
                  <div style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
                    - Winston Churchill
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  const renderInterviewerContent = () => (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Interview Dashboard</h2>
        <Input.Search placeholder="Search candidates..." style={{ width: 300 }} />
      </div>
      
      <Card>
        {candidates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No candidates yet.</p>
            <p>Complete an interview to see results here.</p>
          </div>
        ) : (
          <List
            dataSource={candidates.sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0))}
            renderItem={(candidate) => (
              <List.Item
                actions={[
                  <Button key="view" type="link" onClick={() => {
                    setSelectedCandidate(candidate);
                    setShowCandidateDetail(true);
                  }}>
                    View Details
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={candidate.name}
                  description={
                    <div>
                      <p>{candidate.email} • {candidate.phone}</p>
                      <Badge 
                        status={candidate.finalScore >= 70 ? 'success' : candidate.finalScore >= 50 ? 'warning' : 'error'} 
                        text={`Score: ${candidate.finalScore}/100`} 
                      />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, color: '#1890ff' }}>AI Interview Assistant</h1>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'interviewee',
              label: 'Interviewee',
              children: (
                <div>
                  <Steps current={currentStep} style={{ marginBottom: 24 }}>
                    <Step title="Upload Resume" description="Upload your resume" />
                    <Step title="Review Info" description="Confirm your details" />
                    <Step title="Interview" description="Answer questions" />
                    <Step title="Complete" description="Interview finished" />
                  </Steps>
                  {renderIntervieweeContent()}
                </div>
              ),
            },
            {
              key: 'interviewer',
              label: 'Interviewer Dashboard',
              children: renderInterviewerContent(),
            },
          ]}
          size="large"
        />
      </Content>

      {/* Welcome Back Modal */}
      <Modal
        title="Welcome Back!"
        open={showWelcomeBack}
        onOk={() => {
          setShowWelcomeBack(false);
          setCurrentStep(3);
          setIsInterviewActive(true);
        }}
        onCancel={() => {
          setShowWelcomeBack(false);
          setCurrentStep(0);
          setCandidateData(null);
        }}
        okText="Continue Interview"
        cancelText="Start New"
      >
        <p>We detected an unfinished interview session. Would you like to continue where you left off or start a new interview?</p>
        {candidateData && (
          <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', margin: '16px 0' }}>
            <p><strong>Name:</strong> {candidateData.name}</p>
            <p><strong>Email:</strong> {candidateData.email}</p>
            <p><strong>Status:</strong> {candidateData.interviewStatus}</p>
          </div>
        )}
      </Modal>

      {/* Candidate Detail Modal */}
      <Modal
        title={`Candidate Details - ${selectedCandidate?.name}`}
        open={showCandidateDetail}
        onCancel={() => setShowCandidateDetail(false)}
        footer={[<Button key="close" onClick={() => setShowCandidateDetail(false)}>Close</Button>]}
        width={800}
      >
        {selectedCandidate && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <p><strong>Name:</strong> {selectedCandidate.name}</p>
              <p><strong>Email:</strong> {selectedCandidate.email}</p>
              <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
              <p><strong>Final Score:</strong> {selectedCandidate.finalScore}/100</p>
            </div>
            
            {selectedCandidate.summary && (
              <div style={{ marginBottom: 24, padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h4>AI Summary:</h4>
                <p>{selectedCandidate.summary}</p>
              </div>
            )}

            {selectedCandidate.answers && selectedCandidate.answers.length > 0 && (
              <div>
                <h4>Interview Q&A:</h4>
                {selectedCandidate.answers.map((answer: any, index: number) => (
                  <Card key={answer.questionId} style={{ marginBottom: 16 }}>
                    <h5>Question {index + 1} ({answer.difficulty.toUpperCase()})</h5>
                    <p>{answer.question}</p>
                    <h5>Answer:</h5>
                    <p>{answer.answer}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                      <span>Score: <strong style={{ color: answer.score >= 70 ? '#52c41a' : answer.score >= 50 ? '#faad14' : '#ff4d4f' }}>{answer.score}/100</strong></span>
                      <span>Time Spent: {answer.timeSpent}s</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default App;