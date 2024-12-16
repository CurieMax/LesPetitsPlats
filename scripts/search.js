import { searchRecipes, searchRecipesByTags } from "./algo.js";
import { updateDropdownLists } from "./filter.js";
import { displayRecipes } from "./index.js";

/**
 * Effectue une recherche combinée dans les recettes avec un mot-clé et des tags.
 * La recherche par mot-clé est faite dans les noms, descriptions, ingrédients, appareils, ustensiles
 * et elle est combinée avec un filtrage par les tags sélectionnés.
 * La fonction prend en paramètres le mot-clé, les tags sélectionnés, les recettes à filtrer, une fonction
 * de mise à jour pour afficher les résultats et une fonction de mise à jour pour les listes déroulantes.
 * @param {string} keyword - Mot-clé de recherche
 * @param {Object[]} selectedTags - Tableau d'objets tags sélectionnés
 * @param {Object[]} recipes - Tableau d'objets recettes à filtrer
 * @param {function} displayCallback - Fonction de mise à jour pour afficher les résultats
 * @param {function} updateDropdownCallback - Fonction de mise à jour pour les listes déroulantes
 * @returns {Object[]} Tableau des recettes filtrées par la recherche combinée
 */
export function combinedSearch(keyword, recipes) {
  let inputKeyword = document.querySelector(".search-bar input").value;

  // Recherche par mot-clé dans les noms, descriptions, ingrédients, appareils, ustensiles
  const keywordFilteredRecipes =
    inputKeyword.length >= 3 ? searchRecipes(inputKeyword, recipes) : recipes;

  // récuperation des tags restants
  const remainingTags = [
    ...document.getElementById("tags").querySelectorAll(".tag"),
  ].map((tag) => ({
    item: tag.dataset.item,
    category: tag.dataset.category,
  }));

  // Regroupement des tags par catégories
  const tagsByCategory = remainingTags.reduce(
    (acc, { item, category }) => {
      if (!acc[category]) {
        acc[category] = []; // Initialiser le tableau pour la catégorie si nécessaire
      }
      acc[category].push(item);
      return acc;
    },
    { ingredients: [], appliances: [], ustensils: [] } // Initialisation des catégories
  );

  console.log("tagsByCategory", tagsByCategory);

  const combinedFilteredRecipes = searchRecipesByTags(
    tagsByCategory,
    keywordFilteredRecipes
  );
  console.log("combinedFilteredRecipes", combinedFilteredRecipes);
  displayRecipes(combinedFilteredRecipes);
  updateDropdownLists(combinedFilteredRecipes);

  return combinedFilteredRecipes;
}
