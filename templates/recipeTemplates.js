export function recipeTemplate(data) {
    const {image, name, servings, ingredients, time, description} = data;

    const picture = `assets/JSON-recipes/${image}`;

    function getRecipeCard() {
        const recipeCard = document.createElement('article');
        recipeCard.className = 'recipe-card';
        
        // Image de la recette
        const recipeImg = document.createElement('img');
        recipeImg.className = 'recipe-img';
        recipeImg.setAttribute('src', picture);
        recipeImg.setAttribute('alt', name);
        recipeCard.appendChild(recipeImg);

        // Titre de la recette
        const recipeTitle = document.createElement('h2');
        recipeTitle.textContent = name;
        recipeCard.appendChild(recipeTitle);

        // Informations sur la recette
        const recipeInfo = document.createElement('div');
        recipeInfo.className = 'recipe-info';

        const recipeName = document.createElement('h3');
        recipeName.textContent = 'Recette';

        recipeInfo.appendChild(recipeName);

        const recipeTime = document.createElement('p');
        recipeTime.textContent = `${time} min`;
        recipeTime.className = 'recipe-time';

        const recipeDescription = document.createElement('p');
        recipeDescription.textContent = description;


        // Liste des ingrédients
        const recipeIngredients = document.createElement('ul');
        recipeIngredients.className = 'recipe-ingredients';

        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.textContent = 'Ingrédients';
        recipeIngredients.appendChild(ingredientsTitle);

        const ingredientsContainer = document.createElement('div');
        ingredientsContainer.className = 'ingredients-container';

        // Ajout des ingrédients à la liste
        ingredients.forEach(ingredient => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${ingredient.ingredient}</strong> <br> ${ingredient.quantity || ''} ${ingredient.unit || ''}`;
            ingredientsContainer.appendChild(listItem);
        });

        recipeIngredients.appendChild(ingredientsContainer);

        // Ajout des éléments à la carte
        recipeInfo.appendChild(recipeTime);
        recipeInfo.appendChild(recipeDescription);
        recipeInfo.appendChild(recipeIngredients);
        recipeCard.appendChild(recipeInfo);

        return recipeCard;
    }
    return getRecipeCard();
}