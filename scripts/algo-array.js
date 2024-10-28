/**
 * Recherche des recettes par nom ou ingrédient dans un tableau donné.
 * @param {string} keyword - Le mot-clé de recherche.
 * @param {Recipe[]} recipes - Le tableau des recettes à filtrer.
 * @returns {Recipe[]} - La liste des recettes correspondantes.
 */
export function searchRecipes(keyword, recipes) {
    return recipes.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(keyword.toLowerCase());

        const ingredientMatch = recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(keyword.toLowerCase())
        );

        const descriptionMatch = recipe.description.toLowerCase().includes(keyword.toLowerCase());

        return nameMatch || ingredientMatch || descriptionMatch;
    });
}
