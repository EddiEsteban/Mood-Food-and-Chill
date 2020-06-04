
console.log('hi')
let foodApi = 'https://food-by-mood.herokuapp.com/api/foods'
let movieApi = 'https://api.themoviedb.org/3/genre/movie/list?api_key=dbd68826ec7649f3671ac738ca17fe12&language=en-US' //check documentation
let moods = [
    "Neutral",
    "Relaxed",
    "Energetic"
]


async function fetchData(api){

    result = await fetch(api).then(result => result.json())
    return result
}

async function FoodData(){
    foodObj = await fetchData(foodApi)
    // movieObj = fetchData(movieApi)
    console.log(foodObj)
    contentEl = document.querySelector('#content')
    contentEl.innerHTML = foodObj[0].title
}

async function MovieData(){
    movieObj = await fetchData(movieApi)
    console.log(movieObj)
    contentEl = document.querySelector('#content')
    let genreNames = movieObj.name;
    console.log(`genreNames: ${genreNames}`);
    contentEl.innerHTML = JSON.stringify(movieObj);
}

// FoodData();
MovieData();

/*
Notes for us to do
array of genreNames
match up genrenames to the 3 moods
use genreNames to get the ids and then fetch based on genre
*

