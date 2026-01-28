import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 150,
    separators: [
        "\n\n",           // ย่อหน้า
        "\n",             // บรรทัด
        " ",              // fallback สุดท้าย
    ],
});

export async function chunkContent(content: string) {
    return await textSplitter.splitText(content.trim());
}