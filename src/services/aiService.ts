import { Question } from '../types';

// Mock AI service - in a real implementation, you would integrate with OpenAI, Claude, or similar
export class AIService {
  private static instance: AIService;
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateQuestions(): Promise<Question[]> {
    // Mock questions for full-stack React/Node.js role
    return [
      {
        id: 'q1',
        text: 'What is React and what are its main advantages over traditional DOM manipulation?',
        difficulty: 'easy',
        timeLimit: 20,
      },
      {
        id: 'q2',
        text: 'Explain the difference between state and props in React components.',
        difficulty: 'easy',
        timeLimit: 20,
      },
      {
        id: 'q3',
        text: 'How would you implement a custom hook in React? Provide a practical example.',
        difficulty: 'medium',
        timeLimit: 60,
      },
      {
        id: 'q4',
        text: 'Describe the Node.js event loop and how it handles asynchronous operations.',
        difficulty: 'medium',
        timeLimit: 60,
      },
      {
        id: 'q5',
        text: 'Design a scalable microservices architecture for an e-commerce platform. What technologies would you use and why?',
        difficulty: 'hard',
        timeLimit: 120,
      },
      {
        id: 'q6',
        text: 'Implement a real-time chat application using WebSockets. Walk through the architecture and key implementation details.',
        difficulty: 'hard',
        timeLimit: 120,
      },
    ];
  }

  async evaluateAnswer(question: string, answer: string, difficulty: string): Promise<{ score: number; feedback: string; isValid: boolean }> {
    // Mock evaluation - in a real implementation, this would use AI to evaluate the answer
    const baseScore = this.getBaseScore(difficulty);
    const lengthBonus = Math.min(answer.length / 100, 20); // Bonus for detailed answers
    const keywordBonus = this.checkKeywords(question, answer);
    const technicalAccuracy = this.checkTechnicalAccuracy(question, answer);
    const isValid = this.validateAnswer(question, answer, difficulty);
    
    // Apply penalties for incorrect answers
    let finalScore = baseScore + lengthBonus + keywordBonus;
    
    // Penalty for invalid answers
    if (!isValid) {
      finalScore = Math.max(0, finalScore - 30); // Heavy penalty for invalid answers
    }
    
    // Penalty for technical inaccuracy
    if (!technicalAccuracy) {
      finalScore = Math.max(0, finalScore - 20); // Penalty for technical inaccuracy
    }
    
    // Bonus for technical accuracy
    if (technicalAccuracy && isValid) {
      finalScore = Math.min(100, finalScore + 15); // Bonus for accurate answers
    }
    
    // Penalty for very short answers
    if (answer.length < 30) {
      finalScore = Math.max(0, finalScore - 25);
    }
    
    // Penalty for off-topic answers
    const relevanceScore = this.checkRelevance(question, answer);
    if (relevanceScore < 0.3) {
      finalScore = Math.max(0, finalScore - 40); // Heavy penalty for off-topic
    }
    
    const finalScoreClamped = Math.min(100, Math.max(0, finalScore));
    const feedback = this.generateFeedback(question, answer, difficulty, finalScoreClamped);
    
    return { score: Math.round(finalScoreClamped), feedback, isValid };
  }

