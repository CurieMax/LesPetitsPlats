import { recipeTemplate } from "../templates/recipeTemplates.js";
import { searchRecipes } from "../scripts/algo-array.js";
import { getRecipes } from "../scripts/api.js";



/**
 * Affiche les recettes correspondantes dans la section
 * .recipe-section
 * 
 * @param {Object[]} recipes - Tableau d'objets recettes
 */
async function displayRecipes(recipes) {
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
  const searchInput = document.querySelector(".search-bar input"); // Sélection de la barre de recherche

  // Ajouter un écouteur d'événements pour la saisie dans la barre de recherche
  searchInput.addEventListener("input", async (event) => {
    const keyword = event.target.value;

    // Si le mot-clé a 3 caractères ou plus, effectuer la recherche
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
}

init(); // Démarrage de l'application
