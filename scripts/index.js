import { recipeTemplate } from "../templates/recipeTemplates.js";
import { searchRecipes } from "./algo.js";
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
 * Initialise l'écouteur d'événements de la barre de recherche.
 * Lorsque le champ de recherche est modifié, filtre les recettes
 * correspondantes en fonction de la valeur du champ de recherche.
 * Si la longueur de la valeur du champ de recherche est supérieure
 * ou égale à 3, affiche les recettes filtrées. Sinon, affiche
 * toutes les recettes.
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
 *
 * Récupère toutes les recettes et les affiche,
 * puis initialise l'écouteur d'événements de la barre de recherche.
 */
async function init() {
  const recipes = await getRecipes(); 
  displayRecipes(recipes); 
  initSearch(recipes); 
  recipeFilters();
}

init(); 
