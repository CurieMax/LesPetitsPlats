import { displayRecipes } from "./index.js";
import { addTag, addDropdownTag } from "./tag.js";
import { combinedSearch } from "./search.js";

// Récupération des données des recettes depuis sessionStorage
const recipesData = sessionStorage.getItem("recipesData");
const recipes = recipesData ? JSON.parse(recipesData) : [];

// Générer les listes uniques
const uniqueIngredients = getUniqueItems(recipes, "ingredients");
const uniqueAppliances = getUniqueItems(recipes, "appliance");
const uniqueUstensils = getUniqueItems(recipes, "ustensils");

/**
 * Retourne un tableau d'éléments uniques extraits de la clé `key` des recettes.
 * @param {Object[]} recipes - Tableau de recettes
 * @param {string} key - Clé des éléments à extraire
 * @returns {string[]} Tableau d'éléments uniques extraits
 */
export function getUniqueItems(recipes, key) {
  if (!Array.isArray(recipes)) {
    return []; // Retourne un tableau vide en cas d'erreur
  }

  const itemsSet = new Set();

  recipes.forEach((recipe) => {
    if (key === "ingredients") {
      recipe.ingredients?.forEach((ingredientObj) =>
        itemsSet.add(ingredientObj.ingredient)
      );
    } else if (key === "ustensils") {
      recipe.ustensils?.forEach((ustensil) => itemsSet.add(ustensil));
    } else {
      itemsSet.add(recipe[key]);
    }
  });

  return Array.from(itemsSet).sort();
}

/**
 * Crée un conteneur de tags pour une liste déroulante
 * @param {string} dropdownId - ID de la liste déroulante
 * @returns {HTMLElement} Le conteneur de tags créé
 */
function createDropdownTagsContainer(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const searchDiv = dropdown.querySelector(".filter-search");

  // Vérifier si le conteneur existe déjà
  let tagsContainer = dropdown.querySelector(".dropdown-tags");
  if (!tagsContainer) {
    // Créer le conteneur de tags
    tagsContainer = document.createElement("div");
    tagsContainer.classList.add("dropdown-tags");
    tagsContainer.id = dropdownId.replace("Dropdown", "Tags");

    // Insérer après la barre de recherche
    searchDiv.insertAdjacentElement("afterend", tagsContainer);
  }

  return tagsContainer;
}

/**
 * Affiche les éléments d'une liste dans un élément HTML (par exemple, un <ul>)
 * et ajoute un listener pour gérer les clics sur chaque élément.
 * Si la liste est vide, affiche un message "Aucun résultat trouvé".
 * @param {string[]} items - Tableau de éléments à afficher
 * @param {string} listId - ID de l'élément HTML où afficher les éléments
 * @param {Function} onClickCallback - Fonction à exécuter lors d'un clic sur un élément
 */
