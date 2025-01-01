/**
 * Generates a recipe card element based on provided data.
 * Extracts and uses recipe details such as image, name, servings, ingredients, time, and description
 * to create an HTML structure. Returns the constructed recipe card element for rendering in the DOM.
 *
 * @param {Object} data - An object containing recipe details.
 * @param {string} data.image - The image filename for the recipe.
 * @param {string} data.name - The name of the recipe.
 * @param {number} data.servings - The number of servings the recipe provides.
 * @param {Array} data.ingredients - An array of ingredient objects.
 * @param {number} [data.ingredients[].quantity] - The quantity of the ingredient.
 * @param {string} [data.ingredients[].unit] - The unit of measurement for the ingredient.
 * @param {number} data.time - The preparation time for the recipe in minutes.
 * @param {string} data.description - A brief description of the recipe.
 * @returns {HTMLElement} The constructed recipe card element.
 */

export function recipeTemplate(data) {
  const { image, name, ingredients, time, description } = data;

  const picture = `assets/JSON-recipes/${image}`;

  /**
   * Generates a recipe card element based on provided data.
   * Extracts and uses recipe details such as image, name, servings, ingredients, time, and description
   * to create an HTML structure. Returns the constructed recipe card element for rendering in the DOM.
   *
   * @returns {HTMLElement} The constructed recipe card element.
   */
  function getRecipeCard() {
    const recipeCard = document.createElement("article");
    recipeCard.className = "recipe-card";

    const recipeImg = document.createElement("img");
    recipeImg.className = "recipe-img";
    recipeImg.setAttribute("src", picture);
    recipeImg.setAttribute("alt", name);
    recipeCard.appendChild(recipeImg);

    const recipeTitle = document.createElement("h2");
    recipeTitle.textContent = name;
    recipeCard.appendChild(recipeTitle);

    const recipeInfo = document.createElement("div");
    recipeInfo.className = "recipe-info";

    const recipeName = document.createElement("h3");
    recipeName.textContent = "Recette";
    recipeInfo.appendChild(recipeName);

    const recipeTime = document.createElement("p");
    recipeTime.textContent = `${time} min`;
    recipeTime.className = "recipe-time";

    const recipeDescription = document.createElement("p");
    recipeDescription.textContent = description;
    recipeDescription.className = "recipe-description";

    const recipeIngredients = document.createElement("ul");
    recipeIngredients.className = "recipe-ingredients";

    const ingredientsTitle = document.createElement("h3");
    ingredientsTitle.textContent = "Ingrédients";
    recipeIngredients.appendChild(ingredientsTitle);

    const ingredientsContainer = document.createElement("div");
    ingredientsContainer.className = "ingredients-container";

    ingredients.forEach((ingredient) => {
      const listItem = document.createElement("li");

      const ingredientName = document.createElement("strong");
      ingredientName.textContent = ingredient.ingredient;
      listItem.appendChild(ingredientName);

      if (ingredient.quantity || ingredient.unit) {
        const quantityText = document.createElement("span");
        quantityText.textContent = ` ${ingredient.quantity || ""} ${ingredient.unit || ""}`;
        listItem.appendChild(document.createElement("br"));
        listItem.appendChild(quantityText);
      }

      ingredientsContainer.appendChild(listItem);
    });

    recipeIngredients.appendChild(ingredientsContainer);

    recipeInfo.appendChild(recipeTime);
    recipeInfo.appendChild(recipeDescription);
    recipeInfo.appendChild(recipeIngredients);
    recipeCard.appendChild(recipeInfo);

    return recipeCard;
  }
  return getRecipeCard();
}