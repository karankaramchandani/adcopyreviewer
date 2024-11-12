import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Replace } from 'lucide-react';

interface PolicyCheckProps {
  violations?: string[];
  warnings?: string[];
  suggestions?: string[];
  replacements?: string[];
}

function PolicyCheck({ 
  violations = [], 
  warnings = [], 
  suggestions = [], 
  replacements = [] 
}: PolicyCheckProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Policy Analysis</h2>

      {violations.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="font-medium text-gray-200">Policy Violations</h3>
          </div>
          <ul className="space-y-2">
            {violations.map((violation, index) => (
              <li key={index} className="flex items-start gap-2 text-red-400">
                <span className="text-sm">{violation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h3 className="font-medium text-gray-200">Warnings</h3>
          </div>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2 text-yellow-400">
                <span className="text-sm">{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="font-medium text-gray-200">Improvement Suggestions</h3>
          </div>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-green-400">
                <span className="text-sm">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {replacements.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Replace className="w-5 h-5 text-blue-400" />
            <h3 className="font-medium text-gray-200">Suggested Replacements</h3>
          </div>
          <ul className="space-y-2">
            {replacements.map((replacement, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-400">
                <span className="text-sm">{replacement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PolicyCheck;