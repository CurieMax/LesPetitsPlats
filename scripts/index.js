import { recipeTemplate } from "../templates/recipeTemplates.js";
import { getRecipes } from "../scripts/api.js";
import {
  displayItems,
  getUniqueItems,
  filterRecipesByItems,
  toggleDropdown,
  updateDropdownLists,
} from "./filter.js";
import { combinedSearch } from "./search.js";
import { addTag, removeTag } from "./tag.js";

/**
 * Met à jour le texte dans filter-text en fonction du nombre de recettes
 * @param {number} count - Nombre de recettes affichées
 */
function updateFilterText(count, keyword = "") {
  const filterTextElement = document.querySelector(".filter-text");
  const errorMessageElement = document.querySelector(".error-message");

  if (count === 0 && keyword.trim().length > 0) {
    filterTextElement.textContent = "Aucune recette trouvée";
    errorMessageElement.style.display = "flex";
    errorMessageElement.textContent = `Aucune recette ne contient « ${keyword} ». Vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
  } else {
    filterTextElement.textContent = `${count} recettes disponibles`;
    errorMessageElement.style.display = "none";
  }
}

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

  // Mettre à jour filter-text avec le nombre de recettes affichées
  updateFilterText(recipes.length);
}

/**
 * Initialise l'écouteur d'événements de la barre de recherche pour les recettes
 * @param {Object[]} recipes - Tableau d'objets recettes
 */
function initSearch(recipes) {
  const searchInput = document.querySelector(".search-bar input");

  searchInput.addEventListener("input", (event) => {
    const keyword = event.target.value;

    // Récupérer les tags sélectionnés
    const selectedTags = [
      ...document.getElementById("tags").querySelectorAll(".tag"),
    ].map((tag) => ({
      item: tag.dataset.item,
      category: tag.dataset.category,
    }));

    // Recherche combinée élargie
    const filteredRecipes = combinedSearch(keyword, selectedTags, recipes);

    // Mettre à jour l'affichage des recettes
    displayRecipes(filteredRecipes);

    // Mettre à jour le texte avec le mot-clé saisi
    updateFilterText(filteredRecipes.length, keyword);

    // Mettre à jour les listes déroulantes avec les options restantes
    updateDropdownLists(filteredRecipes);
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
  const ustensils = getUniqueItems(recipes, "ustensils");

  // Afficher et gérer les interactions pour chaque filtre
  const setupFilter = (items, listId, category) => {
    displayItems(items, listId, (item) => {
      addTag(item, category, (removedItem) => {
        removeTag(removedItem, category, (remainingTags) => {
          filterRecipesByItems(remainingTags);
        });
      });

      const selectedTags = [
        ...document.getElementById("tags").querySelectorAll(".tag"),
      ].map((tag) => ({
        item: tag.dataset.item,
        category: tag.dataset.category,
      }));

      filterRecipesByItems(selectedTags);
    });
  };

  setupFilter(ingredients, "ingredientList", "ingredients");
  setupFilter(appliances, "applianceList", "appliances");
  setupFilter(ustensils, "ustensilList", "ustensils");
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

  // Gérer l'ouverture/fermeture des listes déroulantes
  toggleDropdown(
    document.querySelector(".ingredient-filter"),
    document.getElementById("ingredientDropdown")
  );

  toggleDropdown(
    document.querySelector(".appliance-filter"),
    document.getElementById("applianceDropdown")
  );

  toggleDropdown(
    document.querySelector(".ustensil-filter"),
    document.getElementById("ustensilDropdown")
  );
}

init();
