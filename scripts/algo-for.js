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
        let ingredientMatch = false;

        // Boucle pour vérifier si un ingrédient correspond
        for (let j = 0; j < recipe.ingredients.length; j++) {
            if (recipe.ingredients[j].ingredient.toLowerCase().includes(lowerCaseKeyword)) {
                ingredientMatch = true;
                break;
            }
        }

        const descriptionMatch = recipe.description.toLowerCase().includes(lowerCaseKeyword);

        // Ajouter la recette aux résultats si une correspondance est trouvée
        if (nameMatch || ingredientMatch || descriptionMatch) {
            results.push(recipe);
        }
    }

    return results;
}
