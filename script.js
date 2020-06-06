const genreNames = ['Action', 'Adventure', 'Animation', 'Comedy', 
    'Documentary', 'Drama', 'Family', 'Fantasy',
    'History', 'Horror', 'Music', 'Mystery',
    'Romance', 'Science Fiction', 'TV Movie', 'Thriller',
    'War', 'Western']



const energeticGenres = ['Action', 'Adventure', 'Crime', 'Drama', 'Horror', 'Mystery', 'Thriller', 'War', 'Western']

const genreLookup = [{id: 28, name: "Action"},{id: 12,name: "Adventure"},{id: 16,name: "Animation"},{id: 35,name: "Comedy"},
    {id: 80,name: "Crime"},{id: 99,name: "Documentary"},{id: 18,name: "Drama"},{id: 10751,name: "Family"},
    {id: 14,name: "Fantasy"},{id: 36,name: "History"},{id: 27,name: "Horror"},{id: 10402,name: "Music"},
    {id: 9648,name: "Mystery"},{id: 10749,name: "Romance"},{id: 878,name: "Science Fiction"},{id: 10770,name: "TV Movie"},
    {id: 53,name: "Thriller"},{id: 10752,name: "War"},{id: 37,name: "Western"}]

const neutralMoods = ["Healthy","Sad","Happy"];
const relaxedMoods = ["Comfortable","Drunk","Stoned"];
const energeticMoods = ["Exciting","Scary"];


let foodApi = 'https://food-by-mood.herokuapp.com/api/foods'

function returnEnergeticGenres(delimiter='|') { // "|" for OR, "," for AND
    let tempGenreIdList = [];
    for (let i = 0; i < genreLookup.length; i++) {
        if (energeticGenres.includes(genreLookup[i].name)) {
            tempGenreIdList += delimiter+genreLookup[i].id;
        } 
    }
    return tempGenreIdList.substring(1,tempGenreIdList.length);  // remove 1st delimiter
}

function returnGenresById(genres,delimiter='|') { // "|" for OR, "," for AND
    let tempGenreList = [];
    for (let i = 0; i < genreLookup.length; i++) {
        if (genres.includes(genreLookup[i].id)) {
            tempGenreList += delimiter+genreLookup[i].name;    
        }
    }
    return (tempGenreList=="") ? "N/A" : tempGenreList.substring(1, tempGenreList.length); 
}

// GIVEN a user-inputted mood
    // fetch an array of movies filtered by genres that match the mood
    // fetch an array of foods filtered by genres that match the mood

const pageLength = 10
const movieReturnCount = 5
const foodReturnCount = 1

// Randomly pick movieReturnCount # of movies from the list and return
function pickMovies (movieObjects) {
    var result = [];
    for (var i = 0; i < movieReturnCount; i++) {
        result.push(movieObjects[Math.floor(Math.random() * movieObjects.length)]);
    }
    return result;
}

// Randomly pick foodReturnCount # of foods from the list and return
function pickFood (foodObjects) {
    var result = [];
    for (var i = 0; i < foodReturnCount; i++) {
        result.push(foodObjects[Math.floor(Math.random() * foodObjects.length)]);
    }
    return result;
}

async function returnMovies (mood){

    function moviesByGenreApi(genreIds, disclude=false, page=1) {
        let mySwitch = disclude ? `&with_genres=${genreIds}` : `&without_genres=${genreIds}`
        return `https://api.themoviedb.org/3/discover/movie`
            + `?api_key=dbd68826ec7649f3671ac738ca17fe12&language=en-US`
            + `&sort_by=popularity.desc`
            + `&include_adult=false`
            + `&include_video=true`
            + `&page=${page}`
            + mySwitch 
    }

    async function fetchMovies(api) {
        return await fetch(api)
            .then(response => response.ok ? response.json() : Promise.reject('first then failed'))
            .then(function(movies){
                storageMovies = JSON.parse(localStorage.movies)
                storageMovies.push(movies)
                localStorage.movies = JSON.stringify(storageMovies) 
            }).catch(error => console.warn(error))
    }

    localStorage.movies = '[]'
    switch(mood){
        case 'relaxed': 
            for (i = 1; i <= pageLength; i ++){
                await fetchMovies(moviesByGenreApi(returnEnergeticGenres(), disclude = false, page=i))
            }
            break
        case 'neutral':
            for (i = 1; i <= pageLength; i ++){
                await fetchMovies(moviesByGenreApi('', disclude = false, page=i))
            }
            break
        case 'energetic':
            for (i = 1; i <= pageLength; i ++){
                await fetchMovies(moviesByGenreApi(returnEnergeticGenres(), disclude = true, page=i))
            }
    }    

}

