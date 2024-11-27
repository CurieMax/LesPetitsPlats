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
    } else if (key === "ustensils" && recipe.ustensils) {
      // Utilise "ustensils" ici
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
    li.addEventListener("click", () => {
      li.classList.toggle("choosed-tags");
      onClickCallback(item)});
    list.appendChild(li);
  });
}


/**
 * Ajoute un tag à la liste des tags
 * @param {string} item - Élément à ajouter
 * @param {string} category - Catégorie du tag
 * @param {Function} onCloseCallback - Fonction à exécuter lors de la suppression d'un tag
 */
export function addTag(item, category, onCloseCallback) {
  const tagContainer = document.getElementById("tags");

  // Vérifie si le tag existe déjà
  const existingTag = Array.from(tagContainer.children).find(
    (tag) => tag.dataset.item === item && tag.dataset.category === category
  );
  if (existingTag) return;

  const tag = document.createElement("div");
  tag.classList.add("tag");
  tag.dataset.item = item;
  tag.dataset.category = category;
  tag.textContent = `${item}`;

  const closeBtn = document.createElement("i");
  closeBtn.classList.add("fa-solid", "fa-circle-xmark", "close-btn");
  closeBtn.addEventListener("click", () => {
    tagContainer.removeChild(tag);
    onCloseCallback(item, category);

    // Re-filtrer après suppression d'un tag
    const remainingTags = Array.from(tagContainer.children).map((tag) => ({
      item: tag.dataset.item,
      category: tag.dataset.category,
    }));

    const { remainingOptions } = filterRecipesByItems(remainingTags);
    updateDropdownLists(remainingOptions);
  });

  tag.appendChild(closeBtn);
  tagContainer.appendChild(tag);

  // Filtrer les recettes après ajout d'un tag
  const selectedTags = Array.from(tagContainer.children).map((tag) => ({
    item: tag.dataset.item,
    category: tag.dataset.category,
  }));

  const { remainingOptions } = filterRecipesByItems(selectedTags);
  updateDropdownLists(remainingOptions);
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
  }

  const remainingTags = Array.from(tagContainer.children).map((tag) => ({
    item: tag.dataset.item,
    category: tag.dataset.category,
  }));

  onUpdateCallback(remainingTags);
}

/**
 * Met à jour les listes déroulantes avec les options restantes
 * @param {Object} remainingOptions - Options restantes après filtrage
 */
function updateDropdownLists(remainingOptions) {
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
