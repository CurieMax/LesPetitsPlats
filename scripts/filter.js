import { displayRecipes } from "./index.js";
import { addTag } from "./tag.js";

// Données des recettes (à adapter selon vos données)
const recipes = JSON.parse(localStorage.getItem("recipesData"));

// Initialiser les options uniques
const uniqueIngredients = getUniqueItems(recipes, "ingredients");
const uniqueAppliances = getUniqueItems(recipes, "appliance");
const uniqueUstensils = getUniqueItems(recipes, "utensils");

/**
 * Récupère une liste unique d'éléments d'une clé donnée
 * @param {Object[]} recipes - Tableau d'objets recettes
 * @param {string} key - Clé à extraire ("ingredients", "appliance", "ustensils")
 * @returns {string[]} Liste triée des éléments uniques
 */
export function getUniqueItems(recipes, key) {
  const itemsSet = new Set();

  recipes.forEach((recipe) => {
    if (key === "ingredients") {
      recipe.ingredients?.forEach((ingredientObj) => {
        itemsSet.add(ingredientObj.ingredient);
      });
    } else if (key === "ustensils") {
      recipe.ustensils.forEach((ustensil) => {
        itemsSet.add(ustensil);
      });
    } else {
      itemsSet.add(recipe[key]);
    }
  });

  return Array.from(itemsSet).sort();
}

export function displayItems(items, listId, onClickCallback) {
  const list = document.getElementById(listId);

  // Réinitialise la liste avant de l'afficher
  list.innerHTML = "";

  // Ajoute les éléments filtrés
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;

    // Ajoute un gestionnaire de clic à chaque élément
    li.addEventListener("click", () => {
      li.classList.toggle("choosed-tags"); // Indique visuellement que l'élément est sélectionné
      console.log(`Élément cliqué : ${item}`);
      onClickCallback(item); // Appelle le callback fourni
    });

    list.appendChild(li);
  });
}

// Afficher les options complètes au chargement
displayItems(uniqueIngredients, "ingredientList", (item) => {
  addTag(item, "ingredients", () => {
    console.log(`Tag supprimé : ${item}`);
  });
});
displayItems(uniqueAppliances, "applianceList", (item) =>
  console.log(`Appareil sélectionné : ${item}`)
);
displayItems(uniqueUstensils, "ustensilList", (item) =>
  console.log(`Ustensile sélectionné : ${item}`)
);

function addSearchFunctionality(inputId, listId, items) {
  const inputElement = document.getElementById(inputId);

  inputElement.addEventListener("input", (event) => {
    const searchValue = event.target.value.toLowerCase();

    // Filtre les éléments en fonction de la recherche
    const filteredItems = items.filter((item) =>
      item.toLowerCase().includes(searchValue)
    );

    // Met à jour la liste affichée
    displayItems(filteredItems, listId, (selectedItem) => {
      // Ajoute un tag au clic sur un élément filtré
      addTag(
        selectedItem,
        listId.replace("List", ""),
        (removedItem, category) => {
          console.log(
            `Tag supprimé : ${removedItem} de la catégorie ${category}`
          );
        }
      );
    });
  });

  // Affiche la liste complète au chargement
  displayItems(items, listId, (selectedItem) => {
    // Ajoute un tag au clic sur un élément
    addTag(
      selectedItem,
      listId.replace("List", ""),
      (removedItem, category) => {
        console.log(
          `Tag supprimé : ${removedItem} de la catégorie ${category}`
        );
      }
    );
  });
}

// Ajouter la recherche pour chaque champ
addSearchFunctionality("ingredientSearch", "ingredientList", uniqueIngredients);
addSearchFunctionality("applianceSearch", "applianceList", uniqueAppliances);
addSearchFunctionality("ustensilSearch", "ustensilList", uniqueUstensils);


/**
 * Met à jour les listes déroulantes avec les options restantes
 * @param {Object} remainingOptions - Options restantes après filtrage
 */
export function updateDropdownLists(filteredRecipes) {
  const remainingOptions = {
      ingredients: getUniqueItems(filteredRecipes, "ingredients"),
      appliances: getUniqueItems(filteredRecipes, "appliance"),
      ustensils: getUniqueItems(filteredRecipes, "ustensils"),
  };

  // Mise à jour des listes avec les options restantes
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

export function toggleDropdown(triggerElement, dropdownElement) {
  // Ajoute un événement de clic sur l'élément déclencheur
  triggerElement.addEventListener("click", (event) => {
    // Empêche la propagation du clic pour éviter de fermer la liste immédiatement
    event.stopPropagation();

    // Ferme toutes les autres listes déroulantes
    document.querySelectorAll(".dropdown-list").forEach((dropdown) => {
      if (dropdown !== dropdownElement) {
        dropdown.style.display = "none";
      }
    });

    // Basculer l'affichage de la liste associée
    if (dropdownElement.style.display === "block") {
      dropdownElement.style.display = "none";
    } else {
      dropdownElement.style.display = "block";
    }
  });

  // Ajoute un événement global pour fermer la liste déroulante lorsqu'on clique en dehors
  document.addEventListener("click", (event) => {
    if (
      !triggerElement.contains(event.target) && // Si le clic n'est pas sur le bouton
      !dropdownElement.contains(event.target) // Ni à l'intérieur de la liste
    ) {
      dropdownElement.style.display = "none";
    }
  });
}

/**
 * Recherche dans la liste déroulante des éléments (ingrédients, appareils, ustensiles)
 * @param {string} searchInput - Texte de recherche
 * @param {string[]} items - Liste d'éléments (ingrédients, appareils, ustensiles)
 * @param {string} listId - ID de la liste HTML à filtrer
 */
export function handleDropdownSearch(searchInput, items, listId) {
  // Supprime les doublons en utilisant un Set
  const filteredItems = [
    ...new Set(
      items.filter((item) =>
        item.toLowerCase().includes(searchInput.toLowerCase())
      )
    ),
  ];

  // Affiche les éléments filtrés dans la liste HTML
  displayItems(filteredItems, listId, (item) => {
    console.log(`Item sélectionné : ${item}`);
  });
}

/**
 * Filtre les recettes et renvoie les options restantes pour chaque catégorie
 * @param {Array<{item: string, category: string}>} selectedTags - Tags sélectionnés
 * @returns {{filteredRecipes: Object[], remainingOptions: {ingredients: string[], appliances: string[], ustensils: string[]}}}
 */
export function filterRecipesByItems(selectedTags) {
  const recipes = JSON.parse(localStorage.getItem("recipesData")) || [];

  // Regrouper les tags par catégorie
  const tagsByCategory = selectedTags.reduce(
    (acc, { item, category }) => {
      acc[category].push(item);
      return acc;
    },
    { ingredients: [], appliances: [], ustensils: [] }
  );

  // Filtrer les recettes
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

  // Extraire les options restantes des recettes filtrées
  const remainingOptions = {
    ingredients: getUniqueItems(filteredRecipes, "ingredients"),
    appliances: getUniqueItems(filteredRecipes, "appliance"),
    ustensils: getUniqueItems(filteredRecipes, "ustensils"),
  };

  // Afficher les recettes filtrées
  displayRecipes(filteredRecipes);

  return { filteredRecipes, remainingOptions };
}
