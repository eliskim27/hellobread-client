const recipesDiv = document.getElementById('recipes')
const recipeDetails = document.getElementById('details')
const recipeIngredientsList = document.getElementById('recipe-ingredients')
const recipeStepsList = document.getElementById('recipe-steps')
const recipeCloseBtn = document.getElementById('recipe-close')
const sideFavoritesUL = document.getElementById('favorites')
const favdetails = document.getElementById('favdetails')
const favIngredientsList = document.getElementById('favorite-ingredients')
const favStepsList = document.getElementById('favorite-steps')
const favCloseBtn = document.getElementById('favorite-close')
const deleteFavBtn = document.getElementById('favorite-delete')

let favShow = false

let recipeShow = false

fetchRecipes()
fetchAndRenderFavs()

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
                    <h3>${recipe.title}</h3>
                    <button id="heart">❤️ <span id="span">${recipe.likes}</span></button>
                    <button id="star">⭐️</button>
                `
                recipeCard.dataset.ingredients = recipeIngredientsArray
                recipeCard.dataset.steps = recipeStepsArray
                recipeCard.dataset.id = recipe.id
                recipeCard.dataset.likes = recipe.likes
                recipeCard.dataset.title = recipe.title
                recipesDiv.appendChild(recipeCard)
            });
        })
}
    
document.addEventListener('click', function(e){
    if (e.target.className === "card" && e.target.id !== 'heart' && e.target.id !== 'star'){
        let recCard = e.target
        toggleRecipeShow(recCard)
    } else if (e.target.parentNode.className === "card" && e.target.id !== 'heart' && e.target.id !== 'star'){
        let recCard = e.target.parentNode
        toggleRecipeShow(recCard)
    }        
    
    if (e.target.id === 'heart') {
        let recCard = e.target.parentNode
        let likesSpan = e.target.lastChild
        likesSpan.innerText = parseInt(likesSpan.innerText) + 1
        likeRecipe(recCard, likesSpan)
    }

    if (e.target.id === 'star'){
        let recCard = e.target.parentNode
        createFavorite(recCard)
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
    let title = document.getElementById('recshowtitle')
    title.innerText = recCard.dataset.title
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
        const stepBr = document.createElement('br')
        recipeStepsList.appendChild(stepBr)
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
    recipeShow = !recipeShow
})

function likeRecipe(recCard, likesSpan) {
    fetch(`http://localhost:3000/api/v1/recipes/${recCard.dataset.id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({likes: parseInt(likesSpan.innerText)})
    })
}

// favoriting something

function createFavorite(recCard){
    let favsarray
    fetch('http://localhost:3000/api/v1/favorites')
    .then(function(response) { return response.json() })
    .then(function(favorites) {
        favsarray = favorites.filter(favorite => {
            return favorite.title === recCard.dataset.title
        });
        if (favsarray[0]){}
        else {
            createFavDB(recCard)
        }
    })
}
    

function createFavDB(recCard){
    fetch(`http://localhost:3000/api/v1/favorites/`,
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            recipe_id: `${recCard.dataset.id}`,
            user_id: 1,         //would need to change for mult users
            notes: [],
            title: `${recCard.dataset.title}`
        })
    })
    .then(function(response) { return response.json() })
    .then(function(dbfav){
        createSideFav(dbfav)
    })
}

function createSideFav(favorite){
    let newLi = document.createElement('li')
    newLi.innerText = favorite.title
    newLi.dataset.favid = favorite.id
    sideFavoritesUL.append(newLi)
}

function fetchAndRenderFavs(){
    fetch('http://localhost:3000/api/v1/favorites')
    .then(function(response) { return response.json() })
    .then(function(favorites) {
        favorites.forEach(favorite => {
            createSideFav(favorite)
        });
    })
}

// favorite modal

sideFavoritesUL.addEventListener('click', function(e){
    if (e.target.tagName === "LI"){
        toggleFavShow(e)
    } 
})

function toggleFavShow(e){
    if (favShow == false) {
        favdetails.style.display = 'block'
        fetchFavRecipe(e)
        favShow = !favShow
    } else if (recipeShow == true){
        // deleteFavShow()
        fetchFavRecipe(e)
    }   
}

function fetchFavRecipe(e){
    fetch(`http://localhost:3000/api/v1/favorites/${e.target.dataset.favid}`)
    .then(function(response) { return response.json() })
    .then(function(favorite) {
        fetch(`http://localhost:3000/api/v1/recipes/${favorite.recipe_id}`)
        .then(function(response) { return response.json() })
        .then(function(recipe) {createFavShow(recipe, e)})
    })
}

function createFavShow(recipe, e){
    favdetails.dataset.favid = e.target.dataset.favid
    let title = document.getElementById('favshowtitle')
    title.innerText = recipe.title

    let currentIngredients = JSON.parse(recipe.ingredients)
    currentIngredients.forEach(ingredient => {
        let ingredientLi = document.createElement('li')
        ingredientLi.innerText = ingredient
        favIngredientsList.appendChild(ingredientLi)
    })

    let currentSteps = JSON.parse(recipe.steps)

    currentSteps.forEach(step => {
        const stepLi = document.createElement('li')
        stepLi.innerText = step
        favStepsList.appendChild(stepLi)
        const stepBr = document.createElement('br')
        favStepsList.appendChild(stepBr)
    })
    fetchComments(e)
}

favCloseBtn.addEventListener('click', function(){
    deleteFavShow()
    favdetails.style.display = 'none'
    favShow = !favShow
})

function deleteFavShow(){
    while (favIngredientsList.firstChild){
        favIngredientsList.firstChild.remove()
    }
    while (favStepsList.firstChild){
        favStepsList.firstChild.remove()
    }
    while (comlist.firstChild){
        comlist.firstChild.remove()
    }
}

deleteFavBtn.addEventListener('click', function(e) {
    fetch(`http://localhost:3000/api/v1/favorites/${e.target.parentNode.dataset.favid}`,
    {method: "DELETE"})
    
    deleteFavShow()
    favdetails.style.display = 'none'
    favShow = !favShow

    const allLis = document.querySelectorAll('li')
    const allLisArr = Array.from(allLis)
    let currentLi
    currentLi = allLisArr.filter(li => { return li.dataset.favid === e.target.parentNode.dataset.favid })
    currentLi[0].remove()
})

const comForm = document.getElementById('comform')
const comList = document.getElementById('comlist')
const forminput = document.getElementById('forminput')
let currentComments

comForm.addEventListener('submit', function(e){
    e.preventDefault()
    createComment(e)
})

function createComment(e){
    let newInput = forminput.value
    let newLi = document.createElement('li')
    newLi.innerText = newInput
    comList.appendChild(newLi)
    addComToFavDB(e, newLi)
    comForm.reset()
}

function addComToFavDB(e, newLi){
    console.log(e.target.parentNode.parentNode)
    fetch(`http://localhost:3000/api/v1/favorites/${e.target.parentNode.parentNode.dataset.favid}`,
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify({
            notes: newLi.innerText
        })
    })
}

function fetchComments(e) {
    fetch(`http://localhost:3000/api/v1/favorites/${e.target.dataset.favid}`)
    .then(function(response) { return response.json() })
    .then(function(favorite) {
        let currentNotes = JSON.parse(favorite.notes)
        currentNotes.forEach(note => {
            let newLi = document.createElement('li')
            newLi.innerText = note
            comList.appendChild(newLi)
        })
    })
}
