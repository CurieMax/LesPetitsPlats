import { displayRecipes } from "./index.js";
import { addTag } from "./tag.js";

// Données des recettes (à adapter selon vos données)
const recipes = JSON.parse(localStorage.getItem("recipesData"));

// Récupérer une liste unique d'éléments d'une clé donnée
export function getUniqueItems(recipes, key) {
  const itemsSet = new Set();

  recipes.forEach((recipe) => {
    if (key === "ingredients") {
      recipe.ingredients?.forEach((ingredientObj) => itemsSet.add(ingredientObj.ingredient));
    } else if (key === "ustensils") {
      recipe.ustensils.forEach((ustensil) => itemsSet.add(ustensil));
    } else {
      itemsSet.add(recipe[key]);
    }
  });

  return Array.from(itemsSet).sort();
}

// Fonction pour afficher les éléments dans la liste
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

// Fonction de recherche et affichage des éléments filtrés
function addSearchFunctionality(inputId, listId, items) {
  const inputElement = document.getElementById(inputId);

  inputElement.addEventListener("input", (event) => {
    const searchValue = event.target.value.toLowerCase();
    const filteredItems = items.filter((item) => item.toLowerCase().includes(searchValue));
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

// Fonction de configuration des filtres
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

  addSearchFunctionality("ingredientSearch", "ingredientList", uniqueIngredients);
  addSearchFunctionality("applianceSearch", "applianceList", uniqueAppliances);
  addSearchFunctionality("ustensilSearch", "ustensilList", uniqueUstensils);
}

// Met à jour les listes déroulantes après filtrage
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

// Fonction de bascule de visibilité des listes déroulantes
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
    dropdownElement.style.display = dropdownElement.style.display === "block" ? "none" : "block";
  });

  // Fermer la liste si on clique en dehors
  document.addEventListener("click", (event) => {
    if (!triggerElement.contains(event.target) && !dropdownElement.contains(event.target)) {
      dropdownElement.style.display = "none";
    }
  });
}

// Filtrer les recettes par éléments sélectionnés
export function filterRecipesByItems(selectedTags) {
  const recipes = JSON.parse(localStorage.getItem("recipesData")) || [];
  const tagsByCategory = selectedTags.reduce((acc, { item, category }) => {
    acc[category].push(item);
    return acc;
  }, { ingredients: [], appliances: [], ustensils: [] });

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