import prisma from "../prismaClient.js";

export const findMatchingRecipesService = async (ingredients) => {
    const normalizedIngredients = ingredients.map((item) =>
        item.trim().toLowerCase()
    );

    const recipes = await prisma.recipe.findMany({
        include: {
            recipeIngredients: {
                include: {
                    ingredient: true
                }
            }
        }
    });

    const matchedRecipes = recipes.map((recipe) => {
        const recipeIngredients = recipe.recipeIngredients.map(
            (item) => item.ingredient.name.toLowerCase()
        );

        const matchedIngredients = recipeIngredients.filter(
            (ingredient) => normalizedIngredients.includes(ingredient)
        );

        const missingIngredients = recipeIngredients.filter(
            (ingredient) => !normalizedIngredients.includes(ingredient)
        );

        const matchPercentage = (matchedIngredients.length / recipeIngredients.length) * 100;

        return {
            recipe_id: recipe.recipe_id,
            title: recipe.title,
            description: recipe.description,
            image_url: recipe.image_url,
            difficulty: recipe.difficulty,

            matchedIngredients,
            missingIngredients,

            matchedCount: matchedIngredients.length,
            totalIngredients: recipeIngredients.length,

            matchPercentage: Math.round(matchPercentage)
        };
    });

    const suitableRecipes = matchedRecipes
        .filter((recipe) => recipe.matchPercentage >= 50)
        .sort((a, b) => {
            return b.matchPercentage - a.matchPercentage;
        });


    if (suitableRecipes.length === 0) {
        return {
            type: "ai_offer",
            message:
                "No suitable recipe found. Would you like AI to generate a recipe? (ó﹏ò｡)"
        };
    }

    return {
        type: "database",
        recipes: suitableRecipes
    };
};