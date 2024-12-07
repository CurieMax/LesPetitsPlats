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

  // Vérifiez si le tag existe déjà
  const existingTag = Array.from(tagContainer.children).find(
    (tag) => tag.dataset.item === item && tag.dataset.category === category
  );
  if (existingTag) return; // Éviter les doublons

  // Ajout du tag
  const tag = document.createElement("div");
  tag.classList.add("tag");
  tag.dataset.item = item;
  tag.dataset.category = category;
  tag.textContent = item;

  const closeBtn = document.createElement("i");
  closeBtn.classList.add("fa-solid", "fa-circle-xmark", "close-btn");
  closeBtn.addEventListener("click", () => {
    tagContainer.removeChild(tag); // Supprimer le tag
    onCloseCallback(item, category);

    // Mettre à jour la recherche et les listes
    const remainingTags = [
      ...document.getElementById("tags").querySelectorAll(".tag"),
    ].map((tag) => ({
      item: tag.dataset.item,
      category: tag.dataset.category,
    }));

    const recipes = JSON.parse(localStorage.getItem("recipesData")) || [];
    const filteredRecipes = combinedSearch(
      document.querySelector(".search-bar input").value,
      remainingTags,
      recipes
    );

    displayRecipes(filteredRecipes);
    updateDropdownLists(filteredRecipes);
  });

  tag.appendChild(closeBtn);
  tagContainer.appendChild(tag);

  // Mise à jour des résultats
  const selectedTags = [
    ...document.getElementById("tags").querySelectorAll(".tag"),
  ].map((tag) => ({
    item: tag.dataset.item,
    category: tag.dataset.category,
  }));

  const recipes = JSON.parse(localStorage.getItem("recipesData")) || [];
  const filteredRecipes = combinedSearch(
    document.querySelector(".search-bar input").value,
    selectedTags,
    recipes
  );

  displayRecipes(filteredRecipes);
  updateDropdownLists(filteredRecipes);
}

/**
 * Supprime un tag spécifique et met à jour les recettes
 * @param {string} item - Élément à supprimer
 * @param {string} category - Catégorie du tag
 * @param {Function} onUpdateCallback - Fonction exécutée après mise à jour
 */
export function removeTag(item, category, onUpdateCallback) {
  const tagContainer = document.getElementById("tags");

  const tag = Array.from(tagContainer.children).find(
    (t) => t.dataset.item === item && t.dataset.category === category //chaque élément représenté par un "t" est un enfant de "tagContainer"
  );

  if (tag) {
    tagContainer.removeChild(tag);
  }

  const remainingTags = Array.from(tagContainer.children).map((tag) => ({
    item: tag.dataset.item,
    category: tag.dataset.category,
  }));

  onUpdateCallback(remainingTags);

  const searchInput = document.querySelector(".search-bar input").value;
  const selectedTags = [
    ...document.getElementById("tags").querySelectorAll(".tag"),
  ].map((tag) => ({
    item: tag.dataset.item,
    category: tag.dataset.category,
  }));

  const recipes = JSON.parse(localStorage.getItem("recipesData")) || [];
  const filteredRecipes = combinedSearch(searchInput, selectedTags, recipes);
  displayRecipes(filteredRecipes);

  // Met à jour les options restantes après suppression
  const { remainingOptions } = filterRecipesByItems(remainingTags);
  updateDropdownLists(remainingOptions); // Met à jour les listes déroulantes
}
