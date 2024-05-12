import { Ollama } from "@langchain/community/llms/ollama";
import pdf from "pdf-parse";
import fs from "fs";

export const readResume = async (pdfFilePath: string, jobDescription: string) => {
    const ollama = new Ollama({
        baseUrl: "http://localhost:11434",
        model: "codellama",
    });

    const dataBuffer = await pdf(fs.readFileSync(pdfFilePath));
    const resumeText = dataBuffer.text;

    const stream = await ollama.stream(
        `Act Like a skilled or very experience ATS(Application Tracking System)
        find matching between ${resumeText} and ${jobDescription}
        I want output only in json format like :
        {"candidate_name":<name candidate>, "match":<percentage match with job description>,"missing_keywords": <missing keyword on resume>,"profile_summary":"<resume summary>", "reason":<your reason>}`
    );

    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }

    return chunks.join("");
}