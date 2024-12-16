/**
 * Recherche des recettes qui contiennent le mot-clé dans le nom, les ingrédients ou la description.
 * La fonction renvoie un tableau de recettes qui contiennent le mot-clé.
 * @param {string} keyword - Mot-clé à rechercher
 * @param {object[]} recipes - Tableau de recettes
 * @returns {object[]} Tableau de recettes qui contiennent le mot-clé
 */
export function searchRecipes(keyword, recipes) {
  const lowerCaseKeyword = keyword.toLowerCase();

  return recipes.filter((recipe) => {
    if (recipe.name.toLowerCase().includes(lowerCaseKeyword)) {
      return true;
    }

    if (
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(lowerCaseKeyword)
      )
    ) {
      return true;
    }

    if (recipe.description.toLowerCase().includes(lowerCaseKeyword)) {
      return true;
    }

    return false;
  });
}



/**
 * Recherche des recettes qui correspondent à tous les tags sélectionnés.
 * La fonction renvoie un tableau de recettes qui contiennent tous les tags.
 * @param {Object} selectedTags - Objet contenant les tags sélectionnés pour chaque catégorie
 * @param {string[]} selectedTags.ingredients - Tableau des ingrédients sélectionnés
 * @param {string[]} selectedTags.appliances - Tableau des appareils sélectionnés
 * @param {string[]} selectedTags.ustensils - Tableau des ustensiles sélectionnés
 * @param {Object[]} recipes - Tableau de recettes
 * @returns {Object[]} Tableau de recettes qui contiennent tous les tags
 */
export function searchRecipesByTags(selectedTags, recipes) {

  const result = recipes.filter((recipe) => {
    const matchesIngredients = selectedTags.ingredients.every((tag) =>
      recipe.ingredients.some((ing) => ing.ingredient === tag)
    );

    const matchesAppliances = selectedTags.appliances.every(
      (tag) => recipe.appliance === tag
    );

    const matchesUstensils = selectedTags.ustensils.every((tag) =>
      recipe.ustensils.includes(tag)
    );

    return matchesIngredients && matchesAppliances && matchesUstensils;
  });

 return result;
}