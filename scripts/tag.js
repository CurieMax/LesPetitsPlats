import { displayRecipes } from "./index.js";
import { filterRecipesByItems, updateDropdownLists } from "./filter.js";
import { combinedSearch } from "./search.js";

/**
 * Ajoute un tag à la liste des tags
 * @param {string} item - Élément à ajouter
 * @param {string} category - Catégorie du tag
 * @param {Function} onCloseCallback - Fonction à exécuter lors de la suppression d'un tag
 */
export function addTag(item, category, onCloseCallback) {
  const tagContainer = document.getElementById("tags");

  // Vérifiez si le tag existe déjà pour éviter les doublons
  const existingTag = Array.from(tagContainer.children).find(
    (tag) => tag.dataset.item === item && tag.dataset.category === category
  );
  if (existingTag) return;

  // Ajout du tag
  const tag = document.createElement("div");
  tag.classList.add("tag");
  tag.dataset.item = item;
  tag.dataset.category = category;
  tag.textContent = item;

  const closeBtn = document.createElement("i");
  closeBtn.classList.add("fa-solid", "fa-circle-xmark", "close-btn");
  closeBtn.addEventListener("click", () => {
    tagContainer.removeChild(tag);
    onCloseCallback(item, category);

    // Mise à jour des recettes et des listes déroulantes
    const selectedTags = Array.from(tagContainer.children).map((tag) => ({
      item: tag.dataset.item,
      category: tag.dataset.category,
    }));

    const searchInput = document.querySelector(".search-bar input").value;
    updateRecipesAndDropdowns(selectedTags, searchInput);
  });

  tag.appendChild(closeBtn);
  tagContainer.appendChild(tag);

  // Mise à jour des résultats après ajout
  const selectedTags = Array.from(tagContainer.children).map((tag) => ({
    item: tag.dataset.item,
    category: tag.dataset.category,
  }));

  const searchInput = document.querySelector(".search-bar input").value;
  updateRecipesAndDropdowns(selectedTags, searchInput);
}


/**
 * Supprime un tag de la liste des tags
 * @param {string} item - Élément à supprimer
 * @param {string} category - Catégorie du tag
 * @param {Function} onUpdateCallback - Fonction à exécuter avec la liste des tags restants
 */

export function removeTag(item, category, onUpdateCallback) {
  const tagContainer = document.getElementById("tags");

  // Recherche et suppression du tag
  const tag = Array.from(tagContainer.children).find(
    (t) => t.dataset.item === item && t.dataset.category === category
  );
  if (tag) tagContainer.removeChild(tag);

  // Récupération des tags restants
  const remainingTags = Array.from(tagContainer.children).map((tag) => ({
    item: tag.dataset.item,
    category: tag.dataset.category,
  }));

  onUpdateCallback(remainingTags);

  // Mise à jour des recettes et des listes déroulantes
  const { filteredRecipes, remainingOptions } = filterRecipesByItems(
    remainingTags
  );

  // Vérifie et affiche les recettes filtrées
  if (Array.isArray(filteredRecipes)) {
    displayRecipes(filteredRecipes);
  } else {
    console.error("filteredRecipes n'est pas un tableau :", filteredRecipes);
  }

  // Mise à jour des listes déroulantes
  if (remainingOptions) {
    updateDropdownLists(remainingOptions);
  } else {
    console.error("remainingOptions est indéfini ou invalide :", remainingOptions);
  }
}



/**
 * Met à jour les recettes affichées et les listes déroulantes en fonction des
 * tags actuels et de la valeur de recherche.
 *
 * @param {Object[]} tags - Tableau d'objets définissant les tags actuels
 * @param {string} searchInput - Valeur de recherche actuelle
 */
function updateRecipesAndDropdowns(tags, searchInput) {
  const recipes = JSON.parse(sessionStorage.getItem("recipesData")) || [];
  if (!Array.isArray(recipes)) {
    console.error("Invalid recipes data. Expected an array.");
    return;
  }

  // Filtre les recettes
  const filteredRecipes = combinedSearch(searchInput, tags, recipes);
  if (!Array.isArray(filteredRecipes)) {
    console.error("filteredRecipes n'est pas un tableau :", filteredRecipes);
    return;
  }

  displayRecipes(filteredRecipes);

  // Extrait et met à jour les options restantes
  const { remainingOptions } = filterRecipesByItems(tags);
  if (remainingOptions) {
    updateDropdownLists(remainingOptions);
  } else {
    console.error("remainingOptions est indéfini ou invalide :", remainingOptions);
  }
}