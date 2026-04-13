import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// Featherless AI uses OpenAI-compatible SDK
console.log('Featherless Key exists:', !!process.env.FEATHERLESS_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.FEATHERLESS_API_KEY || 'dummy_key',
  baseURL: 'https://api.featherless.ai/v1',
});

// Use a high-quality model available on Featherless (e.g., Llama 3 or similar)
const DEFAULT_MODEL = process.env.FEATHERLESS_MODEL || "meta-llama/Llama-3-8b-instruct";

/**
 * Generate financial advice based on expenses and budget
 */
export const getFinancialAdvice = async (expenses, monthlyIncome, query) => {
  try {
    const expenseSummary = expenses.map(e => `${e.category}: $${e.amount} (${e.note || 'no note'})`).join(', ');
    
    const systemPrompt = `You are LifeOS Finance AI, a world-class financial advisor. 
    User's Monthly Income: $${monthlyIncome}. 
    Recent Expenses: ${expenseSummary || 'No expenses yet'}.
    Provide concise, data-driven, and slightly futuristic/professional advice. 
    Focus on behavioral patterns and actionable steps.`;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Featherless AI Error:', error);
    return "I'm having trouble connecting to my financial intelligence core. Please check your Featherless API key and connection.";
  }
};

/**
 * Analyze spending personality and predict future trends
 */
export const getSpendingAnalysis = async (expenses, monthlyIncome) => {
  try {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const systemPrompt = `You are a financial data scientist. Analyze this spending data:
    Income: $${monthlyIncome}
    Total Spent: $${totalSpent}
    Category Breakdown: ${JSON.stringify(categoryTotals)}
    
    Provide a JSON response with:
    1. "personality": A unique profile name (e.g., "The Impulsive Explorer", "The Disciplined Architect").
    2. "prediction": Expected total spend for next month based on current velocity.
    3. "riskLevel": LOW, MEDIUM, or HIGH.
    4. "advice": One specific habit to change.
    
    RETURN ONLY RAW JSON.`;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    return { personality: "The Stealth Saver", prediction: (monthlyIncome * 0.8).toFixed(2), riskLevel: "LOW", advice: "Connection to neural brain lost. Stay frugal." };
  }
};

/**
 * Predict if an expense is affordable
 */
export const checkAffordability = async (amount, category, expenses, monthlyIncome) => {
  try {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = monthlyIncome - totalSpent;

    const systemPrompt = `Analyze if a user can afford a $${amount} purchase for ${category}.
    Context:
    Monthly Income: $${monthlyIncome}
    Total Spent so far: $${totalSpent}
    Remaining Budget: $${remaining}
    Recent spending history: ${expenses.slice(0, 5).map(e => e.category + ': $' + e.amount).join(', ')}
    
    Give a 'YES', 'NO', or 'CAUTION' verdict followed by a 1-sentence explanation.`;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.5,
    });

    return response.choices[0].message.content;
  } catch (error) {
    return "Verification offline. Proceed with manual caution.";
  }
};