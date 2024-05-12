import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import pdf from "pdf-parse";
import fs from "fs";

dotenv.config();

export const readResumeAI = async (pdfFilePath: string, jobDescription: string) => {
    const googleApiKey = process.env.GOOGLE_API_KEY;

    if (!googleApiKey) {
        throw new Error("Google API key is not provided in the environment variables.");
    }

    const config = new GoogleGenerativeAI(googleApiKey);
    const modelId = "gemini-pro";
    const model = config.getGenerativeModel({ model: modelId });

    const dataBuffer = await pdf(fs.readFileSync(pdfFilePath));
    const resumeText = dataBuffer.text;

    const prompt = `Act like a skilled or very experienced ATS (Application Tracking System).
        Find matching between ${resumeText} and ${jobDescription}.
        I want output only in JSON format like:
        {"candidate_name":"<name candidate>", "match":"<percentage match with job description>",
        "missing_keywords": "<missing keyword on resume>", "profile_summary":"<resume summary>", "reason":"<your reason>"}`

    const response = await model.generateContent(prompt);

    const result = parseResponse(JSON.stringify(response));

    return result;
   
    //return JSON.stringify(response);
}

const parseResponse = (response: string) => {
    // Extract the JSON text from the response
    const responseParse = JSON.parse(response);
    const contentParts = responseParse.response.candidates[0].content.parts;

    // Extract the JSON text from the response parts
    const jsonText = contentParts[0].text;

    // Parse the JSON text
    const result = JSON.parse(jsonText);

    return result;
}
