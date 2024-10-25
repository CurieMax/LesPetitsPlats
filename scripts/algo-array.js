import { getRecipes } from "./api.js";

/**
 * Recherche des recettes par nom ou ingrédient.
 * @param {string} keyword - Le mot-clé de recherche.
 * @returns {Promise<Recipe[]>} - La liste des recettes correspondantes.
 */
export async function searchRecipes(keyword) {
    const recipes = await getRecipes();

    return recipes.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(keyword.toLowerCase());

        const ingredientMatch = recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(keyword.toLowerCase())
        );

        return nameMatch || ingredientMatch;
    });
}
