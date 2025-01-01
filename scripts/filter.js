import { displayRecipes } from "./index.js";
import { addTag } from "./tag.js";

// Mise en cache des sélecteurs DOM fréquemment utilisés
const tagsContainer = document.getElementById("tags");

// Récupération des données des recettes depuis sessionStorage
const recipesData = sessionStorage.getItem("recipesData");
const recipes = recipesData ? JSON.parse(recipesData) : [];

// Cache pour les résultats de recherche
const searchCache = new Map();

// Table de correspondance pour uniformiser les noms des tags
const categoryMap = {
  ingredient: "ingredients",
  appliance: "appliances",
  ustensil: "ustensils",
};

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
  if (!Array.isArray(recipes)) return [];

  const itemsSet = new Set();
  const cacheKey = `${key}_${recipes.length}`;
  
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

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

  const result = Array.from(itemsSet).sort();
  searchCache.set(cacheKey, result);
  return result;
}

/**
 * Crée un élément de liste avec son contenu
 * @param {string} item - Texte de l'élément
 * @param {boolean} isSelected - Si l'élément est sélectionné
 * @returns {HTMLElement} L'élément de liste créé
 */
function createListItem(item, isSelected) {
  const li = document.createElement("li");
  const contentSpan = document.createElement("span");
  contentSpan.textContent = item;
  li.appendChild(contentSpan);

  if (isSelected) {
    li.classList.add("selected");
    const closeBtn = document.createElement("i");
    closeBtn.classList.add("fa-solid", "fa-circle-xmark", "close-btn");
    li.appendChild(closeBtn);
  }

  return li;
}

/**
 * Affiche les éléments d'une liste dans un élément HTML
 * @param {string[]} items - Tableau d'éléments à afficher
 * @param {string} listId - ID de l'élément HTML où afficher les éléments
 * @param {Function} onClickCallback - Fonction à exécuter lors d'un clic
 */
export function displayItems(items, listId, onClickCallback) {
  const list = document.getElementById(listId);
  const fragment = document.createDocumentFragment();
  const category = listId.replace("List", "");
  
  if (items.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Aucun résultat trouvé";
    fragment.appendChild(li);
    list.innerHTML = "";
    list.appendChild(fragment);
    return;
  }

  // Créer une Map des tags existants pour une recherche plus rapide
  const existingTags = new Map(
    [...tagsContainer.children]
      .filter(tag => tag.dataset.category === (categoryMap[category] || category))
      .map(tag => [tag.dataset.item, tag])
  );

  // Utiliser un fragment pour minimiser les manipulations du DOM
  items.forEach((item) => {
    const isSelected = existingTags.has(item);
    const li = createListItem(item, isSelected);

    // Gestionnaire d'événements délégué
    li.addEventListener("click", (e) => {
      if (e.target.classList.contains("close-btn")) {
        e.stopPropagation();
        const tagToRemove = existingTags.get(item);
        if (tagToRemove) {
          tagToRemove.querySelector(".close-btn").click();
        }
        li.classList.remove("selected");
        li.querySelector(".close-btn")?.remove();
        return;
      }

      if (!li.classList.contains("selected")) {
        const closeBtn = document.createElement("i");
        closeBtn.classList.add("fa-solid", "fa-circle-xmark", "close-btn");
        li.appendChild(closeBtn);
        li.classList.add("selected");
        onClickCallback(item);
      }
    });

    fragment.appendChild(li);
  });

  list.innerHTML = "";
  list.appendChild(fragment);
}

/**
 * Ajoute la fonctionnalité de recherche avec mise en cache
 * @param {string} inputId - ID du champ de recherche
 * @param {string} listId - ID de la liste HTML
 * @param {string[]} items - Tableau d'éléments à filtrer
 */
function addSearchFunctionality(inputId, listId, items) {
  const inputElement = document.getElementById(inputId);
  let searchTimeout;

  inputElement.addEventListener("input", (event) => {
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
      const searchValue = event.target.value.toLowerCase();
      const cacheKey = `${listId}_${searchValue}`;

      let filteredItems;
      if (searchCache.has(cacheKey)) {
        filteredItems = searchCache.get(cacheKey);
      } else {
        filteredItems = items.filter(item => 
          item.toLowerCase().includes(searchValue)
        );
        searchCache.set(cacheKey, filteredItems);
      }

      displayItems(filteredItems, listId, (selectedItem) => {
        addTag(selectedItem, listId.replace("List", ""), () => {});
      });
    }, 150); // Debounce de 150ms
  });

  // Affichage initial
  displayItems(items, listId, (selectedItem) => {
    addTag(selectedItem, listId.replace("List", ""), () => {});
  });
}

// Initialiser les fonctionnalités de recherche
addSearchFunctionality("ingredientSearch", "ingredientList", uniqueIngredients);
addSearchFunctionality("applianceSearch", "applianceList", uniqueAppliances);
addSearchFunctionality("ustensilSearch", "ustensilList", uniqueUstensils);

/**
 * Met à jour les listes déroulantes des filtres
 * @param {Object[]} filteredRecipes - Tableau des recettes filtrées
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
 * Gère l'affichage des listes déroulantes
 * @param {HTMLElement} triggerElement - Élément déclencheur
 * @param {HTMLElement} dropdownElement - Élément de la liste déroulante
 */
export function toggleDropdown(triggerElement, dropdownElement) {
  const dropdowns = document.querySelectorAll(".dropdown-list");
  
  triggerElement.addEventListener("click", (event) => {
    event.stopPropagation();
    
    dropdowns.forEach((dropdown) => {
      if (dropdown !== dropdownElement) {
        dropdown.style.display = "none";
      }
    });

    dropdownElement.style.display =
      dropdownElement.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (event) => {
    if (!triggerElement.contains(event.target) && !dropdownElement.contains(event.target)) {
      dropdownElement.style.display = "none";
    }
  });
}

/**
 * Filtre les recettes par tags sélectionnés
 * @param {Object[]} selectedTags - Tags sélectionnés
 * @returns {Object} Recettes filtrées et options restantes
 */
export function filterRecipesByItems(selectedTags) {
  const cacheKey = JSON.stringify(selectedTags);
  
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

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

  const result = { filteredRecipes, remainingOptions };
  searchCache.set(cacheKey, result);
  
  displayRecipes(filteredRecipes);
  return result;
}
