import React, { useState } from 'react';
import { Send, Key, Settings, Save, History, Target } from 'lucide-react';
import { initializeOpenAI } from '../utils/openai';
import { db } from '../db/db';
import type { ToneOption, StrategyOption, AdTarget } from '../types';
import { toneOptions, strategyOptions, targetOptions } from '../utils/copyOptions';
import toast from 'react-hot-toast';

interface AdReviewFormProps {
  onAnalyze: (adCopy: string, tone: ToneOption, strategy: StrategyOption, target: AdTarget) => Promise<void>;
}

function AdReviewForm({ onAnalyze }: AdReviewFormProps) {
  const [adCopy, setAdCopy] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ToneOption>('professional');
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyOption>('direct-response');
  const [selectedTarget, setSelectedTarget] = useState<AdTarget>('general');
  const [adName, setAdName] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [savedAds, setSavedAds] = useState<Array<{id: number; name: string; copy: string}>>([]);

  React.useEffect(() => {
    loadSavedAds();
  }, []);

  const loadSavedAds = async () => {
    try {
      const ads = await db.adCopies.toArray();
      setSavedAds(ads);
    } catch (error) {
      console.error('Failed to load saved ads:', error);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (apiKey.trim()) {
      try {
        initializeOpenAI(apiKey.trim());
        setApiKeySet(true);
        setShowApiKey(false);
        toast.success('API key set successfully');
      } catch (err: any) {
        setError(err.message || 'Failed to set API key');
        toast.error('Failed to set API key');
      }
    }
  };

  const handleSave = async () => {
    if (!adName.trim() || !adCopy.trim()) {
      toast.error('Please provide both a name and copy for the ad');
      return;
    }

    try {
      await db.adCopies.add({
        name: adName.trim(),
        copy: adCopy.trim(),
        timestamp: Date.now(),
        userId: 1
      });
      toast.success('Ad saved successfully');
      loadSavedAds();
      setAdName('');
    } catch (error) {
      console.error('Failed to save ad:', error);
      toast.error('Failed to save ad');
    }
  };

  const handleLoadAd = (savedAd: {id: number; name: string; copy: string}) => {
    setAdCopy(savedAd.copy);
    setAdName(savedAd.name);
    setShowHistory(false);
    toast.success('Ad loaded successfully');
  };

  const handleDeleteAd = async (id: number) => {
    try {
      await db.adCopies.delete(id);
      toast.success('Ad deleted successfully');
      loadSavedAds();
    } catch (error) {
      console.error('Failed to delete ad:', error);
      toast.error('Failed to delete ad');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!adCopy.trim()) {
      toast.error('Please enter ad copy');
      return;
    }

    if (!apiKeySet) {
      setShowApiKey(true);
      return;
    }

    try {
      setIsAnalyzing(true);
      await onAnalyze(adCopy, selectedTone, selectedStrategy, selectedTarget);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze ad copy';
      setError(errorMessage);
      toast.error(errorMessage);
      if (errorMessage.includes('API key')) {
        setApiKeySet(false);
        setShowApiKey(true);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (showApiKey) {
    return (
      <form onSubmit={handleApiKeySubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-200 mb-2">
            OpenAI API Key
          </label>
          <div className="relative">
            <input
              type="password"
              id="apiKey"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <Key className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Your API key is required to use GPT-4 for optimization. It's never stored on our servers.
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Set API Key
          </button>
          <button
            type="button"
            onClick={() => {
              setShowApiKey(false);
              setError(null);
            }}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  if (showHistory) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-200">Saved Ads</h3>
          <button
            onClick={() => setShowHistory(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
        
        {savedAds.length === 0 ? (
          <p className="text-gray-400">No saved ads found</p>
        ) : (
          <div className="space-y-4">
            {savedAds.map((ad) => (
              <div key={ad.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-200">{ad.name}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoadAd(ad)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteAd(ad.id!)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">{ad.copy}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <History className="w-4 h-4" />
          Load Saved Ad
        </button>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <Settings className="w-4 h-4" />
          {showAdvanced ? 'Hide Options' : 'Show Options'}
        </button>
      </div>

      <div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="adName" className="block text-sm font-medium text-gray-200 mb-2">
              Ad Name
            </label>
            <input
              type="text"
              id="adName"
              value={adName}
              onChange={(e) => setAdName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Name your ad for easy reference..."
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 mt-8 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>

        <label htmlFor="adCopy" className="block text-sm font-medium text-gray-200 mb-2">
          Ad Copy
        </label>
        <textarea
          id="adCopy"
          rows={8}
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Paste your Facebook ad copy here..."
          value={adCopy}
          onChange={(e) => setAdCopy(e.target.value)}
          required
        />
      </div>

      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-700/50 rounded-lg">
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-200 mb-2">
              Tone of Voice
            </label>
            <select
              id="tone"
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value as ToneOption)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {toneOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="strategy" className="block text-sm font-medium text-gray-200 mb-2">
              Copywriting Strategy
            </label>
            <select
              id="strategy"
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value as StrategyOption)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {strategyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="target" className="block text-sm font-medium text-gray-200 mb-2">
              Target Audience
            </label>
            <select
              id="target"
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value as AdTarget)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {targetOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isAnalyzing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 relative disabled:opacity-70"
      >
        <Send className="w-5 h-5" />
        {isAnalyzing ? 'Analyzing...' : 'Analyze Ad Copy'}
        {isAnalyzing && (
          <div className="absolute bottom-0 left-0 h-1 bg-blue-400 rounded-b-lg transition-all duration-3000 w-full animate-progress"></div>
        )}
      </button>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setShowApiKey(true);
            setError(null);
          }}
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <Key className="w-4 h-4" />
          {apiKeySet ? 'Change API Key' : 'Set API Key'}
        </button>
      </div>
    </form>
  );
}

export default AdReviewForm;