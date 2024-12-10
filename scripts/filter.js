import { displayRecipes } from "./index.js";
import { addTag } from "./tag.js";

// Données des recettes (à adapter selon vos données)
const recipes = JSON.parse(sessionStorage.getItem("recipesData"));

// Extraire les éléments uniques
const uniqueIngredients = getUniqueItems(recipes, "ingredients");
const uniqueUstensils = getUniqueItems(recipes, "ustensils");
const uniqueAppliances = getUniqueItems(recipes, "appliance");

/**
 * Retourne un tableau d'éléments uniques extraits de la clé `key` des recettes.
 * Si `key` vaut "ingredients", les éléments sont extraits de la propriété `ingredients`
 * de chaque recette, via la propriété `ingredient` des objets contenus dans le tableau.
 * Si `key` vaut "ustensils", les éléments sont extraits de la propriété `ustensils` de chaque recette.
 * Sinon, les éléments sont extraits de la propriété `key` de chaque recette.
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
      recipe.ustensils.forEach((ustensil) => itemsSet.add(ustensil));
    } else {
      itemsSet.add(recipe[key]);
    }
  });

  return Array.from(itemsSet).sort();
}

/**
 * Affiche les éléments dans une liste HTML <ul> d'id `listId`
 * et gère les interactions de clic sur chaque élément.
 * Lorsqu'un élément est cliqué, il est ajouté à la liste des tags
 * et la fonction `onClickCallback` est exécutée avec l'élément cliqué
 * comme argument.
 * @param {string[]} items - Tableau d'éléments à afficher
 * @param {string} listId - Identifiant de la liste HTML <ul>
 * @param {Function} onClickCallback - Fonction exécutée lors d'un clic sur un élément
 */
export function displayItems(items, listId, onClickCallback) {
  const list = document.getElementById(listId);
  list.innerHTML = ""; // Réinitialiser la liste

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
 * Ajoute une fonctionnalité de recherche à un input HTML et met à jour
 * la liste d'éléments associée en conséquence.
 * Lorsqu'un élément est sélectionné, il est ajouté à la liste des tags
 * et la fonction `onClickCallback` est exécutée avec l'élément cliqué
 * comme argument.
 * @param {string} inputId - Identifiant de l'élément HTML input
 * @param {string} listId - Identifiant de la liste HTML <ul>
 * @param {string[]} items - Tableau d'éléments à afficher
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

  displayItems(items, listId, (selectedItem) => {
    addTag(selectedItem, listId.replace("List", ""), (removedItem) => {
      console.log(`Tag supprimé : ${removedItem}`);
    });
  });
}
addSearchFunctionality("ingredientSearch", "ingredientList", uniqueIngredients);
addSearchFunctionality("applianceSearch", "applianceList", uniqueAppliances);
addSearchFunctionality("ustensilSearch", "ustensilList", uniqueUstensils);

/**
 * Initializes and sets up filters for ingredients, appliances, and utensils.
 * Retrieves unique items from the recipes data and displays them in their
 * respective HTML lists. Adds click event listeners to each item for tagging
 * functionality, and search input functionality to filter the displayed list
 * based on user input.
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
 * Updates the dropdown lists for ingredients, appliances, and utensils
 * based on the provided filtered recipes. Extracts unique options for each
 * category from the filtered recipes and displays them in their respective
 * dropdown lists. Adds click event listeners to each item for tagging
 * functionality.
 *
 * @param {Object[]} filteredRecipes - Array of filtered recipe objects
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
