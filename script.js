
console.log('hi')
let foodApi = 'https://food-by-mood.herokuapp.com/api/foods'
// let movieApi = 

async function fetchData(api){

    result = await fetch(api).then(result => result.json())
    return result
}

async function test(){
    foodObj = await fetchData(foodApi)
    // movieObj = fetchData(movieApi)
    console.log(foodObj)
    contentEl = document.querySelector('#content')
    contentEl.innerHTML = foodObj[0].title
}

test()