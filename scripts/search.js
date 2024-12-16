/**
 * Effectue une recherche combinée dans les recettes avec un mot-clé et des tags.
 * La recherche par mot-clé est faite dans les noms, descriptions, ingrédients, appareils, ustensiles
 * et elle est combinée avec un filtrage par les tags sélectionnés.
 * La fonction prend en paramètres le mot-clé, les tags sélectionnés, les recettes à filtrer, une fonction
 * de mise à jour pour afficher les résultats et une fonction de mise à jour pour les listes déroulantes.
 * @param {string} keyword - Mot-clé de recherche
 * @param {Object[]} selectedTags - Tableau d'objets tags sélectionnés
 * @param {Object[]} recipes - Tableau d'objets recettes à filtrer
 * @param {function} displayCallback - Fonction de mise à jour pour afficher les résultats
 * @param {function} updateDropdownCallback - Fonction de mise à jour pour les listes déroulantes
 * @returns {Object[]} Tableau des recettes filtrées par la recherche combinée
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
