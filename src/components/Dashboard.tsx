import React from 'react';
import { BarChart, TrendingUp, Award, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  score: number;
  totalKeywords: number;
  matchedKeywords: number;
}

const Dashboard: React.FC<DashboardProps> = ({ score, totalKeywords, matchedKeywords }) => {
  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100', icon: Award };
    if (score >= 60) return { level: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: TrendingUp };
    return { level: 'Needs Work', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle };
  };

  const scoreInfo = getScoreLevel(score);

  const stats = [
    {
      title: 'Overall Score',
      value: `${score}%`,
      change: score >= 70 ? '+12%' : '-5%',
      positive: score >= 70,
      icon: BarChart
    },
    {
      title: 'Keywords Match',
      value: `${matchedKeywords}/${totalKeywords}`,
      change: `${Math.round((matchedKeywords / totalKeywords) * 100)}%`,
      positive: matchedKeywords / totalKeywords >= 0.6,
      icon: TrendingUp
    },
    {
      title: 'ATS Compatibility',
      value: scoreInfo.level,
      change: score >= 70 ? 'Strong' : 'Weak',
      positive: score >= 70,
      icon: scoreInfo.icon
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Dashboard</h3>
        
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <stat.icon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">{stat.title}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stat.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Skill Gap Analysis</h4>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Technical Skills</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Soft Skills</span>
              <span>60%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Experience Level</span>
              <span>85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <Award className="w-6 h-6" />
          <h4 className="text-lg font-semibold">Resume Score</h4>
        </div>
        <div className="text-3xl font-bold mb-2">{score}/100</div>
        <p className="text-blue-100 text-sm">
          {score >= 80 ? 'Outstanding! Your resume is highly optimized.' : 
           score >= 60 ? 'Good progress! A few tweaks will make it perfect.' : 
           'Keep improving! Follow our suggestions for better results.'}
        </p>
      </div>

  </div>  
  );
};

export default Dashboard;