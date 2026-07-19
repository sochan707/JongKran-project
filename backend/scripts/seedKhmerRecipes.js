import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userId = Number(process.env.SEED_USER_ID || 1);

const recipes = [
  {
    title: "Fish Amok",
    description:
      "Traditional Khmer steamed fish curry made with coconut milk and aromatic kroeung paste.",
    difficulty: "medium",
    prep_time: 25,
    cook_time: 35,
    servings: 4,
    image_url: null,
    ingredients: [
      { name: "Fish", quantity: 500, unit: "g" },
      { name: "Coconut milk", quantity: 400, unit: "ml" },
      { name: "Lemongrass", quantity: 30, unit: "g" },
      { name: "Galangal", quantity: 10, unit: "g" },
      { name: "Turmeric", quantity: 5, unit: "g" },
      { name: "Garlic", quantity: 10, unit: "g" },
      { name: "Shallot", quantity: 30, unit: "g" },
      { name: "Kaffir lime leaf", quantity: 5, unit: "leaf" },
      { name: "Fish sauce", quantity: 30, unit: "ml" },
      { name: "Palm sugar", quantity: 15, unit: "g" },
      { name: "Egg", quantity: 1, unit: "piece" },
      { name: "Red chili", quantity: 1, unit: "piece" },
    ],
    steps: [
      "Finely chop the lemongrass, galangal, turmeric, garlic, shallot, and kaffir lime leaves.",
      "Blend or pound the chopped aromatics into a smooth kroeung paste.",
      "Mix the kroeung with coconut milk, fish sauce, palm sugar, and egg.",
      "Cut the fish into medium pieces and coat it with the curry mixture.",
      "Place the mixture in a heat-safe bowl and steam until the fish is fully cooked.",
      "Garnish with sliced red chili and serve warm.",
    ],
  },
  {
    title: "Beef Lok Lak",
    description:
      "Khmer-style stir-fried beef served with rice, fresh vegetables, and lime pepper sauce.",
    difficulty: "easy",
    prep_time: 20,
    cook_time: 15,
    servings: 4,
    image_url: null,
    ingredients: [
      { name: "Beef", quantity: 500, unit: "g" },
      { name: "Soy sauce", quantity: 30, unit: "ml" },
      { name: "Fish sauce", quantity: 15, unit: "ml" },
      { name: "Garlic", quantity: 15, unit: "g" },
      { name: "Black pepper", quantity: 5, unit: "g" },
      { name: "Palm sugar", quantity: 10, unit: "g" },
      { name: "Cooking oil", quantity: 30, unit: "ml" },
      { name: "Lime", quantity: 2, unit: "piece" },
      { name: "Cucumber", quantity: 200, unit: "g" },
      { name: "Coriander", quantity: 20, unit: "g" },
      { name: "Spring onion", quantity: 30, unit: "g" },
      { name: "Rice", quantity: 300, unit: "g" },
    ],
    steps: [
      "Slice the beef into thin bite-sized pieces.",
      "Marinate the beef with soy sauce, fish sauce, garlic, palm sugar, and black pepper.",
      "Heat cooking oil in a pan over high heat.",
      "Stir-fry the beef quickly until browned and cooked.",
      "Mix lime juice with black pepper to make the dipping sauce.",
      "Serve with cooked rice, cucumber, coriander, and spring onion.",
    ],
  },
  {
    title: "Khmer Sour Fish Soup",
    description:
      "Light and refreshing Khmer fish soup flavored with tamarind, lemongrass, and aromatic herbs.",
    difficulty: "medium",
    prep_time: 20,
    cook_time: 30,
    servings: 5,
    image_url: null,
    ingredients: [
      { name: "Fish", quantity: 500, unit: "g" },
      { name: "Lemongrass", quantity: 30, unit: "g" },
      { name: "Galangal", quantity: 10, unit: "g" },
      { name: "Kaffir lime leaf", quantity: 5, unit: "leaf" },
      { name: "Tamarind", quantity: 30, unit: "g" },
      { name: "Fish sauce", quantity: 30, unit: "ml" },
      { name: "Palm sugar", quantity: 10, unit: "g" },
      { name: "Garlic", quantity: 10, unit: "g" },
      { name: "Shallot", quantity: 30, unit: "g" },
      { name: "Red chili", quantity: 2, unit: "piece" },
      { name: "Morning glory", quantity: 200, unit: "g" },
      { name: "Coriander", quantity: 20, unit: "g" },
    ],
    steps: [
      "Cut the fish into serving-sized pieces.",
      "Bring water to a boil with lemongrass, galangal, shallot, garlic, and kaffir lime leaves.",
      "Add tamarind, fish sauce, and palm sugar.",
      "Add the fish and simmer gently until cooked.",
      "Add morning glory and cook for another two minutes.",
      "Finish with red chili and coriander before serving.",
    ],
  },
  {
    title: "Kroeung Chicken",
    description:
      "Khmer chicken stir-fry cooked with homemade yellow kroeung, coconut milk, and long beans.",
    difficulty: "medium",
    prep_time: 25,
    cook_time: 30,
    servings: 4,
    image_url: null,
    ingredients: [
      { name: "Chicken", quantity: 700, unit: "g" },
      { name: "Lemongrass", quantity: 40, unit: "g" },
      { name: "Galangal", quantity: 15, unit: "g" },
      { name: "Turmeric", quantity: 10, unit: "g" },
      { name: "Garlic", quantity: 15, unit: "g" },
      { name: "Shallot", quantity: 40, unit: "g" },
      { name: "Kaffir lime leaf", quantity: 5, unit: "leaf" },
      { name: "Fish sauce", quantity: 30, unit: "ml" },
      { name: "Palm sugar", quantity: 15, unit: "g" },
      { name: "Coconut milk", quantity: 200, unit: "ml" },
      { name: "Red chili", quantity: 2, unit: "piece" },
      { name: "Cooking oil", quantity: 30, unit: "ml" },
      { name: "Long bean", quantity: 200, unit: "g" },
    ],
    steps: [
      "Pound lemongrass, galangal, turmeric, garlic, shallot, and kaffir lime leaves into a paste.",
      "Cut the chicken and long beans into bite-sized pieces.",
      "Heat oil and fry the kroeung paste until fragrant.",
      "Add chicken and stir-fry until the outside is lightly browned.",
      "Add coconut milk, fish sauce, and palm sugar.",
      "Add long beans and chili, then cook until the chicken is fully done.",
    ],
  },
  {
    title: "Pork Morning Glory",
    description:
      "Quick Khmer-style pork and morning glory stir-fry with garlic, chili, and savory sauce.",
    difficulty: "easy",
    prep_time: 15,
    cook_time: 15,
    servings: 4,
    image_url: null,
    ingredients: [
      { name: "Pork", quantity: 400, unit: "g" },
      { name: "Morning glory", quantity: 500, unit: "g" },
      { name: "Garlic", quantity: 20, unit: "g" },
      { name: "Fish sauce", quantity: 20, unit: "ml" },
      { name: "Soy sauce", quantity: 20, unit: "ml" },
      { name: "Palm sugar", quantity: 8, unit: "g" },
      { name: "Red chili", quantity: 2, unit: "piece" },
      { name: "Cooking oil", quantity: 30, unit: "ml" },
      { name: "Black pepper", quantity: 3, unit: "g" },
    ],
    steps: [
      "Slice the pork thinly and cut the morning glory into shorter pieces.",
      "Mix fish sauce, soy sauce, palm sugar, and black pepper.",
      "Heat oil and fry garlic and chili until fragrant.",
      "Add pork and stir-fry until nearly cooked.",
      "Add morning glory and the prepared sauce.",
      "Cook over high heat until the vegetables soften slightly.",
    ],
  },
  {
    title: "Green Papaya Salad",
    description:
      "Fresh Khmer green papaya salad with shrimp, peanuts, lime, chili, and fish sauce.",
    difficulty: "easy",
    prep_time: 25,
    cook_time: 5,
    servings: 4,
    image_url: null,
    ingredients: [
      { name: "Green papaya", quantity: 500, unit: "g" },
      { name: "Long bean", quantity: 100, unit: "g" },
      { name: "Cucumber", quantity: 150, unit: "g" },
      { name: "Shrimp", quantity: 150, unit: "g" },
      { name: "Peanut", quantity: 50, unit: "g" },
      { name: "Garlic", quantity: 10, unit: "g" },
      { name: "Red chili", quantity: 2, unit: "piece" },
      { name: "Fish sauce", quantity: 30, unit: "ml" },
      { name: "Lime", quantity: 3, unit: "piece" },
      { name: "Palm sugar", quantity: 20, unit: "g" },
      { name: "Coriander", quantity: 20, unit: "g" },
    ],
    steps: [
      "Peel and shred the green papaya into thin strips.",
      "Cook the shrimp, allow it to cool, and cut it into smaller pieces.",
      "Pound garlic and chili lightly in a mortar.",
      "Add fish sauce, lime juice, and palm sugar, then mix until dissolved.",
      "Add papaya, long beans, cucumber, shrimp, and peanuts.",
      "Mix well and garnish with coriander.",
    ],
  },
  {
    title: "Banana Blossom Salad",
    description:
      "Khmer banana blossom salad with chicken, coconut milk, fresh herbs, peanuts, and lime.",
    difficulty: "medium",
    prep_time: 30,
    cook_time: 20,
    servings: 4,
    image_url: null,
    ingredients: [
      { name: "Banana blossom", quantity: 400, unit: "g" },
      { name: "Chicken", quantity: 300, unit: "g" },
      { name: "Coconut milk", quantity: 150, unit: "ml" },
      { name: "Fish sauce", quantity: 30, unit: "ml" },
      { name: "Lime", quantity: 3, unit: "piece" },
      { name: "Palm sugar", quantity: 15, unit: "g" },
      { name: "Shallot", quantity: 50, unit: "g" },
      { name: "Garlic", quantity: 10, unit: "g" },
      { name: "Red chili", quantity: 2, unit: "piece" },
      { name: "Mint", quantity: 20, unit: "g" },
      { name: "Coriander", quantity: 20, unit: "g" },
      { name: "Peanut", quantity: 50, unit: "g" },
    ],
    steps: [
      "Thinly slice the banana blossom and soak it in water with lime juice.",
      "Cook the chicken and shred it into small pieces.",
      "Mix coconut milk, fish sauce, lime juice, palm sugar, garlic, and chili.",
      "Drain the banana blossom thoroughly.",
      "Combine banana blossom, chicken, shallot, mint, coriander, and dressing.",
      "Top with crushed peanuts before serving.",
    ],
  },
  {
    title: "Pumpkin Coconut Custard",
    description:
      "Traditional Khmer pumpkin dessert filled with sweet coconut and egg custard.",
    difficulty: "medium",
    prep_time: 20,
    cook_time: 60,
    servings: 6,
    image_url: null,
    ingredients: [
      { name: "Pumpkin", quantity: 800, unit: "g" },
      { name: "Coconut milk", quantity: 400, unit: "ml" },
      { name: "Egg", quantity: 5, unit: "piece" },
      { name: "Palm sugar", quantity: 120, unit: "g" },
      { name: "Salt", quantity: 2, unit: "g" },
    ],
    steps: [
      "Cut an opening at the top of the pumpkin and remove the seeds.",
      "Whisk eggs, coconut milk, palm sugar, and salt together.",
      "Strain the custard mixture to remove any lumps.",
      "Pour the custard into the hollow pumpkin.",
      "Steam the pumpkin until both the pumpkin and custard are firm.",
      "Allow it to cool before cutting into slices.",
    ],
  },
  {
    title: "Khmer Fried Rice",
    description:
      "Simple Khmer fried rice with chicken, egg, vegetables, and savory seasoning.",
    difficulty: "easy",
    prep_time: 20,
    cook_time: 15,
    servings: 4,
    image_url: null,
    ingredients: [
      { name: "Rice", quantity: 600, unit: "g" },
      { name: "Chicken", quantity: 250, unit: "g" },
      { name: "Egg", quantity: 3, unit: "piece" },
      { name: "Carrot", quantity: 100, unit: "g" },
      { name: "Mushroom", quantity: 100, unit: "g" },
      { name: "Bean sprouts", quantity: 150, unit: "g" },
      { name: "Spring onion", quantity: 50, unit: "g" },
      { name: "Garlic", quantity: 15, unit: "g" },
      { name: "Soy sauce", quantity: 30, unit: "ml" },
      { name: "Fish sauce", quantity: 15, unit: "ml" },
      { name: "Cooking oil", quantity: 30, unit: "ml" },
      { name: "Black pepper", quantity: 3, unit: "g" },
    ],
    steps: [
      "Cook the rice in advance and allow it to cool.",
      "Cut the chicken, carrot, mushroom, and spring onion into small pieces.",
      "Heat oil and fry garlic until fragrant.",
      "Add chicken and cook thoroughly.",
      "Push the chicken aside, add eggs, and scramble them.",
      "Add rice, vegetables, soy sauce, fish sauce, and black pepper.",
      "Stir-fry over high heat and finish with spring onion.",
    ],
  },
  {
    title: "Prahok Ktis",
    description:
      "Rich Khmer prahok dip cooked with pork, coconut milk, kroeung, and fresh vegetables.",
    difficulty: "medium",
    prep_time: 25,
    cook_time: 30,
    servings: 5,
    image_url: null,
    ingredients: [
      { name: "Prahok", quantity: 100, unit: "g" },
      { name: "Pork", quantity: 300, unit: "g" },
      { name: "Coconut milk", quantity: 300, unit: "ml" },
      { name: "Lemongrass", quantity: 30, unit: "g" },
      { name: "Galangal", quantity: 10, unit: "g" },
      { name: "Turmeric", quantity: 5, unit: "g" },
      { name: "Garlic", quantity: 10, unit: "g" },
      { name: "Shallot", quantity: 30, unit: "g" },
      { name: "Kaffir lime leaf", quantity: 3, unit: "leaf" },
      { name: "Palm sugar", quantity: 15, unit: "g" },
      { name: "Red chili", quantity: 2, unit: "piece" },
      { name: "Cucumber", quantity: 200, unit: "g" },
      { name: "Eggplant", quantity: 200, unit: "g" },
    ],
    steps: [
      "Pound lemongrass, galangal, turmeric, garlic, shallot, and kaffir lime leaves into kroeung.",
      "Finely mince the pork.",
      "Heat part of the coconut milk and cook the kroeung until fragrant.",
      "Add pork and stir until it begins to cook.",
      "Add prahok, remaining coconut milk, palm sugar, and chili.",
      "Simmer until the mixture thickens.",
      "Serve with fresh cucumber and eggplant.",
    ],
  },
];

