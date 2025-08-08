import React from 'react';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';

interface ATSScoreProps {
  score: number;
}

const ATSScore: React.FC<ATSScoreProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return { 
      message: 'Excellent! Your resume is well-optimized for ATS systems.', 
      icon: TrendingUp 
    };
    if (score >= 60) return { 
      message: 'Good progress! There are opportunities for improvement.', 
      icon: Target 
    };
    return { 
      message: 'Needs improvement. Follow our suggestions to boost your score.', 
      icon: TrendingDown 
    };
  };

  const scoreInfo = getScoreMessage(score);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">ATS Compatibility Score</h3>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-6 lg:space-y-0">
        {/* Score Circle */}
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32 mx-auto lg:mx-0">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={`transition-all duration-1000 ease-in-out bg-gradient-to-r ${getScoreGradient(score)}`}
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={score >= 80 ? 'stop-green-500' : score >= 60 ? 'stop-yellow-500' : 'stop-red-500'} />
                  <stop offset="100%" className={score >= 80 ? 'stop-emerald-600' : score >= 60 ? 'stop-orange-600' : 'stop-rose-600'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </div>
                <div className="text-sm text-gray-500">ATS Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1">
          <div className={`p-4 rounded-lg border ${getScoreBg(score)} mb-4`}>
            <div className="flex items-center space-x-3">
              <scoreInfo.icon className={`w-5 h-5 ${getScoreColor(score)}`} />
              <p className={`font-medium ${getScoreColor(score)}`}>
                {scoreInfo.message}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{Math.floor(score * 0.8)}</div>
              <div className="text-sm text-gray-600">Keywords Matched</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{100 - Math.floor(score * 0.8)}</div>
              <div className="text-sm text-gray-600">Keywords Missing</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ATS systems</strong> scan resumes for keywords and phrases. A higher score increases your chances of passing the initial screening.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScore;