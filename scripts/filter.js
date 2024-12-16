import { displayRecipes } from "./index.js";
import { addTag } from "./tag.js";

// Données des recettes (à adapter selon vos données)
const recipes = JSON.parse(sessionStorage.getItem("recipesData"));

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
  const itemsSet = new Set();

  recipes.forEach((recipe) => {
    if (key === "ingredients") {
      recipe.ingredients?.forEach((ingredientObj) =>
        itemsSet.add(ingredientObj.ingredient)
      );
    } else if (key === "ustensils") {
      recipe.ustensils?.forEach((ustensil) => itemsSet.add(ustensil));
    } else {
      if (recipe[key]) itemsSet.add(recipe[key]);
    }
  });

  return Array.from(itemsSet).sort();
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

  if (items.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Aucun résultat trouvé";
    list.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", () => {
      li.classList.toggle("choosed-tags");
      onClickCallback(item);
    });
    list.appendChild(li);
  });
}

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
      addTag(selectedItem, listId.replace("List", ""), (removedItem) => {
        console.log(`Tag supprimé : ${removedItem}`);
      });
    });
  });

  // Afficher les éléments initiaux
  displayItems(items, listId, (selectedItem) => {
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
export function updateDropdownLists(remainingOptions) {
  if (
    !remainingOptions ||
    !Array.isArray(remainingOptions.ingredients) ||
    !Array.isArray(remainingOptions.appliances) ||
    !Array.isArray(remainingOptions.ustensils)
  ) {
    console.error("Invalid remainingOptions :", remainingOptions);
    return;
  }

  // Met à jour la liste des ingrédients
  displayItems(remainingOptions.ingredients, "ingredientList", (ingredient) => {
    addTag(ingredient, "ingredients", () => {});
  });

  // Met à jour la liste des appareils
  displayItems(remainingOptions.appliances, "applianceList", (appliance) => {
    addTag(appliance, "appliances", () => {});
  });

  // Met à jour la liste des ustensiles
  displayItems(remainingOptions.ustensils, "ustensilList", (ustensil) => {
    addTag(ustensil, "ustensils", () => {});
  });
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
