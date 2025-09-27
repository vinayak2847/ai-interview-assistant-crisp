# 🎯 AI Interview Assistant - Crisp

A sophisticated AI-powered interview assistant built with React and TypeScript that conducts real-time technical interviews with intelligent validation and scoring.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.13.2-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎭 **Dual Interface**
- **Interviewee Tab**: Interactive chat-based interview experience
- **Interviewer Tab**: Dashboard for reviewing candidates and results
- **Real-time Sync**: Both tabs stay synchronized

### 📄 **Resume Processing**
- **PDF/DOCX Support**: Upload and parse resume files
- **Smart Extraction**: Automatically extract name, email, phone
- **Missing Field Detection**: Chatbot prompts for incomplete information

### 🤖 **AI-Powered Interview**
- **Dynamic Question Generation**: 6 questions (2 Easy, 2 Medium, 2 Hard)
- **Timed Sessions**: 20s (Easy), 60s (Medium), 120s (Hard)
- **Real-time Validation**: Live feedback as candidates type
- **Intelligent Scoring**: AI evaluates technical accuracy and relevance

### 🎯 **Advanced Validation**
- **Technical Accuracy**: Validates React, Node.js, architecture concepts
- **Relevance Checking**: Ensures answers are on-topic
- **Penalty System**: Heavy penalties for incorrect/off-topic answers
- **Bonus Rewards**: Extra points for technically accurate responses

### 💾 **Data Persistence**
- **Local Storage**: All progress saved locally
- **Session Recovery**: Resume interrupted interviews
- **Welcome Back Modal**: Seamless continuation of sessions

### 📊 **Analytics & Reporting**
- **Candidate Dashboard**: View all candidates with scores
- **Detailed Results**: Question-by-question breakdown
- **AI Summaries**: Intelligent candidate assessments
- **Search & Sort**: Find candidates easily

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-interview-assistant-crisp.git
cd ai-interview-assistant-crisp

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── IntervieweeTab.tsx
│   ├── InterviewerTab.tsx
│   ├── ResumeUpload.tsx
│   ├── ChatInterface.tsx
│   └── WelcomeBackModal.tsx
├── services/           # AI and utility services
│   ├── aiService.ts
│   ├── emailService.ts
│   └── resumeParser.ts
├── store/              # Redux store configuration
│   ├── store.ts
│   └── slices/
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── sessionUtils.ts
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css         # Global styles
```

## 🎨 Key Features Explained

### Real-time Validation
```typescript
// Live feedback as user types
const handleAnswerChange = async (value: string) => {
  if (value.length > 20) {
    const evaluation = await aiService.evaluateAnswer(question, value, difficulty);
    setAnswerValidation({
      isValid: evaluation.isValid,
      feedback: evaluation.feedback
    });
  }
};
```

### Intelligent Scoring
```typescript
// Penalty system for incorrect answers
if (!isValid) {
  finalScore = Math.max(0, finalScore - 30); // Heavy penalty
}
if (!technicalAccuracy) {
  finalScore = Math.max(0, finalScore - 20); // Technical penalty
}
```

### Technical Validation
```typescript
// React-specific validation
if (lowerQuestion.includes('react')) {
  const reactConcepts = ['component', 'jsx', 'state', 'props'];
  const hasReactConcepts = reactConcepts.some(concept => 
    lowerAnswer.includes(concept)
  );
  return hasReactConcepts && !hasMisconceptions;
}
```

## 🎯 Interview Flow

1. **Resume Upload** → Extract candidate information
2. **Information Collection** → Fill missing details via chatbot
3. **Interview Start** → 6 timed questions with real-time validation
4. **AI Evaluation** → Intelligent scoring and feedback
5. **Results Display** → Beautiful score presentation
6. **Dashboard Review** → Interviewer can review all candidates

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Library**: Ant Design 5
- **State Management**: Redux Toolkit + Redux Persist
- **Build Tool**: Vite
- **Styling**: CSS-in-JS with Ant Design
- **File Processing**: PDF-parse, Mammoth (DOCX)

## 📱 Responsive Design

- **Mobile-first**: Optimized for all screen sizes
- **Touch-friendly**: Easy interaction on tablets/phones
- **Accessible**: WCAG compliant design patterns

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Email service configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build the project
npm run build

# Deploy dist/ folder to Netlify
```

### GitHub Pages
```bash
# Add to package.json scripts
"deploy": "gh-pages -d dist"

# Deploy
npm run build
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ant Design** for the beautiful UI components
- **React Team** for the amazing framework
- **TypeScript** for type safety
- **Vite** for the fast build tool

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Built with ❤️ for the future of technical interviews**