
let weatherLocation = 'london'
let weatherObj = {}
const metricButton = document.querySelector('.celsius')
const imperialButton = document.querySelector('.farenheit')
let apiKey = `http://api.weatherapi.com/v1/forecast.json?key=511350788bca43a4b07120356232903&q=${weatherLocation}&days=3&aqi=no&alerts=no`
async function setApi() {

    const responce = await fetch(apiKey, { mode: 'cors' })
    const data = await responce.json()
    return data

}


async function asignWeatherData() {
    weatherObj = await setApi()
    console.log(weatherObj)
    fillContentMetric()
    if (imperialButton.classList.contains('active')) {
        fillContentImperial()
    }

}
asignWeatherData()

function setUnits() {


    metricButton.addEventListener('click', () => {
        imperialButton.classList.remove('active')
        if (!metricButton.classList.contains('active')) {
            metricButton.classList.add('active')
            fillContentMetric()
        }
    })

    imperialButton.addEventListener('click', () => {
        metricButton.classList.remove('active')
        if (!imperialButton.classList.contains('active')) {
            imperialButton.classList.add('active')
            fillContentImperial()
        }

    })
}
setUnits()

const inputForm = document.querySelector('.search-form')
const searchInput = document.querySelector('.search')
inputForm.addEventListener('submit', () => {
    weatherLocation = searchInput.value
    apiKey = `http://api.weatherapi.com/v1/forecast.json?key=511350788bca43a4b07120356232903&q=${weatherLocation}&days=3&aqi=no&alerts=no`
    asignWeatherData()
    searchInput.value = ''
})

function fillContentMetric() {
    //-----------------------change location text--------------------------
    const locationElement = document.querySelector('.location')
    locationElement.textContent = `${weatherObj.location.name}, ${weatherObj.location.country}`
    //-----------------------change location text--------------------------

    //----------------------get local time---------------------------------
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]
    const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    function padWithLeadingZeros(num, totalLength) {
        return String(num).padStart(totalLength, '0');
    }
    const dateTimeZone = new Date().toLocaleString('en-US', { timeZone: `${weatherObj.location.tz_id}` })
    const localDate = new Date(dateTimeZone)
    let dayOfWeek = weekday[localDate.getDay()];
    let month = monthArr[localDate.getMonth()]
    let date = localDate.getDate()
    let year = localDate.getFullYear()
    let timeHours = localDate.getHours()
    let timeMinutes = localDate.getMinutes()

    const currentTime = document.querySelector('.current-time')
    currentTime.textContent = `${dayOfWeek} ${date} ${month} ${year} | ${padWithLeadingZeros(timeHours, 2)}:${padWithLeadingZeros(timeMinutes, 2)}`
    //----------------------get local time---------------------------------

    //---------------------change current weather-------------------------

    const currentWeatherIcon = document.querySelector('.weather-temp-img')
    currentWeatherIcon.src = `${weatherObj.current.condition.icon}`

    const currentWeatherText = document.querySelector('.weather-temp-text')
    currentWeatherText.textContent = `${weatherObj.current.temp_c}°C`

    const currentWeatherDescription = document.getElementById('weather-text')
    currentWeatherDescription.textContent = `${weatherObj.current.condition.text}`

    const feelsLike = document.querySelector('.feels-like')
    feelsLike.textContent = `Feels like ${weatherObj.current.feelslike_c}°C`
    //---------------------change current weather-------------------------

    //--------------------change current weather extra info------------------
    const currentWindText = document.querySelector('.wind-text')
    let windSpeedMeters = Math.round((weatherObj.current.wind_kph / 3.6 + Number.EPSILON) * 10) / 10
    currentWindText.textContent = `${windSpeedMeters}m/s`

    const currentWindArrow = document.querySelector('.wind-arrow')
    currentWindArrow.style.rotate = `${weatherObj.current.wind_degree - 180}deg`

    const currentPressure = document.querySelector('.pressure-text')
    currentPressure.textContent = `${weatherObj.current.pressure_mb}`

    const currentVisibility = document.querySelector('.visibility-text')
    currentVisibility.textContent = `${weatherObj.current.vis_km}km`

    const uvIndex = document.querySelector('.uv-text')
    uvIndex.textContent = `${weatherObj.current.uv}`
    if (weatherObj.current.uv <= 2) {
        uvIndex.style.backgroundColor = 'var(--warning-green)'
    }
    if (weatherObj.current.uv >= 3 && weatherObj.current.uv <= 5) {
        uvIndex.style.backgroundColor = 'var(--warning-yellow)'
    }
    if (weatherObj.current.uv >= 6 && weatherObj.current.uv <= 7) {
        uvIndex.style.backgroundColor = 'var(--warning-orange)'
    }
    if (weatherObj.current.uv > 7) {
        uvIndex.style.backgroundColor = 'var(--warning-red)'
    }

    const currentHumidity = document.querySelector('.humidity-text')
    currentHumidity.textContent = `${weatherObj.current.humidity}%`

    const currentRainChance = document.querySelector('.precipitation-text')
    currentRainChance.textContent = `${weatherObj.current.precip_mm}mm`
    //--------------------change current weather extra info------------------

    //--------------------change next three days data------------------------
    const nextDay1 = document.querySelector('.day-1')
    const nextDay1Arr = nextDay1.children
    const nextDay2 = document.querySelector('.day-2')
    const nextDay2Arr = nextDay2.children
    const nextDay3 = document.querySelector('.day-3')
    const nextDay3Arr = nextDay3.children

    const fieldTempTitle = document.querySelector('.field-temp')
    fieldTempTitle.textContent = '°C'

    setNextDaysData(nextDay1Arr, 0)
    setNextDaysData(nextDay2Arr, 1)
    setNextDaysData(nextDay3Arr, 2)


    function setNextDaysData(DayArr, index) {
        Array.from(DayArr).forEach(element => {
            if (element.classList.contains('next-days-temp')) {
                element.children[0].src = weatherObj.forecast.forecastday[index].day.condition.icon
                element.children[1].textContent = weatherObj.forecast.forecastday[index].day.avgtemp_c
            } else if (element.classList.contains('date')) {
                let nextDaysOfWeek = weekday[localDate.getDay() + index + 1]
                
                element.textContent = nextDaysOfWeek
            } else if (element.classList.contains('chance-rain')) {
                element.textContent = weatherObj.forecast.forecastday[index].hour[12].chance_of_rain + '%'
            } else if (element.classList.contains('max-wind-container')) {
                element.children[0].style.rotate = weatherObj.forecast.forecastday[index].hour[12].wind_degree + 'deg'
                element.children[1].textContent = Math.round((weatherObj.forecast.forecastday[index].hour[12].wind_kph / 3.6 + Number.EPSILON) * 10) / 10
            }
        });
    }

}

