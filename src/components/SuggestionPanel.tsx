import React from 'react';
import { Lightbulb, Star } from 'lucide-react';

interface SuggestionPanelProps {
  suggestions: string[];
}

const SuggestionPanel: React.FC<SuggestionPanelProps> = ({ suggestions }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">AI-Powered Suggestions</h3>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="group p-6 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg border border-blue-200 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{index + 1}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium leading-relaxed">{suggestion}</p>
              </div>
              
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Star className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">Pro Tip</h4>
            <p className="text-sm text-amber-700">
              Implement these suggestions gradually. Start with the highest-impact changes like adding missing keywords that match your actual experience.
            </p>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default SuggestionPanel;