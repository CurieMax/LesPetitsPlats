export function combinedSearch(
  keyword,
  selectedTags,
  recipes,
  displayCallback,
  updateDropdownCallback
) {
  // Recherche par mot-clé dans les noms, descriptions, ingrédients, appareils, ustensiles
  const keywordFilteredRecipes =
    keyword.length >= 3
      ? recipes.filter(
          (recipe) =>
            recipe.name.toLowerCase().includes(keyword.toLowerCase()) ||
            recipe.description.toLowerCase().includes(keyword.toLowerCase()) ||
            recipe.ingredients.some((ing) =>
              ing.ingredient.toLowerCase().includes(keyword.toLowerCase())
            ) ||
            recipe.appliance.toLowerCase().includes(keyword.toLowerCase()) ||
            recipe.ustensils.some((ustensil) =>
              ustensil.toLowerCase().includes(keyword.toLowerCase())
            )
        )
      : recipes;

  // Filtrage par tags
  const tagsByCategory = selectedTags.reduce(
    (acc, { item, category }) => {
      if (!acc[category]) {
        acc[category] = []; // Initialiser le tableau pour la catégorie si nécessaire
      }
      acc[category].push(item);
      return acc;
    },
    { ingredients: [], appliances: [], ustensils: [] } // Initialisation des catégories
  );

  const combinedFilteredRecipes = keywordFilteredRecipes.filter((recipe) => {
    const matchesIngredients = tagsByCategory.ingredients.every((tag) =>
      recipe.ingredients.some((ing) => ing.ingredient === tag)
    );

    const matchesAppliances = tagsByCategory.appliances.every(
      (tag) => recipe.appliance === tag
    );

    const matchesUstensils = tagsByCategory.ustensils.every((tag) =>
      recipe.ustensils.includes(tag)
    );

    return matchesIngredients && matchesAppliances && matchesUstensils;
  });

  // Appeler les fonctions de mise à jour
  if (displayCallback) displayCallback(combinedFilteredRecipes);
  if (updateDropdownCallback) updateDropdownCallback(combinedFilteredRecipes);

  return combinedFilteredRecipes;
}
