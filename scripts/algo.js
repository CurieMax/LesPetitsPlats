/**
 * Recherche des recettes qui contiennent le mot-clé dans le nom, les ingrédients ou la description.
 * La fonction renvoie un tableau de recettes qui contiennent le mot-clé.
 * @param {string} keyword - Mot-clé à rechercher
 * @param {object[]} recipes - Tableau de recettes
 * @returns {object[]} Tableau de recettes qui contiennent le mot-clé
 */
export function searchRecipes(keyword, recipes) {
  const lowerCaseKeyword = keyword.toLowerCase();

  return recipes.filter(recipe => {
      // Vérification de la correspondance dans le nom
      if (recipe.name.toLowerCase().includes(lowerCaseKeyword)) {
          console.log(`Correspondance trouvée dans le nom pour le mot-clé: ${keyword}`);
          return true;
      }

      // Vérification de la correspondance dans les ingrédients
      if (recipe.ingredients.some(ingredient =>
          ingredient.ingredient.toLowerCase().includes(lowerCaseKeyword)
      )) {
          console.log(`Correspondance trouvée dans les ingrédients pour le mot-clé: ${keyword}`);
          return true;
      }

      // Vérification de la correspondance dans la description
      if (recipe.description.toLowerCase().includes(lowerCaseKeyword)) {
          console.log(`Correspondance trouvée dans la description pour le mot-clé: ${keyword}`);
          return true;
      }

      // Retourne faux si aucune correspondance n'est trouvée
      return false;
  });
}