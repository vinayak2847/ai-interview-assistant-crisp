import { Candidate } from '../types';

export const checkForUnfinishedSession = (): boolean => {
  const candidates = JSON.parse(localStorage.getItem('persist:root') || '{}');
  if (candidates.interview) {
    try {
      const interviewData = JSON.parse(candidates.interview);
      return interviewData.isInterviewActive || 
             (interviewData.currentCandidate && 
              interviewData.currentCandidate.interviewStatus === 'in_progress');
    } catch {
      return false;
    }
  }
  return false;
};

export const generateCandidateId = (): string => {
  return `candidate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-fair';
  return 'score-poor';
};

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
};
