import { displayRecipes } from "./index.js";

/**
 * Récupère une liste unique d'ingrédients à partir des recettes
 * @param {Object[]} recipes - Tableau d'objets recettes
 * @returns {Set} Ensemble des ingrédients uniques
 */
export function getUniqueIngredients(recipes) {
    const ingredientsSet = new Set();
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredientObj) => {
        ingredientsSet.add(ingredientObj.ingredient);
      });
    });
    return Array.from(ingredientsSet).sort();
  }
  
  /**
   * Affiche les ingrédients dans la liste déroulante
   * @param {string[]} ingredients - Liste d'ingrédients uniques
   */
  export function displayIngredients(ingredients) {
    const ingredientList = document.getElementById("ingredientList");
  
    // Vider la liste avant d'ajouter les nouveaux ingrédients
    ingredientList.innerHTML = "";
  
    // Ajouter chaque ingrédient en tant qu'élément de liste
    ingredients.forEach((ingredient) => {
      const li = document.createElement("li");
      li.textContent = ingredient;
      li.addEventListener("click", () => {
        filterRecipesByIngredient(ingredient);
      });
      ingredientList.appendChild(li);
    });
  }
  
  /**
   * Filtre les recettes en fonction de l'ingrédient sélectionné
   * @param {string} ingredient - Ingrédient sélectionné
   */
  export function filterRecipesByIngredient(ingredient) {
    const recipes = JSON.parse(localStorage.getItem("recipesData")) || [];
    const filteredRecipes = recipes.filter((recipe) =>
      recipe.ingredients.some((ing) => ing.ingredient === ingredient)
    );
    displayRecipes(filteredRecipes);
  }
  
  /**
   * Gère l'affichage de la liste déroulante
   */
  export function toggleDropdown() {
    const dropdown = document.getElementById("filterDropdown");
    
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  }
  
  document
    .querySelector(".filter-container")
    .addEventListener("click", toggleDropdown);
  
  /**
   * Gère la recherche d'ingrédients dans la liste déroulante
   */
 export function filterItems() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const items = document.querySelectorAll(".ingredient-list li");
  
    items.forEach((item) => {
      if (item.textContent.toLowerCase().includes(input)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
  
  document.getElementById('searchInput').addEventListener('input', filterItems);
  