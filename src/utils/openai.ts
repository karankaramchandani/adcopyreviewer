import OpenAI from 'openai';
import type { ToneOption, StrategyOption } from '../types';

let openaiInstance: OpenAI | null = null;

export function initializeOpenAI(apiKey: string) {
  openaiInstance = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
}

export async function generateOptimizedCopy(
  originalCopy: string,
  tone: ToneOption,
  strategy: StrategyOption
): Promise<string> {
  if (!openaiInstance) {
    throw new Error('OpenAI not initialized. Please set your API key first.');
  }

  try {
    const toneDescriptions = {
      professional: 'formal and business-like',
      friendly: 'warm and approachable',
      confident: 'assertive and self-assured',
      casual: 'relaxed and conversational',
      authoritative: 'expert and commanding',
      empathetic: 'understanding and compassionate'
    };

    const strategyDescriptions = {
      'direct-response': 'focus on immediate action and clear call-to-actions',
      'storytelling': 'use narrative elements to engage and connect',
      'problem-solution': 'highlight pain points and present your solution',
      'benefit-driven': 'emphasize specific benefits and outcomes',
      'scarcity-based': 'create urgency through limited availability or time',
      'social-proof': 'leverage testimonials and social validation'
    };

    const prompt = `As an expert Facebook ad copywriter, optimize the following ad copy using a ${toneDescriptions[tone]} tone 
and a ${strategyDescriptions[strategy]} approach.

Original Copy:
${originalCopy}

Guidelines:
1. Maintain the core message and offering
2. Avoid policy violations (no before/after claims, no guarantees)
3. Use natural, conversational language
4. Include emotional triggers
5. Make it more persuasive
6. Keep it concise
7. Ensure proper formatting with paragraphs
8. Apply the specified tone consistently
9. Follow the chosen copywriting strategy
10. Maintain Facebook compliance

Provide only the optimized copy without any explanations or additional text.`;

    const completion = await openaiInstance.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert Facebook ad copywriter who specializes in creating high-converting, policy-compliant ad copy."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content || originalCopy;
  } catch (error: any) {
    console.error('Error generating optimized copy:', error);
    if (error?.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI API key and try again.');
    }
    throw new Error('Failed to generate optimized copy. Please try again.');
  }
}