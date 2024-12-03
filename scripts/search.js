export function combinedSearch(keyword, selectedTags, recipes) {
    // Recherche par mot-clé dans les noms, descriptions, ingrédients, appareils, ustensiles
    const keywordFilteredRecipes = keyword.length >= 3
        ? recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(keyword.toLowerCase()) ||
            recipe.description.toLowerCase().includes(keyword.toLowerCase()) ||
            recipe.ingredients.some(ing =>
                ing.ingredient.toLowerCase().includes(keyword.toLowerCase())
            ) ||
            recipe.appliance.toLowerCase().includes(keyword.toLowerCase()) || // Recherche dans les appareils
            recipe.ustensils.some(ustensil =>
                ustensil.toLowerCase().includes(keyword.toLowerCase()) // Recherche dans les ustensiles
            )
        )
        : recipes;

    // Filtrage par tags
    const tagsByCategory = selectedTags.reduce(
        (acc, { item, category }) => {
            acc[category].push(item);
            return acc;
        },
        { ingredients: [], appliances: [], ustensils: [] }
    );

    const combinedFilteredRecipes = keywordFilteredRecipes.filter((recipe) => {
        const matchesIngredients = tagsByCategory.ingredients.every((tag) =>
            recipe.ingredients.some((ing) => ing.ingredient === tag)
        );

        const matchesAppliances = tagsByCategory.appliances.every(
            (tag) => recipe.appliance === tag
        );

        const matchesUstensils = tagsByCategory.ustensils.every((tag) =>
            recipe.ustensils.includes(tag)
        );

        return matchesIngredients && matchesAppliances && matchesUstensils;
    });

    return combinedFilteredRecipes;
}