const getIngredientMap = async () => {
  const requiredNames = [
    ...new Set(
      recipes.flatMap((recipe) =>
        recipe.ingredients.map((ingredient) => ingredient.name),
      ),
    ),
  ];

  const ingredients = await prisma.ingredient.findMany({
    where: {
      name: {
        in: requiredNames,
      },
    },
    select: {
      ingredient_id: true,
      name: true,
    },
  });

  const ingredientMap = new Map(
    ingredients.map((ingredient) => [
      ingredient.name,
      ingredient.ingredient_id,
    ]),
  );

  const missingIngredients = requiredNames.filter(
    (name) => !ingredientMap.has(name),
  );

  if (missingIngredients.length > 0) {
    throw new Error(
      `Missing ingredients: ${missingIngredients.join(", ")}. Run the ingredient seed first.`,
    );
  }

  return ingredientMap;
};

const createIngredientRelations = (recipe, ingredientMap) =>
  recipe.ingredients.map((ingredient) => ({
    ingredient_id: ingredientMap.get(ingredient.name),
    quantity: ingredient.quantity,
    unit: ingredient.unit,
  }));

const createStepRelations = (recipe) =>
  recipe.steps.map((instruction, index) => ({
    step_number: index + 1,
    instruction_text: instruction,
  }));

