import {recipeTemplate} from "../templates/recipeTemplates.js";

async function getRecipes() {
    const url =  '../scripts/recipes.json';
    const response = await fetch(url);
    const data = await response.json();
    return data.recipes;
}

async function displayRecipes(recipes) {
    const recipeSection = document.querySelector(".recipe-section");

    recipes.forEach((recipe) => {
       const recipeCard = recipeTemplate(recipe);
       recipeSection.appendChild(recipeCard);
    });
}

async function init() {
    const recipes = await getRecipes();

    displayRecipes(recipes);
}

init();