function fillContentImperial() {
    //----------------------------------------get time data---------------------------------
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]
    const dateTimeZone = new Date().toLocaleString('en-US', { timeZone: `${weatherObj.location.tz_id}` })
    const localDate = new Date(dateTimeZone)
    let dayOfWeek = weekday[localDate.getDay()];
    //----------------------------------------get time data---------------------------------

    //--------------------------------set temp in f------------------------
    const currentWeatherIcon = document.querySelector('.weather-temp-img')
    currentWeatherIcon.src = `${weatherObj.current.condition.icon}`

    const currentWeatherText = document.querySelector('.weather-temp-text')
    currentWeatherText.textContent = `${weatherObj.current.temp_f}°F`

    const currentWeatherDescription = document.getElementById('weather-text')
    currentWeatherDescription.textContent = `${weatherObj.current.condition.text}`

    const feelsLike = document.querySelector('.feels-like')
    feelsLike.textContent = `Feels like ${weatherObj.current.feelslike_f}°F`
    //--------------------------------set temp in f------------------------

    //--------------------------------set exta text imperial-------------------
    const currentWindText = document.querySelector('.wind-text')
    let windSpeedMph = weatherObj.current.wind_mph
    currentWindText.textContent = `${windSpeedMph}mph`

    const currentPressure = document.querySelector('.pressure-text')
    currentPressure.textContent = `${weatherObj.current.pressure_in}`

    const currentVisibility = document.querySelector('.visibility-text')
    currentVisibility.textContent = `${weatherObj.current.vis_miles}mile`

    const currentRainChance = document.querySelector('.precipitation-text')
    currentRainChance.textContent = `${weatherObj.current.precip_in}in`
    //--------------------------------set exta text imperial-------------------

    //-------------------------------change next three days imperial------------
    const nextDay1 = document.querySelector('.day-1')
    const nextDay1Arr = nextDay1.children
    const nextDay2 = document.querySelector('.day-2')
    const nextDay2Arr = nextDay2.children
    const nextDay3 = document.querySelector('.day-3')
    const nextDay3Arr = nextDay3.children

    const fieldTempTitle = document.querySelector('.field-temp')
    fieldTempTitle.textContent = '°F'

    setNextDaysData(nextDay1Arr, 0)
    setNextDaysData(nextDay2Arr, 1)
    setNextDaysData(nextDay3Arr, 2)


    function setNextDaysData(DayArr, index) {
        Array.from(DayArr).forEach(element => {
            if (element.classList.contains('next-days-temp')) {
                element.children[0].src = weatherObj.forecast.forecastday[index].day.condition.icon
                element.children[1].textContent = weatherObj.forecast.forecastday[index].day.avgtemp_f
            } else if (element.classList.contains('date')) {
                let nextDaysOfWeek = weekday[localDate.getDay() + index + 1]
                element.textContent = nextDaysOfWeek
            } else if (element.classList.contains('chance-rain')) {
                element.textContent = weatherObj.forecast.forecastday[index].hour[12].chance_of_rain + '%'
            } else if (element.classList.contains('max-wind-container')) {
                element.children[0].style.rotate = weatherObj.forecast.forecastday[index].hour[12].wind_degree + 'deg'
                element.children[1].textContent = weatherObj.forecast.forecastday[index].hour[12].wind_mph
            }
        });
    }


}