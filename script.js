console.log('saf')

const apiKey = 'goes here'

async function getWeather() {

    const responce = await fetch(apiKey, { mode: 'cors' })
     

    const data = await responce.json()
    console.log(data)
}

//getWeather()