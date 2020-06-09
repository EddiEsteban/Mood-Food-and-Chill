// Define Genre and categorized with three different moods
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
function pickMovies(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
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


// Bring Movie and Food Result Function
async function returnMoviesAndFood(mood){
    event.preventDefault()
    await returnMovies(mood)
    let moviePages = JSON.parse(localStorage.movies)
    let movies = []

    document.querySelector('#movieResultF').innerHTML = ''
    for (let i = 0; i < moviePages.length ; i ++){
        let moviePage = moviePages[i]
        for (let j = 0; j < moviePage.results.length ; j ++){
            
            let movie = moviePage.results[j]
            movies.push(movie)
        }
    }
    pickMovies(movies)
    let moviepicks = movies.slice(0, movieReturnCount);    // randomly pick movies from the list
    for (let j = 0; j < moviepicks.length; j ++){
        let movie = moviepicks[j]
        document.querySelector('#movieResultF').innerHTML += 
        // alternative html contents with results
            `
            <div class="resultBox col-md-6">
            <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                <div class="resultBoxContent col">
                  <h3 class="mb-0">${movie.original_title}</h3>
                  <strong class="d-inline-block mb-2 textInfo">Genres: ${returnGenresById(movie.genre_ids, ', ')}</strong>
                  <div class="mb-1 textMutedChange">Release Year: ${movie.release_date.substr(0, 4)}</div>
                  <p class="mb-auto">${movie.overview}</p>
                  <a href="https://www.rottentomatoes.com/search?search= + ${movie.original_title}" class="stretched-link">Search at Rotten Tomatoes</a>
                </div>
            </div>
            </div>
            `
    }
    document.querySelector('#foodResultF').innerHTML = ''
    await returnFoods(mood)
    let foods = JSON.parse(localStorage.foods)
    
    let randomFood = pickFood(foods)
    for (let i = 0; i < randomFood.length; i++){
        let food = randomFood[i]
        
        document.querySelector('#foodResultF').innerHTML += 
        // alternative html contents with results
        `
        <div class="resultBox col">
              <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                  <div class="resultBoxContent col">
                    <h3 class="mb-0">${food.title}</h3>
                    <p class="d-inline-block mb-2 textInfo"><strong>Ingredients:</strong> ${food.ingredients}</p>
                    <div class="mb-1 textMutedChange"><strong>Prep Time:</strong> ${food.prepTime} min, <strong>Cook Time: </strong>${food.cookTime} min<</div>
                    <p class="mb-auto"><strong>Instructions:</strong> ${food.instructions}</p>
                    <a href="https://yandex.com/images/search?from=tabbar&text= + ${food.title}" class="stretched-link">Search more Image</a>
                  </div>
                </div>
          </div>
        `
        }
}

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
                
                foodsByMood2Array = foods.filter(foodsByMood2Filter)
                localStorage.foods = JSON.stringify(foodsByMood2Array) 
            }).catch(error => console.warn(error))
    }
    await fetchFoods(foodApi)
}
//ABOUT US toggle btn
function toggleAboutUs() {
    var x = document.getElementById("aboutUsPar");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
//CONTACT US toggle btn
  function toggleContactUs() {
    var x = document.getElementById("contactUsForm");
    if (x.style.display === "none") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
