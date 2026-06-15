export const getRecipes = (req, res) => {
  res.json([
    {
      id: 1,
      name: "Fried Rice",
      ingredients: ["rice", "egg", "garlic"],
    },
  ]);
};