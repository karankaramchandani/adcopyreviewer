import type { AdAnalysis, ToneOption, StrategyOption, AdTarget } from '../types';
import { generateOptimizedCopy } from './openai';

const KENNEDY_PRINCIPLES = {
  problem_agitation: ['struggle', 'tired of', 'frustrated', 'sick of', 'worried about'],
  unique_solution: ['unique', 'exclusive', 'proprietary', 'special', 'innovative'],
  social_proof: ['others have', 'people are', 'community', 'join', 'success stories'],
  scarcity: ['limited', 'exclusive access', 'spots available', 'closing soon', 'early access'],
  specificity: [/\d+/, 'specific', 'exact', 'precise', 'detailed'],
};

const TARGET_KEYWORDS = {
  b2b: ['business', 'company', 'professional', 'enterprise', 'solution', 'ROI'],
  b2c: ['you', 'your', 'lifestyle', 'personal', 'home', 'family'],
  ecommerce: ['shop', 'buy', 'order', 'shipping', 'discount', 'sale'],
  local: ['local', 'community', 'neighborhood', 'city', 'area', 'nearby'],
  saas: ['software', 'platform', 'features', 'integration', 'subscription'],
  education: ['learn', 'course', 'training', 'skills', 'certificate'],
  health: ['health', 'wellness', 'fitness', 'nutrition', 'lifestyle'],
  luxury: ['premium', 'exclusive', 'luxury', 'elite', 'sophisticated'],
  parents: ['kids', 'children', 'family', 'parenting', 'school']
};

export async function analyzeAdCopy(
  copy: string,
  tone: ToneOption,
  strategy: StrategyOption,
  target: AdTarget
): Promise<AdAnalysis> {
  const lowerCopy = copy.toLowerCase();
  
  // Policy Violations Check
  const violations: string[] = [];
  const replacements: string[] = [];

  if (lowerCopy.includes('before and after')) {
    violations.push('Before/After images or claims are not allowed in Facebook ads');
    replacements.push('Replace "before and after" with "transformation journey" or "success story"');
  }
  if (lowerCopy.includes('guarantee') || lowerCopy.includes('guaranteed')) {
    violations.push('Avoid absolute guarantees in ad claims');
    replacements.push('Replace "guarantee/guaranteed" with "proven approach" or "demonstrated results"');
  }
  if (lowerCopy.match(/\byou\b.*\bare\b/)) {
    violations.push('Avoid directly addressing personal attributes');
    replacements.push('Rephrase personal statements to focus on the journey or possibility');
  }
  if (lowerCopy.includes('weight loss') || lowerCopy.includes('lose weight')) {
    violations.push('Direct weight loss claims may violate Facebook policies');
    replacements.push('Focus on "healthy lifestyle" or "wellness journey" instead of weight loss');
  }

  // Warnings Check
  const warnings: string[] = [];
  if (copy.length > 125) {
    warnings.push('Ad copy length exceeds recommended length for optimal engagement');
    replacements.push('Consider breaking the message into multiple shorter ads while maintaining the core narrative');
  }

  // Target Audience Analysis
  const targetKeywords = TARGET_KEYWORDS[target === 'general' ? 'b2c' : target];
  const targetWordsFound = targetKeywords.filter(word => lowerCopy.includes(word));
  const targetAudienceScore = Math.round((targetWordsFound.length / targetKeywords.length) * 100);

  // Engagement Prediction
  let engagementPrediction = 'Moderate';
  if (targetAudienceScore > 70 && copy.length <= 125) {
    engagementPrediction = 'High';
  } else if (targetAudienceScore < 30 || copy.length > 200) {
    engagementPrediction = 'Low';
  }

  // Competitive Analysis
  const uniqueValueProps = KENNEDY_PRINCIPLES.unique_solution.some(term => lowerCopy.includes(term));
  const hasScarcity = KENNEDY_PRINCIPLES.scarcity.some(term => lowerCopy.includes(term));
  const hasSocialProof = KENNEDY_PRINCIPLES.social_proof.some(term => lowerCopy.includes(term));
  
  let competitiveAnalysis = '';
  if (uniqueValueProps && hasScarcity && hasSocialProof) {
    competitiveAnalysis = 'Strong competitive positioning with unique value props, scarcity, and social proof';
  } else if ((uniqueValueProps && hasScarcity) || (uniqueValueProps && hasSocialProof)) {
    competitiveAnalysis = 'Good competitive elements but could be strengthened';
  } else {
    competitiveAnalysis = 'Consider adding more competitive differentiators';
  }

  // Keyword Suggestions
  const keywordSuggestions = [
    ...new Set([
      ...targetKeywords.filter(word => !lowerCopy.includes(word)),
      ...KENNEDY_PRINCIPLES.problem_agitation.filter(word => !lowerCopy.includes(word)),
      ...KENNEDY_PRINCIPLES.social_proof.filter(word => !lowerCopy.includes(word))
    ])
  ].slice(0, 5);

  // Kennedy-Style Improvement Suggestions
  const suggestions: string[] = [];

  if (!KENNEDY_PRINCIPLES.problem_agitation.some(term => lowerCopy.includes(term))) {
    suggestions.push('Add emotional problem agitation to create stronger resonance');
  }
  if (!KENNEDY_PRINCIPLES.unique_solution.some(term => lowerCopy.includes(term))) {
    suggestions.push('Highlight your unique solution or proprietary approach');
  }
  if (!KENNEDY_PRINCIPLES.social_proof.some(term => lowerCopy.includes(term))) {
    suggestions.push('Include compelling social proof elements');
  }
  if (!KENNEDY_PRINCIPLES.scarcity.some(term => lowerCopy.includes(term))) {
    suggestions.push('Add natural scarcity or urgency elements');
  }
  if (!KENNEDY_PRINCIPLES.specificity.some(pattern => 
    typeof pattern === 'string' ? lowerCopy.includes(pattern) : pattern.test(lowerCopy)
  )) {
    suggestions.push('Use specific numbers or detailed results to build credibility');
  }

  // Calculate Scores
  const policyScore = Math.max(0, 100 - (violations.length * 25));
  
  const kennedyFactors = [
    KENNEDY_PRINCIPLES.problem_agitation.some(term => lowerCopy.includes(term)),
    KENNEDY_PRINCIPLES.unique_solution.some(term => lowerCopy.includes(term)),
    KENNEDY_PRINCIPLES.social_proof.some(term => lowerCopy.includes(term)),
    KENNEDY_PRINCIPLES.scarcity.some(term => lowerCopy.includes(term)),
    KENNEDY_PRINCIPLES.specificity.some(pattern => 
      typeof pattern === 'string' ? lowerCopy.includes(pattern) : pattern.test(lowerCopy)
    ),
    targetWordsFound.length > 0,
  ];
  
  const viralScore = Math.round((kennedyFactors.filter(Boolean).length / kennedyFactors.length) * 100);
  const overallScore = Math.round((policyScore + viralScore + targetAudienceScore) / 3);

  // Generate optimized copy using GPT-4 with tone and strategy
  const optimizedCopy = await generateOptimizedCopy(copy, tone, strategy);

  return {
    policyScore,
    viralScore,
    overallScore,
    policyViolations: violations,
    warnings,
    suggestions,
    replacements,
    optimizedCopy,
    targetAudienceScore,
    engagementPrediction,
    competitiveAnalysis,
    keywordSuggestions
  };
}