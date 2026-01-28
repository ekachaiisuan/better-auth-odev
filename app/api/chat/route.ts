import { streamText, UIMessage, convertToModelMessages, tool, InferUITools, UIDataTypes, stepCountIs } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { searchDocuments } from "@/server/search"

const tools = {
    searchKnowledgeBase: tool({
        description: "Search the knowledge base for relevant information",
        inputSchema: z.object({
            query: z.string().describe("The search query to find relevant documents"),
        }),
        execute: async ({ query }) => {
            try {
                // Search the vector database
                const results = await searchDocuments(query, 3, 0.5);

                if (results.length === 0) {
                    return "No relevant information found in the knowledge base.";
                }

                // Format results for the AI
                const formattedResults = results
                    .map((r, i) => `[${i + 1}] ${r.content}`)
                    .join("\n\n");

                return formattedResults;
            } catch (error) {
                console.error("Search error:", error);
                return "Error searching the knowledge base.";
            }
        },
    }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>

export async function POST(req: Request) {
    try {
        const { messages }: { messages: ChatMessage[] } = await req.json()
        const result = streamText({
            model: openai("gpt-4.1-nano"),
            messages: await convertToModelMessages(messages),
            tools,
            system: "You are a helpful assistant with access to a knowledge base. When a user asks a question, search for relevant information only from the knowledge base. If the information is not found in the knowledge base, answer that there is no information.",
            stopWhen: stepCountIs(2),
        })

        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.error("Error in chat route", error)
        return new Response("Internal Server Error", {
            status: 500,
        })
    }
}
