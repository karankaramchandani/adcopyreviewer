import React from 'react';
import { useState } from 'react';
import AdReviewForm from './components/AdReviewForm';
import ScoreCard from './components/ScoreCard';
import PolicyCheck from './components/PolicyCheck';
import OptimizedCopy from './components/OptimizedCopy';
import { analyzeAdCopy } from './utils/adAnalyzer';
import type { AdAnalysis, ToneOption, StrategyOption, AdTarget } from './types';

function App() {
  const [analysis, setAnalysis] = useState<AdAnalysis | null>(null);
  const [currentCopy, setCurrentCopy] = useState<string>('');

  const handleAnalyze = async (
    adCopy: string, 
    tone: ToneOption, 
    strategy: StrategyOption,
    target: AdTarget
  ) => {
    try {
      setCurrentCopy(adCopy);
      const result = await analyzeAdCopy(adCopy, tone, strategy, target);
      setAnalysis(result);
    } catch (error) {
      throw error; // Re-throw to be handled by the form component
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <img 
              src="https://i.ibb.co/B3cxH07/logo.png" 
              alt="Company Logo"
              className="w-24 h-24 object-contain"
            />
            <h1 className="text-4xl font-bold text-white">
              Ad Copy Reviewer
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Validate your Facebook ad copy against policies and get insights on performance potential
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <AdReviewForm onAnalyze={handleAnalyze} />
          </div>

          {analysis && (
            <div className="space-y-6">
              <ScoreCard 
                performanceScore={analysis.viralScore}
                policyScore={analysis.policyScore}
                overallScore={analysis.overallScore}
              />
              
              <PolicyCheck 
                violations={analysis.policyViolations}
                warnings={analysis.warnings}
                suggestions={analysis.suggestions}
                replacements={analysis.replacements}
              />
            </div>
          )}
        </div>

        {analysis && currentCopy && (
          <OptimizedCopy
            originalCopy={currentCopy}
            optimizedCopy={analysis.optimizedCopy}
            analysis={analysis}
          />
        )}
      </div>
    </div>
  );
}

export default App;