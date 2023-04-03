
const searchInput = document.querySelector('.search')
console.log(searchInput.value)

const apiKey = 'http://api.weatherapi.com/v1/forecast.json?key=511350788bca43a4b07120356232903&q=japan&days=3&aqi=no&alerts=no'

async function getWeather() {

    const responce = await fetch(apiKey, { mode: 'cors' })


    const data = await responce.json()
    console.log(data)
}

const weatherObj = getWeather()

console.log(weatherObj)