export function displayItems(items, listId, onClickCallback) {
  const list = document.getElementById(listId);
  list.innerHTML = ""; // Réinitialiser la liste

  // Créer le conteneur de tags s'il n'existe pas
  const dropdownId = listId.replace("List", "Dropdown");
  createDropdownTagsContainer(dropdownId);

  if (items.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Aucun résultat trouvé";
    list.appendChild(li);
    return;
  }

  // Récupérer les tags existants pour cette catégorie
  const category = listId.replace("List", "");
  const existingTags = Array.from(document.getElementById("tags").children)
    .filter(
      (tag) => tag.dataset.category === (categoryMap[category] || category)
    )
    .map((tag) => tag.dataset.item);

  items.forEach((item) => {
    // Ne pas afficher l'élément s'il est déjà tagué
    if (existingTags.includes(item)) {
      return;
    }

    const li = document.createElement("li");
    li.textContent = item;

    li.addEventListener("click", () => {
      // Supprimer l'élément de la liste
      list.removeChild(li);

      // Ajouter le tag dans le conteneur de tags
      const tagContainerId = listId.replace("List", "Tags");
      const tagContainer = document.getElementById(tagContainerId);
      const category = listId.replace("List", "");

      if (tagContainer) {
        // Table de correspondance pour uniformiser les noms des tags
        const categoryMap = {
          ingredient: "ingredients",
          appliance: "appliances",
          ustensil: "ustensils",
        };

        // Uniformiser la catégorie
        const normalizedCategory = categoryMap[category] || category;

        // Créer le nouveau tag
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
            (tag) =>
              tag.dataset.item === item &&
              tag.dataset.category === normalizedCategory
          );
          if (globalTag) {
            globalTags.removeChild(globalTag);
          }

          // Mettre à jour l'affichage
          const remainingTags = [
            ...document.getElementById("tags").querySelectorAll(".tag"),
          ].map((tag) => ({
            item: tag.dataset.item,
            category: tag.dataset.category,
          }));

          const recipes =
            JSON.parse(sessionStorage.getItem("recipesData")) || [];
          const filteredRecipes = combinedSearch(
            document.querySelector(".search-bar input").value,
            remainingTags,
            recipes
          );

          displayRecipes(filteredRecipes);
          updateDropdownLists(filteredRecipes);

          // Réafficher l'élément dans la liste
          const newLi = document.createElement("li");
          newLi.textContent = item;
          newLi.addEventListener("click", li.onclick);
          list.appendChild(newLi);
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

      // Appeler le callback pour gérer l'ajout du tag global
      onClickCallback(item);
    });
    list.appendChild(li);
  });
}

// Table de correspondance pour uniformiser les noms des tags
const categoryMap = {
  ingredient: "ingredients",
  appliance: "appliances",
  ustensil: "ustensils",
};

/**
 * Ajoute la fonctionnalité de recherche à un champ de formulaire et à une liste HTML
 * @param {string} inputId - ID du champ de formulaire de recherche
 * @param {string} listId - ID de la liste HTML <ul> ciblée
 * @param {string[]} items - Tableau d'éléments à filtrer
 */
function addSearchFunctionality(inputId, listId, items) {
  const inputElement = document.getElementById(inputId);

  inputElement.addEventListener("input", (event) => {
    const searchValue = event.target.value.toLowerCase();
    const filteredItems = items.filter((item) =>
      item.toLowerCase().includes(searchValue)
    );

    displayItems(filteredItems, listId, (selectedItem) => {
      // Ajouter le tag dans la liste déroulante
      addDropdownTag(selectedItem, listId.replace("List", ""));

      // Ajouter le tag global
      addTag(selectedItem, listId.replace("List", ""), (removedItem) => {
        console.log(`Tag supprimé : ${removedItem}`);
      });
    });
  });

  // Afficher les éléments initiaux
  displayItems(items, listId, (selectedItem) => {
    // Ajouter le tag dans la liste déroulante
    addDropdownTag(selectedItem, listId.replace("List", ""));

    // Ajouter le tag global
    addTag(selectedItem, listId.replace("List", ""), (removedItem) => {
      console.log(`Tag supprimé : ${removedItem}`);
    });
  });
}

// Initialiser les fonctionnalités de recherche
addSearchFunctionality("ingredientSearch", "ingredientList", uniqueIngredients);
addSearchFunctionality("applianceSearch", "applianceList", uniqueAppliances);
addSearchFunctionality("ustensilSearch", "ustensilList", uniqueUstensils);

/**
 * Initializes and sets up filters for ingredients, appliances, and utensils.
 * Retrieves unique items from the recipes data and displays them in their respective lists.
 * Adds search functionality to the input fields for filtering options in each category.
 * Handles user interactions by adding or removing tags and logs actions to the console.
 */
export function setupFilters() {
  const uniqueIngredients = getUniqueItems(recipes, "ingredients");
  const uniqueAppliances = getUniqueItems(recipes, "appliance");
  const uniqueUstensils = getUniqueItems(recipes, "ustensils");

  displayItems(uniqueIngredients, "ingredientList", (item) => {
    addTag(item, "ingredients", (removedItem) => {
      console.log(`Tag supprimé : ${removedItem}`);
    });
  });

  displayItems(uniqueAppliances, "applianceList", (item) => {
    console.log(`Appareil sélectionné : ${item}`);
  });

  displayItems(uniqueUstensils, "ustensilList", (item) => {
    console.log(`Ustensile sélectionné : ${item}`);
  });

  addSearchFunctionality(
    "ingredientSearch",
    "ingredientList",
    uniqueIngredients
  );
  addSearchFunctionality("applianceSearch", "applianceList", uniqueAppliances);
  addSearchFunctionality("ustensilSearch", "ustensilList", uniqueUstensils);
}

