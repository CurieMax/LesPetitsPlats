import { getRecipes } from "./api.js";
import { displayRecipes } from "./index.js";




/**
 * Create options for the filters based on the recipes
 * and add an eventListener to the filters to display the filtered recipes
 * @returns {Promise<void>}
 */
export async function recipeFilters() {
    const filterSearch = document.querySelectorAll('.filter-select')

    const recipes = await getRecipes();

    const ingredientSet = new Set();
    const applianceSet = new Set();
    const utensilSet = new Set();

    recipes.forEach(recipe => {
       
        recipe.ingredients.forEach(item => {
            ingredientSet.add(item.ingredient);
        }); 
        
        applianceSet.add(recipe.appliance);
        
        recipe.ustensils.forEach(ustensil => {
            utensilSet.add(ustensil);
        });
    });

    const ingredientSelect = document.getElementById('ingredients');
    ingredientSet.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient;
        option.textContent = ingredient;
        ingredientSelect.appendChild(option);
    });

    const applianceSelect = document.getElementById('appareils');
    applianceSet.forEach(appliance => {
        const option = document.createElement('option');
        option.value = appliance;
        option.textContent = appliance;
        applianceSelect.appendChild(option);
    });

    const utensilSelect = document.getElementById('ustensiles');
    utensilSet.forEach(utensil => {
        const option = document.createElement('option');
        option.value = utensil;
        option.textContent = utensil;
        utensilSelect.appendChild(option);
    });

    ingredientSelect.addEventListener('change', () => filterRecipes(recipes));
    applianceSelect.addEventListener('change', () => filterRecipes(recipes));
    utensilSelect.addEventListener('change', () => filterRecipes(recipes));


    function filterRecipes(recipes) {
        const selectedIngredient = document.getElementById('ingredients').value;
        const selectedAppliance = document.getElementById('appareils').value;
        const selectedUtensil = document.getElementById('ustensiles').value;
    
        const filteredRecipes = recipes.filter(recipe => {
            const hasIngredient = selectedIngredient === "" || recipe.ingredients.some(item => item.ingredient === selectedIngredient);
            const hasAppliance = selectedAppliance === "" || recipe.appliance === selectedAppliance;
            const hasUtensil = selectedUtensil === "" || recipe.ustensils.includes(selectedUtensil);
    
            return hasIngredient && hasAppliance && hasUtensil;
        });
    
        displayRecipes(filteredRecipes);
    }

   
}

