
/**
 * Recherche des recettes qui contiennent le mot-clé dans le nom, les ingrédients ou la description.
 * La fonction renvoie un tableau de recettes qui contiennent le mot-clé.
 * @param {string} keyword - Mot-clé à rechercher
 * @param {object[]} recipes - Tableau de recettes
 * @returns {object[]} Tableau de recettes qui contiennent le mot-clé
 */
export function searchRecipes(keyword, recipes) {
    // Initialisation du mot-clé en minuscule pour simplifier les comparaisons
    const lowerCaseKeyword = keyword.toLowerCase();

    return recipes.filter(recipe => {
        // Vérification de la correspondance dans le nom
        const nameMatch = recipe.name.toLowerCase().includes(lowerCaseKeyword);
        
        // Vérification de la correspondance dans les ingrédients
        const ingredientMatch = recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(lowerCaseKeyword)
        );

        // Vérification de la correspondance dans la description
        const descriptionMatch = recipe.description.toLowerCase().includes(lowerCaseKeyword);

        // Vérification et retour selon les correspondances trouvées
        if (nameMatch) {
            console.log(`Correspondance trouvée dans le nom pour le mot-clé: ${keyword}`);
        }
        if (ingredientMatch) {
            console.log(`Correspondance trouvée dans les ingrédients pour le mot-clé: ${keyword}`);
        }
        if (descriptionMatch) {
            console.log(`Correspondance trouvée dans la description pour le mot-clé: ${keyword}`);
        }

        // Retourne vrai si une des correspondances est trouvée
        return nameMatch || ingredientMatch || descriptionMatch;
    });
}
