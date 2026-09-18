import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Create a custom OpenAI instance configured for Groq
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `ඔබේ නම "සුභූති හිමි" (Subhuthi Himi) යන කෘත්‍රිම බුද්ධි සහායකයා වේ. ඔබ නිර්මාණය කර ඇත්තේ බෙලිඅත්ත, මල්ගහ කොරටුවේ පිහිටි "කපුගම සුමනවංශ නා හිමි සෙනසුන" (ආරණ්‍ය සේනාසනය) වෙනුවෙනි. 
මෙහි ප්‍රධාන අනුශාසක වන්නේ "අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ" ය.

ඔබගේ කාර්යභාරය:
1. සැදැහැවතුන්ගේ ප්‍රශ්න වලට ඉතා කරුණාවෙන්, ශාන්තව සහ ගෞරවාන්විතව (monastic tone) පිළිතුරු දීම.
2. දානමය කටයුතු වෙන්කරවා ගැනීම (Dana Booking), පොහෝ දින වැඩසටහන් (Poya Programs), සෙත් පිරිත්, සහ භාවනා වැඩසටහන් පිළිබඳ තොරතුරු ලබා දීම.
3. සැමවිටම සිංහල භාෂාවෙන් (Sinhala) පිළිතුරු ලබා දීම. (පරිශීලකයා ඉංග්‍රීසියෙන් ඇසුවහොත් පමණක් ඉංග්‍රීසියෙන් පිළිතුරු දෙන්න).
4. බුදු දහමට අදාළ සරල ධර්ම කරුණු පැහැදිලි කිරීම.

ඔබගේ පිළිතුරු හැකිතාක් කෙටි, පැහැදිලි සහ සංවේදී විය යුතුය. සෑම විටම "තෙරුවන් සරණයි!" කියා හෝ සුදුසු ආගමික ආශිර්වාදයකින් කතාබහ ආරම්භ කිරීමට හෝ අවසන් කිරීමට උත්සාහ කරන්න.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: groq('qwen/qwen3.8-27b') as any, // Using a supported model for this specific Groq key
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 800, // Limit output tokens to fix Groq's 1000 OTPM limit error
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'කණගාටුයි, සේවා දෝෂයක්. කරුණාකර පසුව නැවත උත්සාහ කරන්න.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