async function returnMoviesAndFood(mood){
    event.preventDefault()
    await returnMovies(mood)
    let moviePages = JSON.parse(localStorage.movies)
<<<<<<< HEAD

    document.querySelector('#movies').innerHTML = ''
    for (let i = 0; i < moviePages.length ; i ++){
        let movies = moviePages[i].results
        for (let j = 0; j < movies.length; j ++){
            let movie = movies[j]
            document.querySelector('#movies').innerHTML += `<div><h4>${movie.original_title}</h4>`
                +`<h5>Genres: ${movie.genre_ids}</h5>`
                +`<p>${movie.overview}</p></div>`
        }
=======
    let movies = []
    // console.log(moviePages)

    document.querySelector('#movies').innerHTML = ''
    for (let i = 0; i < moviePages.length ; i ++){
        movies = moviePages[i].results
    }
    let moviepicks = pickMovies(movies);    // randomly pick movies from the list
    for (let j = 0; j < moviepicks.length; j ++){
        let movie = moviepicks[j]
        document.querySelector('#movies').innerHTML += `<div><h4>${movie.original_title}</h4>`
            +`<h5>Genres: ${returnGenresById(movie.genre_ids, ', ')}</h5>`
            +`<p>${movie.overview}</p></div>`
    }
    document.querySelector('#foods').innerHTML = ''
    await returnFoods(mood)
    let foods = JSON.parse(localStorage.foods)
    console.log(foods)
    let randomFood = pickFood(foods)
    for (let i = 0; i < randomFood.length; i++){
        let food = randomFood[i]
        console.log(food.photoUrl)
        document.querySelector('#foods').innerHTML += `<div
            class="card" style="width: 18rem;"><img 
            src="${food.photoUrl}" class="card-img-top"/><div
            class="card-body"><h5 
            class="card-title">${food.title}</h5><p 
            class="card-text"><strong>Ingredients:</strong> ${food.ingredients}</p><p 
            class="card-text"><strong>Instructions:</strong> ${food.instructions}</p><p 
            class="card-text"><strong>Prep Time:</strong> ${food.prepTime} min; <strong>Cook Time: </strong>${food.cookTime} min</p>
            </div></div><hr/>`
>>>>>>> doug
    }
}

<<<<<<< HEAD
    document.querySelector('#foods').innerHTML = ''
    await returnFoods(mood)
    let foods = JSON.parse(localStorage.foods)
    console.log(foods)
    for (let i = 0; i < foods.length; i++){
        let food = foods[i]
        console.log(food.photoUrl)
        document.querySelector('#foods').innerHTML += `<div
            class="card" style="width: 18rem;"><img 
            src="${food.photoUrl}" class="card-img-top"/><div
            class="card-body"><h5 
            class="card-title">${food.title}</h5><p 
            class="card-text"><strong>Ingredients:</strong> ${food.ingredients}</p><p 
            class="card-text"><strong>Instructions:</strong> ${food.instructions}</p><p 
            class="card-text"><strong>Prep Time:</strong> ${food.prepTime} min; <strong>Cook Time: </strong>${food.cookTime} min</p>
            </div></div><hr/>`
    }

    

}

async function returnFoods (ourMood){
    foodApi = `https://food-by-mood.herokuapp.com/api/foods`

    moodMap = ['Comfortable', 'Scary'] //replace with moodMap dependent on ourMood (Doug's task)

    function foodsByMood2Filter(food){
        return moodMap.includes(food.mood)
    }

    async function fetchFoods(api){
        return await fetch(api)
            .then(response => response.ok ? response.json() : Promise.reject('first then failed'))
            .then(function(foods){
                console.log(foods)  
                foodsByMood2Array = foods.filter(foodsByMood2Filter)
                localStorage.foods = JSON.stringify(foodsByMood2Array) 
            }).catch(error => console.warn(error))
    }

    await fetchFoods(foodApi)

}

=======
function getFoodApiMoods(mood){
    let apimoods = []
    switch(mood){
        case 'relaxed': 
            apimoods = relaxedMoods
            break
        case 'neutral':
            apimoods = neutralMoods
            break
        case 'energetic':
            apimoods = energeticMoods
    }
    return apimoods
}

async function returnFoods (ourMood){
    foodApi = `https://food-by-mood.herokuapp.com/api/foods`
    moodMap = getFoodApiMoods(ourMood)

    function foodsByMood2Filter(food){
        return moodMap.includes(food.mood)
    }

    async function fetchFoods(api){
        return await fetch(api)
            .then(response => response.ok ? response.json() : Promise.reject('first then failed'))
            .then(function(foods){
                console.log(foods)  
                foodsByMood2Array = foods.filter(foodsByMood2Filter)
                localStorage.foods = JSON.stringify(foodsByMood2Array) 
            }).catch(error => console.warn(error))
    }
    await fetchFoods(foodApi)
}
>>>>>>> doug



// FoodData();



/*
Notes for us to do
array of genreNames
match up genrenames to the 3 moods
use genreNames to get the ids and then fetch based on genre
*/