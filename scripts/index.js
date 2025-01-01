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
 * @param {Object} recipe - Données de la recette
 * @returns {HTMLElement} Élément DOM de la carte
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
export async function displayRecipes(recipes) {
  const fragment = document.createDocumentFragment();
  recipes.forEach(recipe => {
    fragment.appendChild(createRecipeCard(recipe));
  });

  // Une seule manipulation du DOM
  DOM.recipeSection.innerHTML = "";
  DOM.recipeSection.appendChild(fragment);
  updateFilterText(recipes.length);
}

/**
 * Initialise la recherche avec debounce
 * @param {Object[]} recipes - Tableau d'objets recettes
 */
function initSearch(recipes) {
  let searchTimeout;
  let lastKeyword = "";

  DOM.searchInput.addEventListener("input", (event) => {
    const keyword = event.target.value;
    if (keyword === lastKeyword) return;
    lastKeyword = keyword;

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const selectedTags = [...DOM.tagsContainer.querySelectorAll(".tag")]
        .map(tag => ({
          item: tag.dataset.item,
          category: tag.dataset.category,
        }));

      combinedSearch(
        keyword,
        selectedTags,
        recipes,
        (filteredRecipes) => {
          displayRecipes(filteredRecipes);
          updateFilterText(filteredRecipes.length, keyword);
        },
        updateDropdownLists
      );
    }, 150); // Debounce de 150ms
  });
}

/**
 * Initialise les filtres avec optimisation des performances
 * @param {Object[]} recipes - Tableau d'objets recettes
 */
function initFilters(recipes) {
  const filters = [
    { items: getUniqueItems(recipes, "ingredients"), listId: "ingredientList", category: "ingredients" },
    { items: getUniqueItems(recipes, "appliance"), listId: "applianceList", category: "appliances" },
    { items: getUniqueItems(recipes, "ustensils"), listId: "ustensilList", category: "ustensils" }
  ];

  filters.forEach(({ items, listId, category }) => {
    displayItems(items, listId, (item) => {
      addTag(item, category, (removedItem) => {
        if (removedItem) {
          removeTag(removedItem, category, (remainingTags) => {
            if (remainingTags) {
              const { filteredRecipes } = filterRecipesByItems(remainingTags);
              displayRecipes(filteredRecipes);
              updateDropdownLists(filteredRecipes);
            }
          });
        }
      });

      const selectedTags = [...DOM.tagsContainer.children].map(tag => ({
        item: tag.dataset.item,
        category: tag.dataset.category,
      }));

      const { filteredRecipes } = filterRecipesByItems(selectedTags);
      displayRecipes(filteredRecipes);
      updateDropdownLists(filteredRecipes);
    });
  });
}

/**
 * Initialise l'application avec chargement optimisé
 */
async function init() {
  const recipes = await getRecipes();
  sessionStorage.setItem("recipesData", JSON.stringify(recipes));

  // Initialisation parallèle
  await Promise.all([
    displayRecipes(recipes),
    initSearch(recipes),
    initFilters(recipes)
  ]);

  // Initialiser les dropdowns
  Object.entries(DOM.dropdowns).forEach(([key, dropdown]) => {
    toggleDropdown(DOM.filters[key], dropdown);
  });
}

init();
