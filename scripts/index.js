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
import { createFiltersSection } from "./homepage.js";


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("filtersContainer");

  if (container) {
    // Vérifie si une section "filters" existe déjà
    if (!container.querySelector(".filters")) {
      const filtersSection = createFiltersSection();
      container.appendChild(filtersSection);
    } else {
      console.warn("Une section 'filters' existe déjà dans le DOM.");
    }
  } else {
    console.error("Le conteneur #filtersContainer est introuvable.");
  }
});

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
 * Initialise les filtres pour les ingrédients, appareils et ustensiles
 * @param {Object[]} recipes - Tableau d'objets recettes
 */
function initFilters(recipes) {
  // Récupérer les listes uniques d'ingrédients, d'appareils et d'ustensiles
  const ingredients = getUniqueItems(recipes, "ingredients");
  const appliances = getUniqueItems(recipes, "appliance");
  const ustensils = getUniqueItems(recipes, "ustensils"); // Utilise "ustensils" ici

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

  // Gérer les ustensiles (en vérifiant s'il existe)
  if (ustensils.length > 0) {
    displayItems(ustensils, "ustensilList", (ustensil) => { // Utilise "ustensilList" ici
      addTag(ustensil, "ustensilTags", (removedUstensil) => {
        removeTag(removedUstensil, "ustensilTags", (remainingUstensils) => {
          filterRecipesByItems(remainingUstensils, "ustensils");
        });
      });
      filterRecipesByItems([ustensil], "ustensils");
    });
  }
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

  // Initialiser les filtres (ingrédients, appareils et ustensiles)
  initFilters(recipes);

  // Cibler les éléments du DOM pour les filtres d'ingrédients, d'appareils et d'ustensiles
  const ingredientTrigger = document.querySelector(".ingredient-filter");
  const ingredientDropdown = document.getElementById("ingredientDropdown");

  const applianceTrigger = document.querySelector(".appliance-filter");
  const applianceDropdown = document.getElementById("applianceDropdown");

  const ustensilTrigger = document.querySelector(".ustensil-filter");
  const ustensilDropdown = document.getElementById("ustensilDropdown");

  // Assurer que toggleDropdown fonctionne pour les trois filtres
  if (ingredientTrigger && ingredientDropdown) {
    toggleDropdown(ingredientTrigger, ingredientDropdown);
  }

  if (applianceTrigger && applianceDropdown) {
    toggleDropdown(applianceTrigger, applianceDropdown);
  }

  if (ustensilTrigger && ustensilDropdown) {
    toggleDropdown(ustensilTrigger, ustensilDropdown);
  }
}

init();