const seedRecipe = async (recipe, ingredientMap) => {
  if (recipe.title.length > 30) {
    throw new Error(
      `Recipe title "${recipe.title}" exceeds the 30-character limit.`,
    );
  }

  const recipeData = {
    title: recipe.title,
    description: recipe.description,
    difficulty: recipe.difficulty,
    cook_time: recipe.cook_time,
    prep_time: recipe.prep_time,
    servings: recipe.servings,
    image_url: recipe.image_url,
    created_by: userId,
    deleted_at: null,
  };

  const recipeIngredients = createIngredientRelations(recipe, ingredientMap);
  const recipeSteps = createStepRelations(recipe);

  const existingRecipe = await prisma.recipe.findFirst({
    where: {
      title: recipe.title,
    },
    select: {
      recipe_id: true,
    },
  });

  if (existingRecipe) {
    return prisma.recipe.update({
      where: {
        recipe_id: existingRecipe.recipe_id,
      },
      data: {
        ...recipeData,
        recipeIngredients: {
          deleteMany: {},
          create: recipeIngredients,
        },
        steps: {
          deleteMany: {},
          create: recipeSteps,
        },
      },
    });
  }

  return prisma.recipe.create({
    data: {
      ...recipeData,
      recipeIngredients: {
        create: recipeIngredients,
      },
      steps: {
        create: recipeSteps,
      },
    },
  });
};

const main = async () => {
  const user = await prisma.user.findUnique({
    where: {
      user_id: userId,
    },
    select: {
      user_id: true,
      user_name: true,
    },
  });

  if (!user) {
    throw new Error(
      `User with user_id ${userId} does not exist. Set SEED_USER_ID to an existing user ID.`,
    );
  }

  const ingredientMap = await getIngredientMap();

  console.log(`Creating recipes as user: ${user.user_name}`);

  for (const recipe of recipes) {
    const savedRecipe = await seedRecipe(recipe, ingredientMap);
    console.log(`✓ ${savedRecipe.title}`);
  }

  console.log(`Successfully seeded ${recipes.length} Khmer recipes.`);
};

main()
  .catch((error) => {
    console.error("Recipe seed failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  