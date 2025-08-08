import OpenAI from 'openai';

// Configure OpenRouter instead of OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export default async function parseReminder(text) {
  const prompt = `You are a reminder assistant. Extract the following fields from the sentence:
"${text}"

Return ONLY raw JSON in this format:
{
  "task": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo', // or try 'mistralai/mistral-7b-instruct:free' if this doesn't work
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    const content = response.choices[0].message.content.trim();

    // Clean up any code block formatting from the response
    const jsonString = content.startsWith('```')
      ? content.replace(/^```json?\s*/, '').replace(/```$/, '').trim()
      : content;

    const parsed = JSON.parse(jsonString);

    if (!parsed.task || !parsed.date || !parsed.time) {
      throw new Error('Missing required fields in AI response');
    }

    // Create a JavaScript Date object for the combined due date and time
    // Format expected: date = "YYYY-MM-DD", time = "HH:MM"
    const dueDate = new Date(`${parsed.date}T${parsed.time}:00`);

    return {
      ...parsed,
      dueDate, // This is the new Date object to save in MongoDB
    };
  } catch (err) {
    console.error('Reminder parsing failed:', err.message);
    return null;
  }
}

