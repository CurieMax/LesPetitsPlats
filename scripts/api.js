/**
 * Get the list of all recipes in the JSON file
 * @returns {Promise<Object[]>} a promise that resolves to an array of recipe objects
 */
export async function getRecipes() {
  const url = "../scripts/recipes.json";
  const response = await fetch(url);
  const data = await response.json();
  return data.recipes;
}
