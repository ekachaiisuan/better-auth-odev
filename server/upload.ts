"use server";

import { PDFParse } from "pdf-parse";
import { db } from "@/db/drizzle";
import { documents } from "@/db/schema";
import { generateEmbeddings } from "@/lib/embeddings";
import { chunkContent } from "@/lib/chunking";

export async function processPdfFile(formData: FormData) {
    try {
        const file = formData.get("pdf") as File;
        const documentId = formData.get("documentId") as string;

        // Convert File to Buffer and extract text
        const bytes = await file.arrayBuffer();
        const uint8Array = new Uint8Array(bytes);

        const pdf = new PDFParse(uint8Array);
        const data = await pdf.getText();

        if (!data.text || data.text.trim().length === 0) {
            return {
                success: false,
                error: "No text found in PDF",
            };
        }

        // Chunk the text
        const chunks = await chunkContent(data.text);

        // Generate embeddings
        const embeddings = await generateEmbeddings(chunks);

        // Store in database
        const records = chunks.map((chunk, index) => ({
            content: chunk,
            embedding: embeddings[index],
            documentId: documentId,
        }));

        await db.insert(documents).values(records);

        return {
            success: true,
            message: `Created ${records.length} searchable chunks`,
        };
    } catch (error) {
        console.error("PDF processing error:", error);
        return {
            success: false,
            error: "Failed to process PDF",
        };
    }
}