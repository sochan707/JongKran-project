import RecipeCart from "../RecipeCart";

export default function RecipeGrid({
  recipes,
  className,
  children,
  ...recipeCardProps
}) {
  return (
    <div className={className}>
      {children}
      {recipes.map((recipe) => (
        <RecipeCart key={recipe.id} recipe={recipe} {...recipeCardProps} />
      ))}
    </div>
  );
}
