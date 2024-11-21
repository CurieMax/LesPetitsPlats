import { recipeTemplate } from "../templates/recipeTemplates.js";
import { searchRecipes } from "./algo.js";
import { getRecipes } from "../scripts/api.js";
import {
  displayItems,
  getUniqueItems,
  addTag,
  removeTag,
  filterRecipesByItems,
  toggleDropdown,
} from "./filter.js";

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
 * Initialise les filtres pour les ingrédients et les appareils
 * @param {Object[]} recipes - Tableau d'objets recettes
 */
function initFilters(recipes) {
  // Récupérer les listes uniques d'ingrédients et d'appareils
  const ingredients = getUniqueItems(recipes, "ingredients");
  const appliances = getUniqueItems(recipes, "appliance");

  // Gérer les ingrédients
  displayItems(ingredients, "ingredientList", (ingredient) => {
    addTag(ingredient, "ingredientTags", (removedIngredient) => {
      removeTag(removedIngredient, "ingredientTags", (remainingIngredients) => {
        filterRecipesByItems(remainingIngredients, "ingredients");
      });
    });
    filterRecipesByItems([ingredient], "ingredients");
  });

  // Gérer les appareils
  displayItems(appliances, "applianceList", (appliance) => {
    addTag(appliance, "applianceTags", (removedAppliance) => {
      removeTag(removedAppliance, "applianceTags", (remainingAppliances) => {
        filterRecipesByItems(remainingAppliances, "appliance");
      });
    });
    filterRecipesByItems([appliance], "appliance");
  });
}

/**
 * Démarrage de l'application.
 */
async function init() {
  const recipes = await getRecipes();

  // Stocker les recettes pour un accès global
  localStorage.setItem("recipesData", JSON.stringify(recipes));

  // Afficher les recettes initiales
  displayRecipes(recipes);

  // Initialiser la barre de recherche
  initSearch(recipes);

  // Initialiser les filtres (ingrédients et appareils)
  initFilters(recipes);

  // Cibler les éléments du DOM pour les filtres d'ingrédients et d'appareils
  const ingredientTrigger = document.querySelector(".ingredient-filter");
  const ingredientDropdown = document.getElementById("ingredientDropdown");

  const applianceTrigger = document.querySelector(".appliance-filter");
  const applianceDropdown = document.getElementById("applianceDropdown");

  // Assurer que toggleDropdown fonctionne pour les deux filtres
  if (ingredientTrigger && ingredientDropdown) {
    toggleDropdown(ingredientTrigger, ingredientDropdown);
  }

  if (applianceTrigger && applianceDropdown) {
    toggleDropdown(applianceTrigger, applianceDropdown);
  }
}

init();
