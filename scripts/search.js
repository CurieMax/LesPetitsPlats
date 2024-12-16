import { searchRecipes } from "./algo.js";

/**
 * Effectue une recherche combinée sur les recettes.
 * La fonction renvoie un tableau de recettes qui contiennent le mot-clé
 * dans le nom, les ingrédients, la description, les appareils ou les ustensiles
 * ET qui contiennent les tags sélectionnés.
 * La fonction prend en argument le mot-clé, les tags sélectionnés, le tableau
 * des recettes, une fonction de callback pour mettre à jour la liste
 * des recettes affichées et une fonction de callback pour mettre à jour
 * les listes déroulantes des filtres.
 * @param {string} keyword - Mot-clé à recherche
 * @param {Object[]} selectedTags - Tableau des tags sélectionnés
 * @param {Object[]} recipes - Tableau des recettes
 * @param {function} displayCallback - Fonction de callback pour mettre à jour
 * la liste des recettes affichées
 * @param {function} updateDropdownCallback - Fonction de callback pour mettre
 * à jour les listes déroulantes des filtres
 * @returns {Object[]} Tableau des recettes qui contiennent le mot-clé et les tags
 */
export function combinedSearch(
  keyword,
  selectedTags,
  recipes,
  displayCallback,
  updateDropdownCallback
) {
  // Recherche par mot-clé dans les noms, descriptions, ingrédients, appareils, ustensiles
  const keywordFilteredRecipes =
    keyword.length >= 3 ? searchRecipes(keyword, recipes) : recipes;

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
