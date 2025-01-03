import { searchRecipes } from "./algo.js";

// Cache pour les résultats de recherche
const searchCache = new Map();

/**
 * Effectue une recherche combinée sur les recettes avec mise en cache
 * @param {string} keyword - Mot-clé à rechercher
 * @param {Object[]} selectedTags - Tags sélectionnés
 * @param {Object[]} recipes - Recettes
 * @param {function} displayCallback - Callback d'affichage
 * @param {function} updateDropdownCallback - Callback de mise à jour des dropdowns
 * @returns {Object[]} Recettes filtrées
 */
export function combinedSearch(
  keyword,
  selectedTags,
  recipes,
  displayCallback,
  updateDropdownCallback
) {
  const cacheKey = JSON.stringify({ keyword, selectedTags });
  if (searchCache.has(cacheKey)) {
    const cachedResults = searchCache.get(cacheKey);
    if (displayCallback) displayCallback(cachedResults);
    if (updateDropdownCallback) updateDropdownCallback(cachedResults);
    return cachedResults;
  }

  // Recherche par mot-clé optimisée
  const keywordFilteredRecipes =
    keyword.length >= 3 ? searchRecipes(keyword, recipes) : recipes;

  // Optimisation du filtrage par tags avec Map
  const tagMap = new Map();
  selectedTags.forEach(({ item, category }) => {
    if (!tagMap.has(category)) {
      tagMap.set(category, new Set());
    }
    tagMap.get(category).add(item);
  });

  // Filtrage optimisé avec Map
  const combinedFilteredRecipes = keywordFilteredRecipes.filter((recipe) => {
    // Vérification des ingrédients
    const ingredientTags = tagMap.get("ingredients") || new Set();
    if (ingredientTags.size > 0) {
      const recipeIngredients = new Set(
        recipe.ingredients.map((ing) => ing.ingredient)
      );
      if (![...ingredientTags].every((tag) => recipeIngredients.has(tag))) {
        return false;
      }
    }

    // Vérification des appareils
    const applianceTags = tagMap.get("appliances") || new Set();
    if (applianceTags.size > 0 && !applianceTags.has(recipe.appliance)) {
      return false;
    }

    // Vérification des ustensiles
    const ustensilTags = tagMap.get("ustensils") || new Set();
    if (ustensilTags.size > 0) {
      const recipeUstensils = new Set(recipe.ustensils);
      if (![...ustensilTags].every((tag) => recipeUstensils.has(tag))) {
        return false;
      }
    }

    return true;
  });

  // Mise en cache des résultats
  searchCache.set(cacheKey, combinedFilteredRecipes);

  // Appel des callbacks
  if (displayCallback) displayCallback(combinedFilteredRecipes);
  if (updateDropdownCallback) updateDropdownCallback(combinedFilteredRecipes);

  return combinedFilteredRecipes;
}

// Limiter la taille du cache
setInterval(() => {
  if (searchCache.size > 100) {
    const keys = [...searchCache.keys()];
    for (let i = 0; i < keys.length - 50; i++) {
      searchCache.delete(keys[i]);
    }
  }
}, 60000); // Nettoyage toutes les minutes si nécessaire
