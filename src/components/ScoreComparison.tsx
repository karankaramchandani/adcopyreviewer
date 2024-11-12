import React from 'react';
import { Gauge, TrendingUp, Shield } from 'lucide-react';

interface ScoreComparisonProps {
  performanceScore: number;
  policyScore: number;
  overallScore: number;
  isOptimized: boolean;
}

function ScoreComparison({ performanceScore, policyScore, overallScore, isOptimized }: ScoreComparisonProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return isOptimized ? 'bg-green-900/30' : 'bg-green-900/20';
    if (score >= 60) return isOptimized ? 'bg-yellow-900/30' : 'bg-yellow-900/20';
    return isOptimized ? 'bg-red-900/30' : 'bg-red-900/20';
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className={`${getScoreBackground(performanceScore)} rounded-lg p-3`}>
        <div className="flex items-center gap-1 mb-1">
          <TrendingUp className="w-4 h-4 text-gray-300" />
          <span className="font-medium text-sm text-gray-300">Performance</span>
        </div>
        <span className={`text-lg font-bold ${getScoreColor(performanceScore)}`}>
          {performanceScore}%
        </span>
      </div>

      <div className={`${getScoreBackground(policyScore)} rounded-lg p-3`}>
        <div className="flex items-center gap-1 mb-1">
          <Shield className="w-4 h-4 text-gray-300" />
          <span className="font-medium text-sm text-gray-300">Policy</span>
        </div>
        <span className={`text-lg font-bold ${getScoreColor(policyScore)}`}>
          {policyScore}%
        </span>
      </div>

      <div className={`${getScoreBackground(overallScore)} rounded-lg p-3`}>
        <div className="flex items-center gap-1 mb-1">
          <Gauge className="w-4 h-4 text-gray-300" />
          <span className="font-medium text-sm text-gray-300">Overall</span>
        </div>
        <span className={`text-lg font-bold ${getScoreColor(overallScore)}`}>
          {overallScore}%
        </span>
      </div>
    </div>
  );
}

export default ScoreComparison;