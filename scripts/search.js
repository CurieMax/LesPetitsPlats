import { searchRecipes } from "./algo.js";

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
      ? searchRecipes(keyword, recipes)
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
