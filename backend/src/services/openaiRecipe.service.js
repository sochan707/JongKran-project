const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const recipeSchema = {
  name: "generated_recipe",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
      cookTime: { type: "integer" },
      ingredients: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            quantity: { type: "string" },
            unit: { type: "string" },
          },
          required: ["name", "quantity", "unit"],
        },
      },
      steps: {
        type: "array",
        items: { type: "string" },
      },
    },
    required: [
      "title",
      "description",
      "difficulty",
      "cookTime",
      "ingredients",
      "steps",
    ],
  },
  strict: true,
};

const extractOutputText = (responseBody) => {
  if (typeof responseBody.output_text === "string") {
    return responseBody.output_text;
  }

  return responseBody.output
    ?.flatMap((item) => item.content || [])
    .map((content) => content.text)
    .filter(Boolean)
    .join("\n");
};

export const generateRecipeFromIngredients = async (ingredients) => {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("OPENAI_API_KEY is not configured");
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions:
        "You are a recipe assistant. Create one practical recipe using the user's available ingredients. You may add pantry staples such as salt, pepper, oil, and water. Return only valid JSON that matches the requested schema.",
      input: `Available ingredients: ${ingredients.join(", ")}`,
      text: {
        format: {
          type: "json_schema",
          ...recipeSchema,
        },
      },
    }),
  });

  const responseBody = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      responseBody.error?.message || "OpenAI failed to generate a recipe";
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  const outputText = extractOutputText(responseBody);

  if (!outputText) {
    const error = new Error("OpenAI response did not include recipe text");
    error.statusCode = 502;
    throw error;
  }

  return JSON.parse(outputText);
};