/**
 * Met à jour les listes déroulantes des filtres pour les ingrédients, appareils et ustensiles
 * en fonction des recettes filtrées.
 * @param {Object[]} filteredRecipes - Tableau des recettes filtrées par les tags actuels
 */
export function updateDropdownLists(filteredRecipes) {
  const remainingOptions = {
    ingredients: getUniqueItems(filteredRecipes, "ingredients"),
    appliances: getUniqueItems(filteredRecipes, "appliance"),
    ustensils: getUniqueItems(filteredRecipes, "ustensils"),
  };

  displayItems(remainingOptions.ingredients, "ingredientList", (ingredient) => {
    addTag(ingredient, "ingredients", () => {});
  });

  displayItems(remainingOptions.appliances, "applianceList", (appliance) => {
    addTag(appliance, "appliances", () => {});
  });

  displayItems(remainingOptions.ustensils, "ustensilList", (ustensil) => {
    addTag(ustensil, "ustensils", () => {});
  });
}

/**
 * Filters recipes by the selected tags.
 * Returns an object with the filtered recipes and the remaining options for each category.
 *
 * @param {Object[]} selectedTags - The selected tags with their item and category.
 * @returns {Object} An object containing the filteredRecipes and the remainingOptions.
 */
export function filterRecipesByItems(selectedTags) {
  const recipes = JSON.parse(sessionStorage.getItem("recipesData")) || [];
  const tagsByCategory = selectedTags.reduce(
    (acc, { item, category }) => {
      acc[category].push(item);
      return acc;
    },
    { ingredients: [], appliances: [], ustensils: [] }
  );

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesIngredients = tagsByCategory.ingredients.every((tag) =>
      recipe.ingredients.some((ing) => ing.ingredient === tag)
    );

    const matchesAppliances = tagsByCategory.appliances.every(
      (tag) => recipe.appliance === tag
    );

    const matchesUstensils = tagsByCategory.ustensils.every((tag) =>
      recipe.ustensils.includes(tag)
    );

    return matchesIngredients && matchesAppliances && matchesUstensils;
  });

  const remainingOptions = {
    ingredients: getUniqueItems(filteredRecipes, "ingredients"),
    appliances: getUniqueItems(filteredRecipes, "appliance"),
    ustensils: getUniqueItems(filteredRecipes, "ustensils"),
  };

  displayRecipes(filteredRecipes);

  return { filteredRecipes, remainingOptions };
}

/**
 * Toggles the visibility of a dropdown list when the trigger element is clicked.
 * Closes other open dropdown lists to ensure only one is open at a time.
 * Also closes the dropdown if a click occurs outside the trigger or dropdown elements.
 *
 * @param {HTMLElement} triggerElement - The element that triggers the dropdown toggle when clicked.
 * @param {HTMLElement} dropdownElement - The dropdown element whose visibility is toggled.
 */
export function toggleDropdown(triggerElement, dropdownElement) {
  triggerElement.addEventListener("click", (event) => {
    event.stopPropagation();

    // Fermer les autres listes déroulantes
    document.querySelectorAll(".dropdown-list").forEach((dropdown) => {
      if (dropdown !== dropdownElement) {
        dropdown.style.display = "none";
      }
    });

    // Basculer l'affichage de la liste
    dropdownElement.style.display =
      dropdownElement.style.display === "block" ? "none" : "block";
  });

  // Fermer la liste si on clique en dehors
  document.addEventListener("click", (event) => {
    if (
      !triggerElement.contains(event.target) &&
      !dropdownElement.contains(event.target)
    ) {
      dropdownElement.style.display = "none";
    }
  });
}
