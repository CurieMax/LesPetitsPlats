/**
 * Recherche des recettes par nom ou ingrédient dans un tableau donné.
 * @param {string} keyword - Le mot-clé de recherche.
 * @param {Recipe[]} recipes - Le tableau des recettes à filtrer.
 * @returns {Recipe[]} - La liste des recettes correspondantes.
 */
export function searchRecipes(keyword, recipes) {
  const results = [];
  const lowerCaseKeyword = keyword.toLowerCase();

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const nameMatch = recipe.name.toLowerCase().includes(lowerCaseKeyword);

    if (nameMatch) {
      results.push(recipe);
    } else if (recipe.description.toLowerCase().includes(lowerCaseKeyword)) {
      results.push(recipe);
    } else {

      for (let j = 0; j < recipe.ingredients.length; j++) {
        if (
          recipe.ingredients[j].ingredient
            .toLowerCase()
            .includes(lowerCaseKeyword)
        ) {
          results.push(recipe);
          break;
        }
      }
    }
  }

  return results;
}

/**
 * Recherche des recettes par nom ou ingrédient dans un tableau donné.
 * @param {string} keyword - Le mot-clé de recherche.
 * @param {Recipe[]} recipes - Le tableau des recettes à filtrer.
 * @returns {Recipe[]} - La liste des recettes correspondantes.
 */
export function searchRecipes2(keyword, recipes) {
    const results = [];
    const lowerCaseKeyword = keyword.toLowerCase();
  
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const nameMatch = recipe.name.toLowerCase().includes(lowerCaseKeyword);
  
      if (nameMatch) {
        results.push(recipe);
        continue;
      }
      if (recipe.description.toLowerCase().includes(lowerCaseKeyword)) {
        results.push(recipe);
        continue;
      }
  
      for (let j = 0; j < recipe.ingredients.length; j++) {
        if (
          recipe.ingredients[j].ingredient
            .toLowerCase()
            .includes(lowerCaseKeyword)
        ) {
          results.push(recipe);
          break;
        }
      }
    }
  
    return results;
  }