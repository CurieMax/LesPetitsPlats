import { recipeTemplate } from "../templates/recipeTemplates.js";
import { searchRecipes } from "../scripts/algo-array.js";
import { getRecipes } from "../scripts/api.js";
import { recipeFilters } from "./filter.js";



/**
 * Affiche les recettes correspondantes dans la section
 * .recipe-section
 * 
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
 * Function to initialize the search functionality.
 * It adds an event listener to the search input field to trigger
 * a recipe search based on the entered keyword.
 */
function initSearch() {
  const searchInput = document.querySelector(".search-bar input");

  searchInput.addEventListener("input", async (event) => {
    const keyword = event.target.value;

    if (keyword.length >= 3) {
      const filteredRecipes = await searchRecipes(keyword); // Rechercher avec le mot-clé
      displayRecipes(filteredRecipes); // Afficher les recettes filtrées
    } else {
      // Si le mot-clé a moins de 3 caractères, afficher toutes les recettes
      const allRecipes = await getRecipes();
      displayRecipes(allRecipes); // Afficher toutes les recettes
    }
  });
}



/**
 * Démarrage de l'application.
 *
 * Récupère toutes les recettes et les affiche,
 * puis initialise l'écouteur d'événements de la barre de recherche.
 */
async function init() {
  const recipes = await getRecipes(); // Récupérer toutes les recettes au démarrage
  displayRecipes(recipes); // Afficher toutes les recettes au démarrage
  initSearch(); // Initialiser l'écouteur d'événements de la barre de recherche
  recipeFilters();
}

init(); // Démarrage de l'application
