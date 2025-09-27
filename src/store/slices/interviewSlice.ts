import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate, Answer, Question, ChatMessage, InterviewState } from '../../types';

const initialState: InterviewState = {
  currentCandidate: null,
  candidates: [],
  currentQuestion: null,
  chatMessages: [],
  isInterviewActive: false,
  timeRemaining: 0,
  isPaused: false,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
    setCurrentCandidate: (state, action: PayloadAction<Candidate | null>) => {
      state.currentCandidate = action.payload;
    },
    updateCandidate: (state, action: PayloadAction<Partial<Candidate> & { id: string }>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload };
      }
      if (state.currentCandidate?.id === action.payload.id) {
        state.currentCandidate = { ...state.currentCandidate, ...action.payload };
      }
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload);
    },
    setCurrentQuestion: (state, action: PayloadAction<Question | null>) => {
      state.currentQuestion = action.payload;
    },
    setInterviewActive: (state, action: PayloadAction<boolean>) => {
      state.isInterviewActive = action.payload;
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    setPaused: (state, action: PayloadAction<boolean>) => {
      state.isPaused = action.payload;
    },
    addAnswer: (state, action: PayloadAction<Answer>) => {
      if (state.currentCandidate) {
        state.currentCandidate.answers.push(action.payload);
        state.currentCandidate.currentQuestionIndex += 1;
      }
    },
    clearChatMessages: (state) => {
      state.chatMessages = [];
    },
    resetInterview: (state) => {
      state.currentQuestion = null;
      state.chatMessages = [];
      state.isInterviewActive = false;
      state.timeRemaining = 0;
      state.isPaused = false;
    },
  },
});

export const {
  addCandidate,
  setCurrentCandidate,
  updateCandidate,
  addChatMessage,
  setCurrentQuestion,
  setInterviewActive,
  setTimeRemaining,
  setPaused,
  addAnswer,
  clearChatMessages,
  resetInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;
