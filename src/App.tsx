import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import { Upload, FileText, Target, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { aiService } from './services/aiService';
import { fileParser, ParsedFile } from './services/fileParser';
import FileUpload from './components/FileUpload';
import JobDescriptionInput from './components/JobDescriptionInput';
import ATSScore from './components/ATSScore';
import KeywordAnalysis from './components/KeywordAnalysis';
import SuggestionPanel from './components/SuggestionPanel';
import Dashboard from './components/Dashboard';

interface AnalysisResult {
  score: number;
  extractedKeywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState<ParsedFile | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [improvedResume, setImprovedResume] = useState<string | null>(null);
  const [isImproving, setIsImproving] = useState(false);

  const handleImproveResume = async () => {
    if (!resumeData || !analysisResult) return;
    setIsImproving(true);
    setError(null);
    try {
      const prompt = `
        Here is my resume:
        ${resumeData.content}

        Here are suggestions for improvement:
        ${analysisResult.suggestions.join('\n')}

        Please rewrite my resume to incorporate these suggestions and optimize it for the job description.
      `;
      const improved = await aiService.improveResume({ prompt });
      setImprovedResume(improved);
    } catch (error) {
      setError("Failed to improve resume.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    try {
      setError(null);
      const parsedFile = await fileParser.parseFile(file);
      setResumeData(parsedFile);
      setCurrentStep(2);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload resume');
    }
  };

  const handleResumeUploadLegacy = (fileName: string, content: string) => {
    setResumeData({ fileName, content, fileType: 'mock' });
    setCurrentStep(2);
  };

  const handleJobDescriptionSubmit = (description: string) => {
    setJobDescription(description);
    setCurrentStep(3);
    performAnalysis(description);
  };

  const performAnalysis = async (description: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      if (!resumeData) {
        throw new Error('Resume data not found');
      }

      const result = await aiService.analyzeResume({
        resumeText: resumeData.content,
        jobDescription: description
      });

      setAnalysisResult(result);
      setCurrentStep(4);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');

      // Fallback to mock data if API fails
      const mockKeywords = [
        'JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'SQL',
        'Machine Learning', 'Data Analysis', 'Communication', 'Leadership',
        'Project Management', 'Git', 'API', 'Database', 'Frontend'
      ];

      const mockMatched = mockKeywords.slice(0, 8);
      const mockMissing = mockKeywords.slice(8);

      const mockSuggestions = [
        'Add more technical skills related to the job requirements',
        'Include quantifiable achievements and metrics',
        'Optimize your professional summary with industry keywords',
        'Add relevant certifications or training programs',
        'Include more action verbs in your experience descriptions'
      ];

      const score = Math.floor((mockMatched.length / mockKeywords.length) * 100);

      setAnalysisResult({
        score,
        extractedKeywords: mockKeywords,
        matchedKeywords: mockMatched,
        missingKeywords: mockMissing,
        suggestions: mockSuggestions
      });

      setCurrentStep(4);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Upload Resume', icon: Upload },
    { number: 2, title: 'Job Description', icon: FileText },
    { number: 3, title: 'Analysis', icon: Target },
    { number: 4, title: 'Results', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">SkillMirror</h1>
                <p className="text-gray-600">Industry Readiness Analyzer</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 ml-4 ${
                      currentStep > step.number ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-medium">Error</p>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Resume</h2>
              <p className="text-gray-600">
                Start by uploading your current resume. We support PDF and DOCX formats.
              </p>
            </div>
            <FileUpload onUpload={handleResumeUploadLegacy} />
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Job Description</h2>
              <p className="text-gray-600">
                Paste the job description you're applying for. Our AI will analyze it to optimize your resume.
              </p>
            </div>
            <JobDescriptionInput onSubmit={handleJobDescriptionSubmit} />
          </div>
        )}

        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Your Resume</h2>
              <p className="text-gray-600 mb-6">
                Our AI is comparing your resume against the job description and calculating your ATS score.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>This may take a few moments...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && analysisResult && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Analysis Complete!</h2>
              <p className="text-gray-600 text-lg">
                Here's your personalized resume optimization report.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <ATSScore score={analysisResult.score} />
                <KeywordAnalysis
                  matched={analysisResult.matchedKeywords}
                  missing={analysisResult.missingKeywords}
                />
                <SuggestionPanel suggestions={analysisResult.suggestions} />
                {/* Show improved resume if available */}
                {improvedResume && (
                  <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Your Improved Resume:</h3>
                    <pre className="whitespace-pre-wrap">{improvedResume}</pre>
                  </div>
                )}
                {/* Button to generate improved resume */}
                
              </div>

              <div className="lg:col-span-1">
                <Dashboard
                  score={analysisResult.score}
                  totalKeywords={analysisResult.extractedKeywords.length}
                  matchedKeywords={analysisResult.matchedKeywords.length}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;