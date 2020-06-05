const genreNames = ['Action', 'Adventure', 'Animation', 'Comedy',
    'Documentary', 'Drama', 'Family', 'Fantasy',
    'History', 'Horror', 'Music', 'Mystery',
    'Romance', 'Science Fiction', 'TV Movie', 'Thriller',
    'War', 'Western']



const energeticGenres = ['Action', 'Adventure', 'Crime', 'Drama', 'Horror', 'Mystery', 'Thriller', 'War', 'Western']

const genreLookup = [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 16, name: "Animation" }, { id: 35, name: "Comedy" },
{ id: 80, name: "Crime" }, { id: 99, name: "Documentary" }, { id: 18, name: "Drama" }, { id: 10751, name: "Family" },
{ id: 14, name: "Fantasy" }, { id: 36, name: "History" }, { id: 27, name: "Horror" }, { id: 10402, name: "Music" },
{ id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" }, { id: 878, name: "Science Fiction" }, { id: 10770, name: "TV Movie" },
{ id: 53, name: "Thriller" }, { id: 10752, name: "War" }, { id: 37, name: "Western" }]


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


// GIVEN a user-inputted mood
// fetch an array of movies filtered by genres that match the mood
// fetch an array of foods filtered by genres that match the mood

const pageLength = 10
const movieReturnCount = 5

// GIVEN a delimiter for the list
// return the list of ids for the energetic genre
function returnEnergeticGenres(delimiter) {
    let tempGenreList = [];
    let tempGenreIdList = [];
    for (let i = 0; i < genreLookup.length; i++) {
        if (energeticGenres.includes(genreLookup[i].name)) {
            tempGenreIdList += delimiter+genreLookup[i].id;
        } 
    }
    return tempGenreIdList = tempGenreIdList.substring(1,tempGenreIdList.length);  // remove 1st delimiter
}



async function returnMovies(mood) {
    // Doug's conversion from mood to IDs


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
    console.log(moviePages)
    document.querySelector('#outputDiv').innerHTML = ''
    for (let i = 0; i < moviePages.length ; i ++){
        let movies = moviePages[i].results
        console.log(movies)
        console.log(movies.length)
        for (let j = 0; j < movies.length; j ++){
            let movie = movies[j]
            document.querySelector('#outputDiv').innerHTML += `<div><h4>${movie.original_title}</h4>`
                +`<h5>Genres: ${movie.genre_ids}</h5>`
                +`<p>${movie.overview}</p></div>`
        }
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


let genreIDs = returnEnergeticGenres('|');
console.log(`genreIDs: ${genreIDs}`);