import { streamText, UIMessage, convertToModelMessages, tool, InferUITools, UIDataTypes } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod'
import { searchDocuments } from '@/server/mcpserver';

interface Document {
    id: string;
    name: string;
    desc: string;
}

const tools = {
    searchKnowledgeBase: tool({
        description: 'ใช้ชื่อค้นหาข้อมูล และส่งผลลัพธ์กลับมา',
        inputSchema: z.object({
            query: z.string()
        }),
        execute: async ({ query }) => {
            try {
                const data: Document[] = await searchDocuments(query)
                if (data.length === 0) {
                    return "ไม่พบข้อมูล"
                }
                return data.map(doc => `ชื่อ: ${doc.name}, รายละเอียด: ${doc.desc}`).join('\n')
            } catch (error) {
                console.log(error);
                return "ไม่พบข้อมูล"
            }
        },
    }),
}
export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export async function POST(req: Request) {
    const {
        messages,
        model,
        webSearch,
    }: {
        messages: ChatMessage[];
        model: string;
        webSearch: boolean;
    } = await req.json();

    const result = streamText({
        model: webSearch ? 'perplexity/sonar' : openai(model),
        messages: await convertToModelMessages(messages),
        tools,
        system: `You are a helpful assistant with access to a knowledge base.
        When users ask questions, search the knowledge base for relevant information.
        Base your answers on the search results when available. 
        Give concise answers that correctly answer what the user is asking for. 
        Do not flood them with all the information from the search results.
        `,
    });
    // send sources and reasoning back to the client
    return result.toUIMessageStreamResponse({
        sendSources: true,
        sendReasoning: true,
    });
}