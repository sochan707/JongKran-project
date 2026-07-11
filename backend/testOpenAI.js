import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function test() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Generate 1 simple Khmer recipe with rice, chicken, egg in JSON." }],
      temperature: 0.7
    });

    console.log(response.choices[0].message.content);
  } catch (err) {
    console.error(err);
  }
}

test();