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

  // Table de correspondance pour uniformiser les noms des tags
  const categoryMap = {
    "ingredient": "ingredients",
    "appliance": "appliances",
    "ustensil": "ustensils",
  };

  // uniformiser les noms des tags
  if (categoryMap[category]) {
    category = categoryMap[category];
  }

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

    const recipes = JSON.parse(sessionStorage.getItem("recipesData")) || [];
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

  const recipes = JSON.parse(sessionStorage.getItem("recipesData")) || [];
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
    (t) => t.dataset.item === item && t.dataset.category === category
  );

  if (tag) {
    tagContainer.removeChild(tag);
    // Supprimer également le tag de la liste déroulante
    removeDropdownTag(item, category);
  }

  // Récupérer les tags restants
  const remainingTags = Array.from(tagContainer.children).map((tag) => ({
    item: tag.dataset.item,
    category: tag.dataset.category,
  }));

  // Mettre à jour les recettes
  const recipes = JSON.parse(sessionStorage.getItem("recipesData")) || [];
  const filteredRecipes = combinedSearch(
    document.querySelector(".search-bar input").value,
    remainingTags,
    recipes
  );

  displayRecipes(filteredRecipes);
  updateDropdownLists(filteredRecipes);

  // Appeler le callback avec les tags restants
  if (onUpdateCallback && typeof onUpdateCallback === 'function') {
    onUpdateCallback(remainingTags);
  }
}

/**
 * Ajoute un tag à la liste déroulante
 * @param {string} item - Élément à ajouter
 * @param {string} category - Catégorie du tag
 */
export function addDropdownTag(item, category) {
  // Table de correspondance pour uniformiser les noms des tags
  const categoryMap = {
    "ingredient": "ingredients",
    "appliance": "appliances",
    "ustensil": "ustensils",
  };

  // Uniformiser la catégorie
  const normalizedCategory = categoryMap[category] || category;

  // Trouver le conteneur de tags
  const tagContainer = document.getElementById(`${category}Tags`);
  if (!tagContainer) return;

  // Vérifier si le tag existe déjà
  const existingTag = Array.from(tagContainer.children).find(
    tag => tag.dataset.item === item
  );
  if (existingTag) return;

  // Créer le tag
  const tag = document.createElement("div");
  tag.classList.add("tag");
  tag.dataset.item = item;
  tag.dataset.category = normalizedCategory;
  tag.textContent = item;

  // Ajouter le bouton de fermeture
  const closeBtn = document.createElement("i");
  closeBtn.classList.add("fa-solid", "fa-circle-xmark", "close-btn");
  closeBtn.addEventListener("click", () => {
    // Supprimer ce tag spécifique
    tag.remove();

    // Supprimer le tag global correspondant
    const globalTags = document.getElementById("tags");
    const globalTag = Array.from(globalTags.children).find(
      tag => tag.dataset.item === item && tag.dataset.category === normalizedCategory
    );
    if (globalTag) {
      globalTags.removeChild(globalTag);
    }

    // Mettre à jour l'affichage
    const remainingTags = [...document.getElementById("tags").querySelectorAll(".tag")].map(tag => ({
      item: tag.dataset.item,
      category: tag.dataset.category
    }));

    const recipes = JSON.parse(sessionStorage.getItem("recipesData")) || [];
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
}

/**
 * Supprime un tag de la liste déroulante
 * @param {string} item - Élément à supprimer
 * @param {string} category - Catégorie du tag
 */
export function removeDropdownTag(item, category) {
  // Convertir la catégorie au format de la liste déroulante
  const dropdownCategory = category.replace(/s$/, ''); // Enlève le 's' final si présent
  const tagContainerId = `${dropdownCategory}Tags`;
  const tagContainer = document.getElementById(tagContainerId);
  
  if (tagContainer) {
    const tag = Array.from(tagContainer.children).find(
      t => t.textContent.replace(/✕$/, '').trim() === item
    );
    if (tag) {
      tag.remove();
      
      // Réajouter l'élément à la liste des choix
      const listId = `${dropdownCategory}List`;
      const list = document.getElementById(listId);
      if (list) {
        const newLi = document.createElement("li");
        newLi.textContent = item;
        newLi.addEventListener("click", () => {
          addTag(item, dropdownCategory);
        });
        list.appendChild(newLi);
      }
    }
  }
}
