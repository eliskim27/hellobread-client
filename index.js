// make sure we get the routes right

const recipesDiv = document.getElementById('recipes')

fetch('http://localhost:3000/recipes')
    .then(function(response) { return response.json() })
    .then(function(recipes) {
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div')
            recipeCard.setAttribute('class', 'card')
            recipeCard.innerHTML = `
                <img class='photo' src=${recipe.image}>
                <h4>${recipe.title}
            `
            recipeCard.addEventListener('click', function(e) {
                console.log(e.target)
            })
            recipesDiv.appendChild(recipeCard)
        });
    })
