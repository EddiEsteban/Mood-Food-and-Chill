const genreNames = ['Action', 'Adventure', 'Animation', 'Comedy', 
    'Documentary', 'Drama', 'Family', 'Fantasy',
    'History', 'Horror', 'Music', 'Mystery',
    'Romance', 'Science Fiction', 'TV Movie', 'Thriller',
    'War', 'Western']



const relaxedGenres = ['Documentary', 'Family', 'Romance']
const relaxedExcludedGenres = ['Action',]
const neutralGenres = ['Adventure', 'Comedy', 'Drama', 'History', 'Mystery']
const energeticGenres = ['Action', 'Music', 'Thriller', 'War', 'Western']
const otherGenres = ['Animation', 'Fantasy', 'TV Movie', 'Science Fiction']

const genreLookup = [{id: 28, name: "Action"},{id: 12,name: "Adventure"},{id: 16,name: "Animation"},{id: 35,name: "Comedy"},
    {id: 80,name: "Crime"},{id: 99,name: "Documentary"},{id: 18,name: "Drama"},{id: 10751,name: "Family"},
    {id: 14,name: "Fantasy"},{id: 36,name: "History"},{id: 27,name: "Horror"},{id: 10402,name: "Music"},
    {id: 9648,name: "Mystery"},{id: 10749,name: "Romance"},{id: 878,name: "Science Fiction"},{id: 10770,name: "TV Movie"},
    {id: 53,name: "Thriller"},{id: 10752,name: "War"},{id: 37,name: "Western"}]


let foodApi = 'https://food-by-mood.herokuapp.com/api/foods'
let movieApi = 'https://api.themoviedb.org/3/genre/movie/list?api_key=dbd68826ec7649f3671ac738ca17fe12&language=en-US' //check documentation
let moods = [
    "relaxed",
    "neutral",
    "energetic"
]



// GIVEN a user-inputted mood
    // fetch an array of movies filtered by genres that match the mood
    // fetch an array of foods filtered by genres that match the mood

const movieReturnCount = 5

async function returnMovies (mood){
    // Doug's conversion from mood to IDs

    let dummyEnergeticGenreIds = '28|16|27|53|37'

    function moviesByGenreApi(genreIds, removedGenreIds) {
        return `https://api.themoviedb.org/3/discover/movie`
            + `?api_key=dbd68826ec7649f3671ac738ca17fe12&language=en-US`
            + `&sort_by=popularity.desc`
            + `&include_adult=false`
            + `&include_video=true`
            + `&page=1`
            + `&with_genres=${genreIds}`
            + `&without_genres=${removedGenreIds}` // "|" for OR, "," for AND
    }
    let api
    switch(mood){
        case 'relaxed': 
            api = moviesByGenreApi('', dummyEnergeticGenreIds)
            break
        case 'neutral':
            api = moviesByGenreApi('', '')
            break
        case 'energetic':
            api = moviesByGenreApi(dummyEnergeticGenreIds, '')
            break
    }
    return await fetch(api)
    .then(response => response.ok ? response.json() : Promise.reject('first then failed'))
        .then(function(movies){
            localStorage.movies = JSON.stringify(movies) 
        }).catch(error => console.warn(error))
 
}

async function returnMoviesAndFood(mood){
    event.preventDefault()
    await returnMovies(mood)
    console.log(JSON.parse(localStorage.movies))
    let movies = JSON.parse(localStorage.movies).results
    document.querySelector('#outputDiv').innerHTML = ''
    for (let i = 0; i < movies.length ; i ++){
        console.log(movies[i].original_title)
        document.querySelector('#outputDiv').innerHTML += `<div>${movies[i].original_title}</div>`
    }
}

// async function returnFoods (mood){
//     function foodsByMood2sApi(mood2){}
//     return
// }



// FoodData();



/*
Notes for us to do
array of genreNames
match up genrenames to the 3 moods
use genreNames to get the ids and then fetch based on genre
*/
