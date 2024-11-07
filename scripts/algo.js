
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
        const nameMatch = recipe.name.toLowerCase().includes(lowerCaseKeyword);
        
        const ingredientMatch = recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(lowerCaseKeyword)
        );

        const descriptionMatch = recipe.description.toLowerCase().includes(lowerCaseKeyword);

        if (nameMatch) {
            console.log(`Correspondance trouvée dans le nom pour le mot-clé: ${keyword}`);
        }
        if (ingredientMatch) {
            console.log(`Correspondance trouvée dans les ingrédients pour le mot-clé: ${keyword}`);
        }
        if (descriptionMatch) {
            console.log(`Correspondance trouvée dans la description pour le mot-clé: ${keyword}`);
        }

        return nameMatch || ingredientMatch || descriptionMatch;
    });
}
