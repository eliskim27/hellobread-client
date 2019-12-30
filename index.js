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
                <h4>${recipe.title}</h4>
            `
            recipeCard.addEventListener('click', function(e) {
                console.log("ingredients", recipe.ingredients)
                console.log("steps", recipe.steps)

                /*need to make transparent/hide all content, except
                current recipe's title, ingredients and steps*/

                document.body.setAttribute('class', 'fade')

                const recipeDetails = document.createElement('div')
                const recipeIngredients = document.createElement('ul')
                const recipeSteps = document.createElement('ol')

                recipe.ingredients.forEach(ingredient => {
                    const ingredientLi = document.createElement('li')
                    ingredientLi.innerText = ingredient
                    recipeIngredients.appendChild(ingredientLi)
                });

                recipe.steps.forEach(step => {
                    const stepLi = document.createElement('li')
                    stepLi.innerText = step
                    recipeIngredients.appendChild(stepLi)
                });

                recipeDetails.appendChild(recipeIngredients)
                recipeDetails.appendChild(recipeSteps)
                recipeDetails.innerHTML = `
                    <h4>${recipe.title}</h4>
                    <div>${recipeIngredients}</div>
                    <div>${recipeSteps}</div>
                `
                recipesDiv.prepend(recipeDetails)
            })
            recipesDiv.appendChild(recipeCard)
        });
    })
