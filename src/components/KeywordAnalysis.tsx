import React from 'react';
import { CheckCircle, XCircle, Hash } from 'lucide-react';

interface KeywordAnalysisProps {
  matched: string[];
  missing: string[];
}

const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({ matched, missing }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
          <Hash className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Keyword Analysis</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Matched Keywords */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              Matched Keywords ({matched.length})
            </h4>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {matched.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <span className="font-medium text-green-800">{keyword}</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Great job!</strong> These keywords from the job description were found in your resume.
            </p>
          </div>
        </div>

        {/* Missing Keywords */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <XCircle className="w-5 h-5 text-red-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              Missing Keywords ({missing.length})
            </h4>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {missing.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <span className="font-medium text-red-800">{keyword}</span>
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Opportunity:</strong> Consider incorporating these keywords if they match your experience.
            </p>
          </div>
        </div>
      </div>

      {/* Keyword Density Chart */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Keyword Match Rate</h4>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Matched</span>
              <span>{Math.round((matched.length / (matched.length + missing.length)) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000 ease-in-out"
                style={{ width: `${(matched.length / (matched.length + missing.length)) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{matched.length}</div>
            <div className="text-sm text-gray-600">of {matched.length + missing.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordAnalysis;