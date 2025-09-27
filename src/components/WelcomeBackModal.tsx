import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setShowWelcomeBackModal, setActiveTab } from '../store/slices/uiSlice';
import { setCurrentCandidate } from '../store/slices/interviewSlice';

const { Title, Paragraph } = Typography;

const WelcomeBackModal: React.FC = () => {
  const dispatch = useDispatch();
  const { showWelcomeBackModal } = useSelector((state: RootState) => state.ui);
  const { currentCandidate } = useSelector((state: RootState) => state.interview);

  const handleContinue = () => {
    dispatch(setShowWelcomeBackModal(false));
    dispatch(setActiveTab('interviewee'));
    if (currentCandidate) {
      dispatch(setCurrentCandidate(currentCandidate));
    }
  };

  const handleStartNew = () => {
    dispatch(setShowWelcomeBackModal(false));
    dispatch(setCurrentCandidate(null));
    dispatch(setActiveTab('interviewee'));
  };

  return (
    <Modal
      title="Welcome Back!"
      open={showWelcomeBackModal}
      onCancel={() => dispatch(setShowWelcomeBackModal(false))}
      footer={[
        <Button key="new" onClick={handleStartNew}>
          Start New Interview
        </Button>,
        <Button key="continue" type="primary" onClick={handleContinue}>
          Continue Previous Session
        </Button>,
      ]}
      centered
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Title level={3}>Welcome Back!</Title>
        <Paragraph>
          We detected an unfinished interview session. Would you like to continue where you left off or start a new interview?
        </Paragraph>
        {currentCandidate && (
          <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', margin: '16px 0' }}>
            <Title level={4}>Previous Session Details:</Title>
            <Paragraph><strong>Name:</strong> {currentCandidate.name}</Paragraph>
            <Paragraph><strong>Email:</strong> {currentCandidate.email}</Paragraph>
            <Paragraph><strong>Status:</strong> {currentCandidate.interviewStatus}</Paragraph>
            {currentCandidate.currentQuestionIndex > 0 && (
              <Paragraph><strong>Progress:</strong> {currentCandidate.currentQuestionIndex} questions completed</Paragraph>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default WelcomeBackModal;
