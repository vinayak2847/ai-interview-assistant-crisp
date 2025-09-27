export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  interviewStatus: 'not_started' | 'in_progress' | 'completed';
  currentQuestionIndex: number;
  answers: Answer[];
  finalScore?: number;
  summary?: string;
  startTime?: string;
  endTime?: string;
}

export interface Answer {
  questionId: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  timeSpent: number;
  timestamp: string;
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

export interface ChatMessage {
  id: string;
  type: 'system' | 'user' | 'ai';
  content: string;
  timestamp: string;
  questionId?: string;
}

export interface InterviewState {
  currentCandidate: Candidate | null;
  candidates: Candidate[];
  currentQuestion: Question | null;
  chatMessages: ChatMessage[];
  isInterviewActive: boolean;
  timeRemaining: number;
  isPaused: boolean;
}

export interface AppState {
  interview: InterviewState;
  ui: {
    activeTab: 'interviewee' | 'interviewer';
    showWelcomeBackModal: boolean;
    selectedCandidate: Candidate | null;
  };
}
