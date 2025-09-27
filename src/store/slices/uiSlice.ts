import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate } from '../../types';

interface UIState {
  activeTab: 'interviewee' | 'interviewer';
  showWelcomeBackModal: boolean;
  selectedCandidate: Candidate | null;
}

const initialState: UIState = {
  activeTab: 'interviewee',
  showWelcomeBackModal: false,
  selectedCandidate: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'interviewee' | 'interviewer'>) => {
      state.activeTab = action.payload;
    },
    setShowWelcomeBackModal: (state, action: PayloadAction<boolean>) => {
      state.showWelcomeBackModal = action.payload;
    },
    setSelectedCandidate: (state, action: PayloadAction<Candidate | null>) => {
      state.selectedCandidate = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setShowWelcomeBackModal,
  setSelectedCandidate,
} = uiSlice.actions;

export default uiSlice.reducer;
