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
