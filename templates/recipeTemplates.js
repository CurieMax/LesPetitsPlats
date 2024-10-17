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
        
        const recipeServings = document.createElement('p');
        recipeServings.textContent = `${servings} personnes`;

        const recipeTime = document.createElement('p');
        recipeTime.textContent = `${time} min`;
        recipeTime.className = 'recipe-time';

        const recipeDescription = document.createElement('p');
        recipeDescription.textContent = description;


        // Liste des ingrédients
        const recipeIngredients = document.createElement('ul');
        recipeIngredients.className = 'recipe-ingredients';
        ingredients.forEach(ingredient => {
            const listItem = document.createElement('li');
            listItem.textContent = `${ingredient.ingredient}: ${ingredient.quantity || ''} ${ingredient.unit || ''}`;
            recipeIngredients.appendChild(listItem);
        });

        // Ajout des éléments à la carte
        recipeInfo.appendChild(recipeServings);
        recipeInfo.appendChild(recipeTime);
        recipeInfo.appendChild(recipeDescription);
        recipeInfo.appendChild(recipeIngredients);
        recipeCard.appendChild(recipeInfo);

        return recipeCard;
    }
    return getRecipeCard();
}