  private validateAnswer(question: string, answer: string, difficulty: string): boolean {
    // Basic validation rules
    if (!answer || answer.trim().length < 10) {
      return false;
    }
    
    // Check for minimum content based on difficulty
    const minLength = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 50 : 100;
    if (answer.length < minLength) {
      return false;
    }
    
    // Check for relevant keywords
    const keywords = this.extractKeywords(question);
    const hasRelevantKeywords = keywords.some(keyword => 
      answer.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Check for technical accuracy based on question type
    const isTechnicallyCorrect = this.checkTechnicalAccuracy(question, answer);
    
    return hasRelevantKeywords && isTechnicallyCorrect;
  }

  private checkTechnicalAccuracy(question: string, answer: string): boolean {
    const lowerAnswer = answer.toLowerCase();
    const lowerQuestion = question.toLowerCase();
    
    // React-specific validation
    if (lowerQuestion.includes('react')) {
      // Check for React-specific concepts
      const reactConcepts = ['component', 'jsx', 'state', 'props', 'virtual dom', 'render'];
      const hasReactConcepts = reactConcepts.some(concept => lowerAnswer.includes(concept));
      
      // Check for common React misconceptions
      const misconceptions = ['jquery', 'angular', 'vue', 'vanilla javascript'];
      const hasMisconceptions = misconceptions.some(misconception => lowerAnswer.includes(misconception));
      
      return hasReactConcepts && !hasMisconceptions;
    }
    
    // Node.js-specific validation
    if (lowerQuestion.includes('node')) {
      const nodeConcepts = ['javascript', 'server', 'runtime', 'event loop', 'npm', 'package'];
      const hasNodeConcepts = nodeConcepts.some(concept => lowerAnswer.includes(concept));
      
      // Check for server-side development concepts
      const serverConcepts = ['backend', 'api', 'database', 'async', 'callback'];
      const hasServerConcepts = serverConcepts.some(concept => lowerAnswer.includes(concept));
      
      return hasNodeConcepts || hasServerConcepts;
    }
    
    // Architecture-specific validation
    if (lowerQuestion.includes('architecture') || lowerQuestion.includes('microservice')) {
      const archConcepts = ['scalable', 'distributed', 'service', 'api', 'database', 'load balancer'];
      const hasArchConcepts = archConcepts.some(concept => lowerAnswer.includes(concept));
      
      return hasArchConcepts;
    }
    
    // WebSocket-specific validation
    if (lowerQuestion.includes('websocket') || lowerQuestion.includes('real-time')) {
      const wsConcepts = ['socket', 'connection', 'real-time', 'bidirectional', 'event'];
      const hasWSConcepts = wsConcepts.some(concept => lowerAnswer.includes(concept));
      
      return hasWSConcepts;
    }
    
    // General technical validation
    const technicalTerms = ['function', 'method', 'class', 'object', 'variable', 'array', 'string'];
    const hasTechnicalTerms = technicalTerms.some(term => lowerAnswer.includes(term));
    
    return hasTechnicalTerms;
  }

  private checkRelevance(question: string, answer: string): number {
    const questionKeywords = this.extractKeywords(question);
    const answerKeywords = this.extractKeywords(answer);
    
    if (questionKeywords.length === 0) return 1; // No specific keywords to check
    
    const matchingKeywords = questionKeywords.filter(keyword => 
      answerKeywords.includes(keyword) || answer.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return matchingKeywords.length / questionKeywords.length;
  }

  private generateFeedback(question: string, answer: string, difficulty: string, score: number): string {
    const feedbacks = [];
    const lowerAnswer = answer.toLowerCase();
    const lowerQuestion = question.toLowerCase();
    
    // Score-based feedback with specific guidance
    if (score >= 90) {
      feedbacks.push("🌟 Excellent answer! You demonstrated deep understanding of the topic.");
    } else if (score >= 80) {
      feedbacks.push("👍 Great answer! You showed good knowledge with some areas for improvement.");
    } else if (score >= 70) {
      feedbacks.push("✅ Good answer! You covered the basics well but could provide more detail.");
    } else if (score >= 60) {
      feedbacks.push("⚠️ Fair answer. Consider providing more specific examples and technical details.");
    } else if (score >= 40) {
      feedbacks.push("❌ This answer needs significant improvement. Try to be more specific and provide concrete examples.");
    } else {
      feedbacks.push("🚫 This answer is incorrect or off-topic. Please review the question and provide a relevant response.");
    }
    
    // Difficulty context
    feedbacks.push(`Difficulty: ${difficulty.toUpperCase()}.`);

    // Length feedback
    if (answer.length < 30) {
      feedbacks.push("📝 Your answer is too brief. Try to elaborate more on your points.");
    } else if (answer.length < 50) {
      feedbacks.push("📝 Your answer is quite brief. Try to elaborate more on your points.");
    } else if (answer.length > 500) {
      feedbacks.push("📚 Good detail! You provided a comprehensive answer.");
    }
    
    // Technical accuracy feedback
    const technicalAccuracy = this.checkTechnicalAccuracy(question, answer);
    if (!technicalAccuracy) {
      feedbacks.push("🔧 Your answer lacks technical accuracy. Please review the concepts and provide correct information.");
    }
    
    // Relevance feedback
    const relevanceScore = this.checkRelevance(question, answer);
    if (relevanceScore < 0.3) {
      feedbacks.push("🎯 Your answer seems off-topic. Please focus on the specific question asked.");
    }
    
    // Specific technical feedback based on question type
    if (lowerQuestion.includes('react')) {
      if (!lowerAnswer.includes('component')) {
        feedbacks.push("⚛️ Consider mentioning React components in your answer.");
      }
      if (!lowerAnswer.includes('jsx')) {
        feedbacks.push("⚛️ Try to mention JSX as React's syntax extension.");
      }
    }
    
    if (lowerQuestion.includes('node')) {
      if (!lowerAnswer.includes('javascript') && !lowerAnswer.includes('server')) {
        feedbacks.push("🟢 Try to mention Node.js as a JavaScript runtime for server-side development.");
      }
      if (!lowerAnswer.includes('event loop')) {
        feedbacks.push("🟢 Consider explaining the event loop concept.");
      }
    }
    
    if (lowerQuestion.includes('architecture') || lowerQuestion.includes('microservice')) {
      if (!lowerAnswer.includes('scalable') && !lowerAnswer.includes('distributed')) {
        feedbacks.push("🏗️ Consider mentioning scalability and distributed systems concepts.");
      }
    }
    
    if (lowerQuestion.includes('websocket') || lowerQuestion.includes('real-time')) {
      if (!lowerAnswer.includes('real-time') && !lowerAnswer.includes('bidirectional')) {
        feedbacks.push("🔌 Try to mention real-time communication and bidirectional data flow.");
      }
    }
    
    return feedbacks.join(' ');
  }

  private getBaseScore(difficulty: string): number {
    switch (difficulty) {
      case 'easy': return 60;
      case 'medium': return 50;
      case 'hard': return 40;
      default: return 50;
    }
  }

  private checkKeywords(question: string, answer: string): number {
    const keywords = this.extractKeywords(question);
    let score = 0;
    
    keywords.forEach(keyword => {
      if (answer.toLowerCase().includes(keyword.toLowerCase())) {
        score += 5;
      }
    });
    
    return Math.min(score, 30);
  }

  private extractKeywords(question: string): string[] {
    const techKeywords = [
      'react', 'component', 'state', 'props', 'hook', 'jsx',
      'node', 'express', 'async', 'promise', 'callback',
      'database', 'api', 'rest', 'graphql', 'websocket',
      'microservice', 'docker', 'kubernetes', 'aws', 'azure'
    ];
    
    return techKeywords.filter(keyword => 
      question.toLowerCase().includes(keyword)
    );
  }

  async generateSummary(candidate: any, answers: any[]): Promise<string> {
    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0) / answers.length;
    const strengths = this.identifyStrengths(answers);
    const areas = this.identifyAreas(answers);
    
    return `Candidate ${candidate.name} achieved an overall score of ${totalScore.toFixed(1)}/100. 
    ${strengths.length > 0 ? `Strengths include: ${strengths.join(', ')}.` : ''}
    ${areas.length > 0 ? `Areas for improvement: ${areas.join(', ')}.` : ''}
    The candidate demonstrated ${totalScore >= 70 ? 'strong' : totalScore >= 50 ? 'moderate' : 'limited'} technical knowledge.`;
  }

  private identifyStrengths(answers: any[]): string[] {
    const strengths = [];
    const highScoringAnswers = answers.filter(a => a.score >= 70);
    
    if (highScoringAnswers.some(a => a.difficulty === 'hard')) {
      strengths.push('complex problem solving');
    }
    if (highScoringAnswers.some(a => a.difficulty === 'medium')) {
      strengths.push('intermediate concepts');
    }
    if (answers.every(a => a.answer.length > 50)) {
      strengths.push('detailed explanations');
    }
    
    return strengths;
  }

  private identifyAreas(answers: any[]): string[] {
    const areas = [];
    const lowScoringAnswers = answers.filter(a => a.score < 50);
    
    if (lowScoringAnswers.some(a => a.difficulty === 'easy')) {
      areas.push('fundamental concepts');
    }
    if (lowScoringAnswers.some(a => a.difficulty === 'medium')) {
      areas.push('intermediate topics');
    }
    if (answers.some(a => a.answer.length < 20)) {
      areas.push('detailed explanations');
    }
    
    return areas;
  }
}
