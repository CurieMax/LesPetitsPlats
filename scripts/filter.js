import { getRecipes } from "./api.js";
import { displayRecipes } from "./index.js";

/**
 * Create options for the filters based on the recipes
 * and add an eventListener to the filters to display the filtered recipes
 * @returns {Promise<void>}
 */
export async function recipeFilters() {
  const recipes = await getRecipes();

  const ingredientSet = new Set();
  const applianceSet = new Set();
  const utensilSet = new Set();

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((item) => {
      ingredientSet.add(item.ingredient);
    });

    applianceSet.add(recipe.appliance);

    recipe.ustensils.forEach((ustensil) => {
      utensilSet.add(ustensil);
    });
  });

  const ingredientSelect = document.getElementById("ingredients");
  ingredientSet.forEach((ingredient) => {
    const option = document.createElement("option");
    option.value = ingredient;
    option.textContent = ingredient;
    ingredientSelect.appendChild(option);
  });

  const applianceSelect = document.getElementById("appareils");
  applianceSet.forEach((appliance) => {
    const option = document.createElement("option");
    option.value = appliance;
    option.textContent = appliance;
    applianceSelect.appendChild(option);
  });

  const utensilSelect = document.getElementById("ustensiles");
  utensilSet.forEach((utensil) => {
    const option = document.createElement("option");
    option.value = utensil;
    option.textContent = utensil;
    utensilSelect.appendChild(option);
  });

  ingredientSelect.addEventListener("change", () => filterRecipes(recipes));
  applianceSelect.addEventListener("change", () => filterRecipes(recipes));
  utensilSelect.addEventListener("change", () => filterRecipes(recipes));

  /**
   * Filters the list of recipes based on the selected ingredient, appliance, and utensil.
   * Retrieves the selected values from the DOM elements and returns only those recipes
   * that match all the selected criteria. Calls the displayRecipes function to update
   * the display with the filtered recipes.
   *
   * @param {Array} recipes - An array of recipe objects to be filtered.
   */
  function filterRecipes(recipes) {
    const selectedIngredients = Array.from(
      document.querySelectorAll("#ingredients option:checked")
    ).map((option) => option.value);
    const selectedAppliance = document.getElementById("appareils").value;
    const selectedUtensil = document.getElementById("ustensiles").value;

    const filteredRecipes = recipes.filter((recipe) => {
      // Vérifie si la recette contient tous les ingrédients sélectionnés
      const hasAllIngredients =
        selectedIngredients.length === 0 ||
        selectedIngredients.every((ingredient) =>
          recipe.ingredients.some((item) => item.ingredient === ingredient)
        );
      const hasAppliance =
        selectedAppliance === "" || recipe.appliance === selectedAppliance;
      const hasUtensil =
        selectedUtensil === "" || recipe.ustensils.includes(selectedUtensil);

      return hasAllIngredients && hasAppliance && hasUtensil;
    });

    displayRecipes(filteredRecipes);
  }

  const ingredientsSelect = document.getElementById("ingredients");
  const tagContainer = document.getElementById("ingredient-tags");

  ingredientsSelect.addEventListener("change", () => {
    updateIngredientTags();
    filterRecipes(recipes);
  });

  function updateIngredientTags() {
    tagContainer.innerHTML = "";
    const ingredientTags=document.getElementById("ingredient-tags");

    Array.from(ingredientSelect.selectedOptions).forEach((option) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = option.value;

      const removeBtn = document.createElement("i");
      removeBtn.className = "fa-solid fa-circle-xmark";

      ingredientTags.style.display = "block";
      

      removeBtn.addEventListener("click", () => {
        option.selected = false;
        ingredientTags.style.display = "none";
        updateIngredientTags();
        if (typeof filterRecipes === "function") {
          filterRecipes(recipes);
        }
      });

      tag.appendChild(removeBtn);
      tagContainer.appendChild(tag);
    });
  }
}
