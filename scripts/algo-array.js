import { getRecipes } from "./api.js";



/**
 * Recherche des recettes par nom ou ingrédient.
 * @param {string} keyword - Le mot-clé de recherche.
 * @returns {Promise<Recipe[]>} - La liste des recettes correspondantes.
 */
export async function searchRecipes(keyword) {
    const recipes = await getRecipes();

    // Utilisation de Array.filter pour filtrer les recettes par nom ou ingrédients
    return recipes.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(keyword.toLowerCase());

        const ingredientMatch = recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(keyword.toLowerCase())
        );

        return nameMatch || ingredientMatch; // Retourne la recette si le nom ou un ingrédient correspond
    });
}
