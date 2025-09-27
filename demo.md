# AI Interview Assistant - Demo Guide

## Quick Demo Steps

### 1. Start the Application
```bash
npm install
npm run dev
```
Open http://localhost:3000 in your browser.

### 2. Test the Interviewee Flow

#### Step 1: Upload Resume
- Click on "Interviewee" tab
- Click "Upload Resume" button
- Upload a PDF or DOCX resume file
- Review extracted information (Name, Email, Phone)
- Fill in any missing fields
- Click "Continue to Interview"

#### Step 2: Take the Interview
- Click "Start Interview" 
- Answer 6 questions with timers:
  - **Easy Questions (20s each)**: Basic React concepts
  - **Medium Questions (60s each)**: Intermediate topics
  - **Hard Questions (120s each)**: Complex scenarios
- Watch the timer countdown
- System auto-submits when time expires
- Complete all 6 questions

### 3. Test the Interviewer Dashboard

#### Step 1: View Candidates
- Click on "Interviewer Dashboard" tab
- See the candidate you just interviewed in the list
- Notice the score and status

#### Step 2: Review Details
- Click "View Details" on the completed candidate
- See individual question scores
- Read the AI-generated summary
- Review all questions and answers

### 4. Test Data Persistence

#### Step 1: Simulate Interruption
- Start a new interview (upload another resume)
- Answer 1-2 questions
- Close the browser tab

#### Step 2: Resume Session
- Reopen the application
- You should see "Welcome Back" modal
- Choose "Continue Previous Session"
- Interview resumes where you left off

### 5. Test Search and Filtering

#### In Interviewer Dashboard:
- Use the search box to find candidates by name or email
- Sort by score (click on Score column header)
- View different candidates' details

## Demo Features to Highlight

### 🎯 Core Features
- **Resume Parsing**: Automatic extraction of Name, Email, Phone
- **Smart Data Collection**: Prompts for missing information
- **Timed Interviews**: Automatic progression with visual timers
- **AI Evaluation**: Real-time scoring and feedback
- **Dual Interface**: Separate experiences for candidates and interviewers

### 📊 Advanced Features
- **Data Persistence**: Everything saves automatically
- **Session Recovery**: Welcome back for unfinished interviews
- **Search & Sort**: Find candidates quickly
- **Detailed Analytics**: Individual performance breakdown
- **AI Summaries**: Comprehensive candidate evaluation

### 🔧 Technical Features
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Clean, professional interface
- **Error Handling**: Graceful handling of edge cases
- **Type Safety**: Full TypeScript implementation

## Sample Resume Content

For testing, create a simple resume with:
```
John Doe
john.doe@email.com
(555) 123-4567

Experience: 3 years React development
Skills: JavaScript, React, Node.js
```

Save as PDF or DOCX and upload to test the parsing functionality.

## Troubleshooting

### Common Issues:
1. **File Upload Fails**: Ensure file is PDF or DOCX format
2. **Timer Not Working**: Check browser console for errors
3. **Data Not Persisting**: Clear browser cache and try again
4. **Styling Issues**: Ensure all dependencies are installed

### Browser Compatibility:
- Chrome 90+ (Recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- **Fast Loading**: Optimized bundle size with Vite
- **Smooth Animations**: 60fps transitions and timers
- **Memory Efficient**: Automatic cleanup of unused data
- **Offline Ready**: Works without internet connection

---

**Ready to demo! The application is fully functional with all required features.**
