import { recipeTemplate } from "../templates/recipeTemplates.js";
import { getRecipes } from "../scripts/api.js";
import {
  toggleDropdown,
  updateDropdownLists,
  initializeLists,
} from "./filter.js";
import { combinedSearch } from "./search.js";
import { initializeTagModule } from "./tag.js";

// Cache des éléments DOM fréquemment utilisés
const DOM = {
  recipeSection: document.querySelector(".recipe-section"),
  filterText: document.querySelector(".filter-text"),
  errorMessage: document.querySelector(".error-message"),
  searchInput: document.querySelector(".search-bar input"),
  tagsContainer: document.getElementById("tags"),
  dropdowns: {
    ingredient: document.getElementById("ingredientDropdown"),
    appliance: document.getElementById("applianceDropdown"),
    ustensil: document.getElementById("ustensilDropdown"),
  },
  filters: {
    ingredient: document.querySelector(".ingredient-filter"),
    appliance: document.querySelector(".appliance-filter"),
    ustensil: document.querySelector(".ustensil-filter"),
  },
};

// Cache pour les templates de recettes
const recipeTemplateCache = new Map();
let currentRecipes = [];

/**
 * Met à jour le texte dans filter-text en fonction du nombre de recettes
 * @param {number} count - Nombre de recettes affichées
 */
function updateFilterText(count, keyword = "") {
  if (count === 0 && keyword.trim().length > 0) {
    DOM.filterText.textContent = "Aucune recette trouvée";
    DOM.errorMessage.style.display = "flex";
    DOM.errorMessage.textContent = `Aucune recette ne contient « ${keyword} ». Vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
  } else {
    DOM.filterText.textContent = `${count} recettes disponibles`;
    DOM.errorMessage.style.display = "none";
  }
}

/**
 * Crée une carte de recette avec mise en cache
 * @param {Object} recipe - Objet recette
 * @returns {HTMLElement} - Élément HTML de la carte de recette
 */
function createRecipeCard(recipe) {
  const cacheKey = recipe.id;
  if (recipeTemplateCache.has(cacheKey)) {
    return recipeTemplateCache.get(cacheKey).cloneNode(true);
  }

  const card = recipeTemplate(recipe);
  recipeTemplateCache.set(cacheKey, card.cloneNode(true));
  return card;
}

/**
 * Affiche les recettes avec optimisation des performances
 * @param {Object[]} recipes - Tableau d'objets recettes
 */
export function displayRecipes(recipes) {
  const fragment = document.createDocumentFragment();
  recipes.forEach((recipe) => {
    const card = createRecipeCard(recipe);
    fragment.appendChild(card);
  });

  DOM.recipeSection.innerHTML = "";
  DOM.recipeSection.appendChild(fragment);
  updateFilterText(recipes.length, DOM.searchInput.value);
}

/**
 * Initialise la recherche avec debounce
 * @param {Object[]} recipes - Tableau d'objets recettes
 */
function initSearch(recipes) {
  let searchTimeout;

  DOM.searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    const searchQuery = e.target.value;

    searchTimeout = setTimeout(() => {
      const selectedTags = Array.from(DOM.tagsContainer.children).map(
        (tag) => ({
          item: tag.dataset.item,
          category: tag.dataset.category,
        })
      );

      const filteredRecipes = combinedSearch(
        searchQuery,
        selectedTags,
        recipes
      );
      displayRecipes(filteredRecipes);
      updateDropdownLists(filteredRecipes);
    }, 300);
  });
}

/**
 * Initialise les filtres avec optimisation des performances
 * @param {Object[]} recipes - Tableau d'objets recettes
 */
function initFilters() {
  // Initialiser les événements de clic pour les dropdowns
  Object.entries(DOM.filters).forEach(([key, filter]) => {
    const dropdown = DOM.dropdowns[key];
    if (filter && dropdown) {
      toggleDropdown(filter, dropdown);
    }
  });
}

/**
 * Initialise l'application avec chargement optimisé
 */
async function init() {
  currentRecipes = await getRecipes();

  // Initialiser les modules avec les recettes
  initializeLists(currentRecipes);
  initializeTagModule(currentRecipes);

  // Afficher les recettes initiales
  displayRecipes(currentRecipes);

  // Initialiser la recherche et les filtres
  initSearch(currentRecipes);
  initFilters(currentRecipes);
}

init();
