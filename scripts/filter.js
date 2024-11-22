import { displayRecipes } from "./index.js";

/**
 * Récupère une liste unique d'éléments d'une clé donnée
 * @param {Object[]} recipes - Tableau d'objets recettes
 * @param {string} key - Clé à extraire ("ingredients", "appliance" ou "utensils")
 * @returns {string[]} Liste triée des éléments uniques
 */
export function getUniqueItems(recipes, key) {
  const itemsSet = new Set();

  recipes.forEach((recipe) => {
    // Vérifie si la clé est "ingredients"
    if (key === "ingredients") {
      recipe.ingredients?.forEach((ingredientObj) => {
        itemsSet.add(ingredientObj.ingredient);
      });
    } else if (key === "ustensils" && recipe.ustensils) { // Utilise "ustensils" ici
      recipe.ustensils.forEach((ustensil) => {
        itemsSet.add(ustensil);
      });
    } else {
      itemsSet.add(recipe[key]);
    }
  });

  return Array.from(itemsSet).sort();
}

/**
 * Affiche les éléments dans la liste déroulante
 * @param {string[]} items - Liste d'éléments uniques
 * @param {string} listId - ID de la liste HTML (ex : "ingredientList")
 * @param {Function} onClickCallback - Fonction à exécuter lors d'un clic sur un élément
 */
export function displayItems(items, listId, onClickCallback) {
  const list = document.getElementById(listId);

  // Réinitialise la liste avant de l'afficher
  list.innerHTML = "";

  // Ajoute les éléments filtrés
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", () => onClickCallback(item));
    list.appendChild(li);
  });
}

/**
 * Ajoute un tag sélectionné avec une croix
 * @param {string} item - Élément sélectionné
 * @param {string} tagContainerId - ID du conteneur des tags
 * @param {Function} onCloseCallback - Fonction exécutée lors de la suppression du tag
 */
export function addTag(item, tagContainerId, onCloseCallback) {
  const tagContainer = document.getElementById(tagContainerId);

  const tag = document.createElement("div");
  tag.classList.add("tag");
  tag.textContent = item;

  const closeBtn = document.createElement("i");
  closeBtn.classList.add("fa-solid", "fa-circle-xmark", "close-btn");
  closeBtn.addEventListener("click", () => {
    tagContainer.removeChild(tag);
    onCloseCallback(item);
  });

  tag.appendChild(closeBtn);
  tagContainer.appendChild(tag);
}

/**
 * Supprime un tag et filtre les recettes en conséquence
 * @param {string} item - Élément à supprimer
 * @param {string} tagContainerId - ID du conteneur des tags
 * @param {Function} onUpdateCallback - Fonction exécutée après la mise à jour des tags
 */
export function removeTag(item, tagContainerId, onUpdateCallback) {
  const tagContainer = document.getElementById(tagContainerId);

  // Supprimer le tag du DOM
  const tags = tagContainer.querySelectorAll(".tag");
  tags.forEach((tag) => {
    if (tag.textContent.replace("×", "") === item) {
      tagContainer.removeChild(tag);
    }
  });

  // Mettre à jour les tags restants
  const remainingTags = Array.from(tagContainer.children).map((tag) =>
    tag.textContent.replace("×", "")
  );
  onUpdateCallback(remainingTags);
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
  const filteredItems = [...new Set(items.filter(item =>
    item.toLowerCase().includes(searchInput.toLowerCase())
  ))];

  // Affiche les éléments filtrés dans la liste HTML
  displayItems(filteredItems, listId, (item) => {
    console.log(`Item sélectionné : ${item}`);
  });
}

document.getElementById("ingredientSearch").addEventListener("input", (event) => {
  const searchInput = event.target.value;
  const ingredients = JSON.parse(localStorage.getItem("recipesData"))?.map(recipe => 
    recipe.ingredients?.map(ing => ing.ingredient)
  ).flat() || []; // Utilisation de flat() pour flatter le tableau

  handleDropdownSearch(searchInput, ingredients, "ingredientList");
});

document.getElementById("applianceSearch").addEventListener("input", (event) => {
  const searchInput = event.target.value;
  const appliances = JSON.parse(localStorage.getItem("recipesData"))?.map(recipe => recipe.appliance) || [];
  handleDropdownSearch(searchInput, appliances, "applianceList");
});

document.getElementById("ustensilSearch").addEventListener("input", (event) => {
  const searchInput = event.target.value;
  const ustensils = JSON.parse(localStorage.getItem("recipesData"))?.map(recipe => recipe.ustensils).flat() || [];
  handleDropdownSearch(searchInput, ustensils, "ustensilList");
});


/**
 * Filtre les recettes en fonction d'une liste d'éléments sélectionnés
 * @param {string[]} selectedItems - Liste des éléments sélectionnés
 * @param {string} key - Clé à filtrer ("ingredients", "appliance" ou "utensils")
 */
export function filterRecipesByItems(selectedItems, key) {
  const recipes = JSON.parse(localStorage.getItem("recipesData")) || [];
  const filteredRecipes = recipes.filter((recipe) => {
    if (key === "ingredients") {
      return selectedItems.every((item) =>
        recipe.ingredients.some((ing) => ing.ingredient === item)
      );
    } else if (key === "ustensils") {
      return selectedItems.every((item) =>
        recipe.ustensils.includes(item)
      );
    } else {
      return selectedItems.every((item) => recipe[key] === item);
    }
  });

  // Afficher les recettes filtrées
  displayRecipes(filteredRecipes);
}