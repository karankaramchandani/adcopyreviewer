import React from 'react';
import { Gauge, TrendingUp, Shield } from 'lucide-react';

interface ScoreCardProps {
  performanceScore: number;
  policyScore: number;
  overallScore: number;
}

function ScoreCard({ performanceScore, policyScore, overallScore }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-900/30';
    if (score >= 60) return 'bg-yellow-900/30';
    return 'bg-red-900/30';
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Analysis Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${getScoreBackground(performanceScore)} rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-gray-300" />
            <span className="font-medium text-gray-300">Performance</span>
          </div>
          <span className={`text-3xl font-bold ${getScoreColor(performanceScore)}`}>
            {performanceScore}%
          </span>
        </div>

        <div className={`${getScoreBackground(policyScore)} rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-gray-300" />
            <span className="font-medium text-gray-300">Policy Score</span>
          </div>
          <span className={`text-3xl font-bold ${getScoreColor(policyScore)}`}>
            {policyScore}%
          </span>
        </div>

        <div className={`${getScoreBackground(overallScore)} rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-5 h-5 text-gray-300" />
            <span className="font-medium text-gray-300">Overall Score</span>
          </div>
          <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;