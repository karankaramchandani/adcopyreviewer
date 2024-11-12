import React from 'react';
import { Wand2 } from 'lucide-react';
import ScoreComparison from './ScoreComparison';
import type { AdAnalysis } from '../types';

interface OptimizedCopyProps {
  originalCopy: string;
  optimizedCopy: string;
  analysis: AdAnalysis;
}

function OptimizedCopy({ originalCopy, optimizedCopy, analysis }: OptimizedCopyProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-8">
      <div className="flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-gray-200">Advanced Analysis</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-300 mb-3">Original Copy</h3>
            <div className="p-6 bg-gray-700 rounded-lg min-h-[200px] whitespace-pre-line">
              <p className="text-gray-300 leading-relaxed">{originalCopy}</p>
            </div>
          </div>
          
          <ScoreComparison
            performanceScore={analysis.viralScore}
            policyScore={analysis.policyScore}
            overallScore={analysis.overallScore}
            isOptimized={false}
          />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-300 mb-3">Optimized Copy</h3>
            <div className="p-6 bg-gray-700 rounded-lg min-h-[200px] border-2 border-purple-500/20 whitespace-pre-line">
              <p className="text-gray-300 leading-relaxed">{optimizedCopy}</p>
            </div>
          </div>

          <ScoreComparison
            performanceScore={Math.min(100, analysis.viralScore + 15)}
            policyScore={100}
            overallScore={Math.min(100, analysis.overallScore + 10)}
            isOptimized={true}
          />
        </div>
      </div>
    </div>
  );
}

export default OptimizedCopy;