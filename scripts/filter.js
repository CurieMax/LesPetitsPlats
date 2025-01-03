import { addTag } from "./tag.js";

// Mise en cache des sélecteurs DOM fréquemment utilisés
const tagsContainer = document.getElementById("tags");

// Table de correspondance pour uniformiser les noms des tags
const categoryMap = {
  ingredient: "ingredients",
  appliance: "appliances",
  ustensil: "ustensils",
};

let uniqueIngredients = [];
let uniqueAppliances = [];
let uniqueUstensils = [];

/**
 * Retourne un tableau d'éléments uniques extraits de la clé `key` des recettes.
 * @param {Object[]} recipes - Tableau de recettes
 * @param {string} key - Clé des éléments à extraire
 * @returns {string[]} Tableau d'éléments uniques extraits
 */
export function getUniqueItems(recipes, key) {
  if (!Array.isArray(recipes)) return [];

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
 * Initialise les listes uniques à partir des recettes
 * @param {Object[]} recipes - Tableau de recettes
 */
export function initializeLists(recipes) {
  uniqueIngredients = getUniqueItems(recipes, "ingredients");
  uniqueAppliances = getUniqueItems(recipes, "appliance");
  uniqueUstensils = getUniqueItems(recipes, "ustensils");

  // Initialiser les fonctionnalités de recherche
  addSearchFunctionality(
    "ingredientSearch",
    "ingredientList",
    uniqueIngredients
  );
  addSearchFunctionality("applianceSearch", "applianceList", uniqueAppliances);
  addSearchFunctionality("ustensilSearch", "ustensilList", uniqueUstensils);
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
      .filter(
        (tag) => tag.dataset.category === (categoryMap[category] || category)
      )
      .map((tag) => [tag.dataset.item, tag])
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
 * Ajoute la fonctionnalité de recherche
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

      // Récupérer les éléments actuellement affichés dans la liste
      const currentList = document.getElementById(listId);
      const currentItems = new Set();
      currentList.querySelectorAll("li").forEach((li) => {
        const itemText = li.textContent.trim();
        if (itemText) currentItems.add(itemText);
      });

      // Filtrer uniquement parmi les éléments actuellement disponibles
      const filteredItems = Array.from(currentItems).filter((item) =>
        item.toLowerCase().includes(searchValue)
      );

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

/**
 * Filtre les recettes par tags sélectionnés
 * @param {Object[]} selectedTags - Tags sélectionnés
 * @param {Object[]} recipes - Recettes à filtrer
 * @returns {Object} Recettes filtrées et options restantes
 */
export function filterRecipesByItems(selectedTags, recipes) {
  if (!selectedTags.length) return recipes;

  return recipes.filter((recipe) => {
    return selectedTags.every(({ item, category }) => {
      const normalizedCategory = categoryMap[category] || category;

      if (normalizedCategory === "ingredients") {
        return recipe.ingredients.some(
          (ing) => ing.ingredient.toLowerCase() === item.toLowerCase()
        );
      }
      if (normalizedCategory === "appliances") {
        return recipe.appliance.toLowerCase() === item.toLowerCase();
      }
      if (normalizedCategory === "ustensils") {
        return recipe.ustensils.some(
          (u) => u.toLowerCase() === item.toLowerCase()
        );
      }
      return false;
    });
  });
}

/**
 * Met à jour les listes déroulantes des filtres
 * @param {Object[]} filteredRecipes - Tableau des recettes filtrées
 */
export function updateDropdownLists(filteredRecipes) {
  const newIngredients = getUniqueItems(filteredRecipes, "ingredients");
  const newAppliances = getUniqueItems(filteredRecipes, "appliance");
  const newUstensils = getUniqueItems(filteredRecipes, "ustensils");

  displayItems(newIngredients, "ingredientList", (item) =>
    addTag(item, "ingredient", () => {})
  );
  displayItems(newAppliances, "applianceList", (item) =>
    addTag(item, "appliance", () => {})
  );
  displayItems(newUstensils, "ustensilList", (item) =>
    addTag(item, "ustensil", () => {})
  );
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
    if (
      !triggerElement.contains(event.target) &&
      !dropdownElement.contains(event.target)
    ) {
      dropdownElement.style.display = "none";
    }
  });
}
