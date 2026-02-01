import { streamText, UIMessage, convertToModelMessages,tool } from 'ai';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch,
  }: { 
    messages: UIMessage[]; 
    model: string; 
    webSearch: boolean;
  } = await req.json();
  const result = streamText({
    model: webSearch ? 'perplexity/sonar' : openai(model),
    messages: await convertToModelMessages(messages),
    system:
      'You are a helpful assistant that can answer questions and help with tasks',
  });
  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}