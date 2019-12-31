const recipesDiv = document.getElementById('recipes')

const recipeDetails = document.getElementById('details')
const recipeIngredientsList = document.getElementById('recipe-ingredients')
const recipeStepsList = document.getElementById('recipe-steps')
const recipeCloseBtn = document.getElementById('recipe-close')

let recipeShow = false

fetchRecipes()


function fetchRecipes(){
    fetch('http://localhost:3000/api/v1/recipes')
        .then(function(response) { return response.json() })
        .then(function(recipes) {
            recipes.forEach(recipe => {
                const recipeCard = document.createElement('div')
                let recipeIngredientsArray = JSON.parse(recipe.ingredients)
                let recipeStepsArray = JSON.parse(recipe.steps)
                recipeCard.setAttribute('class', 'card')
                recipeCard.innerHTML = `
                    <img class='photo' src=${recipe.image}>
                    <h4>${recipe.title}</h4>
                `
                recipeCard.dataset.ingredients = recipeIngredientsArray
                recipeCard.dataset.steps = recipeStepsArray
                recipesDiv.appendChild(recipeCard)
            });
        })
}
    
document.addEventListener('click', function(e){
    if (e.target.className === "card"){
        let recCard = e.target
        toggleRecipeShow(recCard)
    } else if (e.target.parentNode.className === "card"){
        let recCard = e.target.parentNode
        toggleRecipeShow(recCard)
    }        
    
    
})

function toggleRecipeShow(recCard){
    if (recipeShow == false) {
        recipeDetails.style.display = 'block'
        createRecipeShow(recCard)
        recipeShow = !recipeShow
    } else if (recipeShow == true){
        deleteRecipeShow()
        createRecipeShow(recCard)
    }   
}


function createRecipeShow(recCard){
    let currentIngredients = recCard.dataset.ingredients.split(',')
    currentIngredients.forEach(ingredient => {
        let ingredientLi = document.createElement('li')
        ingredientLi.innerText = ingredient
        recipeIngredientsList.appendChild(ingredientLi)
    })
    let currentSteps = recCard.dataset.steps.split('.,')
    currentSteps.forEach(step => {
        const stepLi = document.createElement('li')
        stepLi.innerText = step
        recipeStepsList.appendChild(stepLi)
    })
}

function deleteRecipeShow(){
    while (recipeIngredientsList.firstChild){
        recipeIngredientsList.firstChild.remove()
    }
    while (recipeStepsList.firstChild){
        recipeStepsList.firstChild.remove()
    }
}
        
recipeCloseBtn.addEventListener('click', function(){
    deleteRecipeShow()
    recipeDetails.style.display = 'none'
})


 




 
    
