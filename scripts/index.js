import { recipeTemplate } from "../templates/recipeTemplates.js";
import { searchRecipes } from "./algo.js";
import { getRecipes } from "../scripts/api.js";
import { displayIngredients, filterItems, getUniqueIngredients, toggleDropdown } from "./filter.js";


/**
 * Affiche les recettes correspondantes dans la section .recipe-section
 * @param {Object[]} recipes - Tableau d'objets recettes
 */
export async function displayRecipes(recipes) {
  const recipeSection = document.querySelector(".recipe-section");

  // Vider la section avant d'ajouter les nouvelles recettes
  recipeSection.innerHTML = "";

  // Afficher les recettes correspondantes
  recipes.forEach((recipe) => {
    const recipeCard = recipeTemplate(recipe);
    recipeSection.appendChild(recipeCard);
  });
}


/**
 * Initialise l'écouteur d'événements de la barre de recherche pour les recettes
 * @param {Object[]} recipes - Tableau d'objets recettes
 */
function initSearch(recipes) {
  const searchInput = document.querySelector(".search-bar input");

  searchInput.addEventListener("input", (event) => {
    const keyword = event.target.value;

    if (keyword.length >= 3) {
      const filteredRecipes = searchRecipes(keyword, recipes);
      displayRecipes(filteredRecipes);
    } else {
      displayRecipes(recipes);
    }
  });
}

/**
 * Démarrage de l'application.
 */
async function init() {
  const recipes = await getRecipes();
  const ingredients = getUniqueIngredients(recipes);
  // Stocker les recettes pour un accès global lors du filtrage par ingrédient
  localStorage.setItem("recipesData", JSON.stringify(recipes));

  displayRecipes(recipes);
  initSearch(recipes);
  toggleDropdown();
  filterItems();
  displayIngredients(ingredients);
  getUniqueIngredients(recipes);
}

init();
