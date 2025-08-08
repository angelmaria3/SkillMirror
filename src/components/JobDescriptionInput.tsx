import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface JobDescriptionInputProps {
  onSubmit: (description: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onSubmit }) => {
  const [description, setDescription] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    setIsValid(value.trim().length > 100); // Require at least 100 characters
  };

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(description);
    }
  };

  const loadSampleJD = () => {
    const sampleJD = `Job Title: Senior Frontend Developer

We are seeking a talented Senior Frontend Developer to join our dynamic team. The ideal candidate will have expertise in modern JavaScript frameworks and a passion for creating exceptional user experiences.

Key Responsibilities:
• Develop and maintain scalable web applications using React and TypeScript
• Collaborate with UX/UI designers to implement pixel-perfect designs
• Optimize applications for maximum speed and scalability
• Write clean, maintainable, and well-documented code
• Participate in code reviews and mentor junior developers
• Work closely with backend developers to integrate APIs
• Implement responsive designs and ensure cross-browser compatibility

Required Skills:
• 5+ years of experience in frontend development
• Expert knowledge of JavaScript, HTML5, and CSS3
• Strong proficiency in React and modern JavaScript frameworks
• Experience with TypeScript and state management libraries
• Familiarity with build tools like Webpack, Vite, or similar
• Knowledge of version control systems (Git)
• Understanding of RESTful APIs and asynchronous programming
• Experience with testing frameworks (Jest, React Testing Library)

Preferred Qualifications:
• Experience with Node.js and backend development
• Knowledge of cloud platforms (AWS, Azure, or GCP)
• Familiarity with CI/CD pipelines
• Understanding of web accessibility standards
• Bachelor's degree in Computer Science or related field

What We Offer:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements and remote work options
• Professional development opportunities
• Collaborative and innovative work environment`;

    setDescription(sampleJD);
    setIsValid(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Job Description</h3>
          </div>
          <button
            onClick={loadSampleJD}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Sample</span>
          </button>
        </div>
        <p className="text-gray-600">
          Paste the complete job description here. The more detailed it is, the better our analysis will be.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <textarea
            value={description}
            onChange={handleChange}
            placeholder="Paste the job description here..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            style={{ minHeight: '16rem' }}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {description.length} characters
              {description.length < 100 && (
                <span className="text-amber-600 ml-2">
                  (Minimum 100 characters required)
                </span>
              )}
            </p>
            {isValid && (
              <div className="flex items-center space-x-1 text-green-600 text-sm">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Ready to analyze</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 min-w-40 ${
              isValid
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Analyze Resume
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-1 rounded">
            <Search className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Pro Tip</h4>
            <p className="text-sm text-blue-800">
              Include the complete job posting with requirements, responsibilities, and preferred qualifications for the most accurate analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionInput;