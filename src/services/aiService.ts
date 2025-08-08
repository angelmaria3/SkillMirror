import { getAPIConfig, AI_PROVIDER } from '../config/api';

interface AnalysisRequest {
  resumeText: string;
  jobDescription: string;
}

interface AnalysisResponse {
  score: number;
  extractedKeywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

class AIService {
  private config = getAPIConfig();

  async analyzeResume(request: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      const { resumeText, jobDescription } = request;
      
      // Extract keywords from job description
      const extractedKeywords = this.extractKeywords(jobDescription);
      
      // Find matched and missing keywords
      const matchedKeywords = extractedKeywords.filter(keyword => 
        resumeText.toLowerCase().includes(keyword.toLowerCase())
      );
      
      const missingKeywords = extractedKeywords.filter(keyword => 
        !resumeText.toLowerCase().includes(keyword.toLowerCase())
      );

      // Calculate ATS score
      const score = Math.round((matchedKeywords.length / extractedKeywords.length) * 100);

      // Generate AI suggestions
      const suggestions = await this.generateSuggestions(resumeText, jobDescription, missingKeywords);

      return {
        score,
        extractedKeywords,
        matchedKeywords,
        missingKeywords,
        suggestions
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('Failed to analyze resume. Please check your API configuration.');
    }
  }

  private extractKeywords(jobDescription: string): string[] {
    // Enhanced keyword extraction logic
    const commonWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall'
    ]);

    const words = jobDescription
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word));

    // Get word frequency
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Return top keywords sorted by frequency
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  }

  private async generateSuggestions(
    resumeText: string, 
    jobDescription: string, 
    missingKeywords: string[]
  ): Promise<string[]> {
    const prompt = `
      Analyze this resume against the job description and provide 5 specific, actionable suggestions to improve ATS compatibility and job match.

      Resume: ${resumeText.substring(0, 2000)}
      
      Job Description: ${jobDescription.substring(0, 2000)}
      
      Missing Keywords: ${missingKeywords.join(', ')}

      Provide exactly 5 suggestions in this format:
      1. [Specific actionable suggestion]
      2. [Specific actionable suggestion]
      3. [Specific actionable suggestion]
      4. [Specific actionable suggestion]
      5. [Specific actionable suggestion]

      Focus on:
      - Adding relevant missing keywords naturally
      - Improving quantifiable achievements
      - Optimizing section headers and formatting
      - Enhancing skill descriptions
      - Strengthening professional summary
    `;

    try {
      let response: string;

      switch (AI_PROVIDER) {
        case 'openai':
          response = await this.callOpenAI(prompt);
          break;
        case 'groq':
          response = await this.callGroq(prompt);
          break;
        case 'gemini':
          response = await this.callGemini(prompt);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${AI_PROVIDER}`);
      }

      return this.parseSuggestions(response);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [
        'Add more technical skills related to the job requirements',
        'Include quantifiable achievements and metrics in your experience',
        'Optimize your professional summary with industry keywords',
        'Add relevant certifications or training programs',
        'Use more action verbs in your experience descriptions'
      ];
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert ATS resume optimization assistant. Provide specific, actionable advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callGroq(prompt: string): Promise<string> {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert ATS resume optimization assistant. Provide specific, actionable advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callGemini(prompt: string): Promise<string> {
    const response = await fetch(
      `${this.config.baseURL}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  private parseSuggestions(response: string): string[] {
    const lines = response.split('\n').filter(line => line.trim());
    const suggestions = lines
      .filter(line => /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(suggestion => suggestion.length > 0);

    return suggestions.length >= 5 ? suggestions.slice(0, 5) : [
      'Add more technical skills related to the job requirements',
      'Include quantifiable achievements and metrics in your experience',
      'Optimize your professional summary with industry keywords',
      'Add relevant certifications or training programs',
      'Use more action verbs in your experience descriptions'
    ];
  }
  async improveResume({ prompt }: { prompt: string }) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
}
// ...end of AIService class...


export const aiService = new AIService();