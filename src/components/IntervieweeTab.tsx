import React, { useState, useEffect } from 'react';
import { Card, Steps, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setCurrentCandidate, addChatMessage } from '../store/slices/interviewSlice';
import ResumeUpload from './ResumeUpload';
import ChatInterface from './ChatInterface';
import { Candidate } from '../types';

const { Step } = Steps;

const IntervieweeTab: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCandidate } = useSelector((state: RootState) => state.interview);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentCandidate) {
      if (currentCandidate.interviewStatus === 'completed') {
        setCurrentStep(3);
      } else if (currentCandidate.interviewStatus === 'in_progress') {
        setCurrentStep(2);
      } else if (currentCandidate.name && currentCandidate.email && currentCandidate.phone) {
        setCurrentStep(1);
      } else {
        setCurrentStep(0);
      }
    }
  }, [currentCandidate]);

  const handleResumeUpload = (candidate: Candidate) => {
    dispatch(setCurrentCandidate(candidate));
    dispatch(addChatMessage({
      id: `msg_${Date.now()}`,
      type: 'system',
      content: `Welcome ${candidate.name}! I've extracted your information from the resume. Let's start the interview.`,
      timestamp: new Date().toISOString(),
    }));
    setCurrentStep(1);
  };

  const handleInterviewStart = () => {
    if (currentCandidate) {
      dispatch({ type: 'interview/updateCandidate', payload: {
        id: currentCandidate.id,
        interviewStatus: 'in_progress',
        startTime: new Date().toISOString(),
      }});
      setCurrentStep(2);
    }
  };

  const handleInterviewComplete = () => {
    setCurrentStep(3);
    message.success('Interview completed! Check the Interviewer dashboard to see your results.');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ResumeUpload 
            onUpload={handleResumeUpload}
            existingCandidate={currentCandidate}
          />
        );
      case 1:
        return (
          <Card title="Ready to Start Interview" style={{ marginTop: 16 }}>
            <p>Your information has been collected. Click below to start the interview.</p>
            <p><strong>Name:</strong> {currentCandidate?.name}</p>
            <p><strong>Email:</strong> {currentCandidate?.email}</p>
            <p><strong>Phone:</strong> {currentCandidate?.phone}</p>
            <button 
              onClick={handleInterviewStart}
              style={{
                background: '#1890ff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              Start Interview
            </button>
          </Card>
        );
      case 2:
        return (
          <ChatInterface 
            candidate={currentCandidate!}
            onComplete={handleInterviewComplete}
          />
        );
      case 3:
        return (
          <Card title="Interview Completed" style={{ marginTop: 16 }}>
            <p>Thank you for completing the interview!</p>
            <p>Your results are now available in the Interviewer dashboard.</p>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Upload Resume" description="Upload your resume" />
        <Step title="Review Info" description="Confirm your details" />
        <Step title="Interview" description="Answer questions" />
        <Step title="Complete" description="Interview finished" />
      </Steps>
      
      {renderStepContent()}
    </div>
  );
};

export default IntervieweeTab;
