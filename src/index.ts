import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { readResume } from "./resume/read";
import { readResumeAI } from "./resume/readOpenAi";

const app = new Elysia();

app.use(staticPlugin());

app.get("/", ()=> "Hello world")
app.post("/resume", async (req) => {
  const pdfFile = "public/resume.pdf"
  const jobDescription = "Backend Engineer responsible for designing, developing, and maintaining robust and scalable backend systems for our platform.";

  const result = await readResume(pdfFile, jobDescription)
  return result
})
app.post("/resume-ai", async (req) => {
  const pdfFile = "public/resume.pdf"
  const jobDescription = "Backend Engineer responsible for designing, developing, and maintaining robust and scalable backend systems for our platform.";

  const result = await readResumeAI(pdfFile, jobDescription)
  return result
})
app.listen(3000)
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);