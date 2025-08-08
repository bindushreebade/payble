import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function parseReminder(text) {
  const prompt = `You are a reminder assistant. Extract the following from this sentence:
"${text}"

Required fields:
- task: string (description of what to do)
- date: string (YYYY-MM-DD format)
- time: string (HH:MM format in 24-hour time)

Respond ONLY with valid JSON in this exact format:
{
  "task": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' }  // Ensures JSON output
    });

    const content = response.choices[0].message.content;
    const result = JSON.parse(content);
    
    // Basic validation
    if (!result.task || !result.date || !result.time) {
      throw new Error('Missing required fields in response');
    }
    
    return result;
  } catch (err) {
    console.error('Reminder parsing failed:', err.message);
    return { 
      error: 'Failed to parse reminder',
      details: err.message 
    };
  }
}