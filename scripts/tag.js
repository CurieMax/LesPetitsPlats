import { displayRecipes } from "./index.js";
import { updateDropdownLists } from "./filter.js";
import { combinedSearch } from "./search.js";

// Table de correspondance pour uniformiser les noms des tags
const CATEGORY_MAP = {
  ingredient: "ingredients",
  appliance: "appliances",
  ustensil: "ustensils",
};

/**
 * Normalise une catégorie en fonction de CATEGORY_MAP
 * @param {string} category - La catégorie à normaliser
 * @returns {string} - La catégorie normalisée
 */
function normalizeCategory(category) {
  return CATEGORY_MAP[category] || category;
}

/**
 * Met à jour les résultats affichés en fonction des tags sélectionnés
 */
function updateResults() {
  const selectedTags = Array.from(document.getElementById("tags").children).map((tag) => ({
    item: tag.dataset.item,
    category: tag.dataset.category,
  }));

  const recipes = JSON.parse(sessionStorage.getItem("recipesData")) || [];
  const searchQuery = document.querySelector(".search-bar input").value;
  const filteredRecipes = combinedSearch(searchQuery, selectedTags, recipes);

  displayRecipes(filteredRecipes);
  updateDropdownLists(filteredRecipes);
}

/**
 * Crée un élément de tag HTML
 * @param {string} item - L'élément du tag
 * @param {string} category - La catégorie du tag
 * @param {Function} onCloseCallback - Fonction à exécuter lors de la suppression d'un tag
 * @returns {HTMLElement} - L'élément HTML du tag
 */
function createTagElement(item, category, onCloseCallback) {
  const tag = document.createElement("div");
  tag.classList.add("tag");
  tag.dataset.item = item;
  tag.dataset.category = category;
  tag.textContent = item;

  const closeBtn = document.createElement("i");
  closeBtn.classList.add("fa-solid", "fa-circle-xmark", "close-btn");
  closeBtn.addEventListener("click", () => {
    tag.remove();
    onCloseCallback(item, category);
    updateResults();
  });

  tag.appendChild(closeBtn);
  return tag;
}

/**
 * Ajoute un tag à la liste des tags globaux
 * @param {string} item - Élément à ajouter
 * @param {string} category - Catégorie du tag
 * @param {Function} onCloseCallback - Fonction à exécuter lors de la suppression d'un tag
 */
export function addTag(item, category, onCloseCallback) {
  const tagContainer = document.getElementById("tags");

  // Vérifier si le tag existe déjà
  if (Array.from(tagContainer.children).some((tag) => tag.dataset.item === item && tag.dataset.category === category)) {
    return; // Éviter les doublons
  }

  const normalizedCategory = normalizeCategory(category);
  const tag = createTagElement(item, normalizedCategory, onCloseCallback);

  tagContainer.appendChild(tag);
  updateResults();
}

/**
 * Supprime un tag spécifique
 * @param {string} item - Élément à supprimer
 * @param {string} category - Catégorie du tag
 * @param {Function} onUpdateCallback - Fonction exécutée après mise à jour
 */
export function removeTag(item, category, onUpdateCallback) {
  const tagContainer = document.getElementById("tags");

  const tag = Array.from(tagContainer.children).find(
    (t) => t.dataset.item === item && t.dataset.category === category
  );

  if (tag) {
    tagContainer.removeChild(tag);
    removeDropdownTag(item, category);
  }

  updateResults();

  if (typeof onUpdateCallback === "function") {
    const remainingTags = Array.from(tagContainer.children).map((tag) => ({
      item: tag.dataset.item,
      category: tag.dataset.category,
    }));
    onUpdateCallback(remainingTags);
  }
}

/**
 * Ajoute un tag à la liste déroulante
 * @param {string} item - Élément à ajouter
 * @param {string} category - Catégorie du tag
 */
export function addDropdownTag(item, category) {
  const normalizedCategory = normalizeCategory(category);
  const tagContainer = document.getElementById(`${category}Tags`);
  if (!tagContainer) return;

  // Vérifier si le tag existe déjà
  if (Array.from(tagContainer.children).some((tag) => tag.dataset.item === item)) {
    return;
  }

  const tag = createTagElement(item, normalizedCategory, () => {
    removeTag(item, normalizedCategory);
  });

  tagContainer.appendChild(tag);
}

/**
 * Supprime un tag de la liste déroulante
 * @param {string} item - Élément à supprimer
 * @param {string} category - Catégorie du tag
 */
export function removeDropdownTag(item, category) {
  const dropdownCategory = category.replace(/s$/, ""); // Enlève le 's' final si présent
  const tagContainer = document.getElementById(`${dropdownCategory}Tags`);
  if (!tagContainer) return;

  const tag = Array.from(tagContainer.children).find((t) => t.textContent.trim() === item);
  if (tag) {
    tag.remove();

    const listId = `${dropdownCategory}List`;
    const list = document.getElementById(listId);
    if (list) {
      const newLi = document.createElement("li");
      newLi.textContent = item;
      newLi.addEventListener("click", () => addTag(item, dropdownCategory));
      list.appendChild(newLi);
    }
  }
}
