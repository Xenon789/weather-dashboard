const apikey = '9bb815e8d4c56140532ebbf65f799e59';
var currentWeather = document.getElementById('#current-weather')
var searchHistory = document.getElementById('search-history')
var searchHistoryArray = JSON.parse(localStorage.getItem('historyArray'))||[]


//adds the search button history
for(var i = 0; i < searchHistoryArray.length; i++){
    var searchBtn = $('<button>').addClass('btn btn-success').text(searchHistoryArray[i])
    $('#search-history').append(searchBtn)
}


//clears local storage and sets the search history as an empty string
$('#clear').on('click', function(){
    localStorage.clear()
    searchHistory.innerHTML = ''
})


//pushs the search input into local storage
$('#searchbutton').on('click', function(){
    var searchvalue = $("#search-input").val()
    var searchBtn = $('<button>').addClass('btn').text(searchvalue)
    searchHistoryArray.push(searchvalue)
    localStorage.setItem('historyArray',JSON.stringify(searchHistoryArray))
    $('#search-history').append(searchBtn)
    geocode(searchvalue)

//uses users search to call the api for their location
function geocode(searchinput){
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchinput}&limit=5&appid=${apikey}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        currentWeather(data[0].lat,data[0].lon)
    })
}


//creates the current weather section
function currentWeather(lat,lon){
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        $('#current-container').empty()
       var currentWeather = document.createElement('div');
       currentWeather.setAttribute('id', 'current-weather');
       $('#current-container').append(currentWeather);
        var mainCard = $('<div>').addClass('card');
        var cityName = $('<h1>').text('City: ' + data.name);
        var temp = $('<h1>').text('Temp: ' + data.main.temp);
        var feelsLike = $('<h1>').text('Feels Like: ' + data.main.feels_like);
        var humidity = $('<h1>').text('Humidity: ' + data.main.humidity);
        var windSpeed = $('<h1>').text('Wind Speed: ' + data.wind.speed);
        mainCard.append( cityName, temp, feelsLike, humidity, windSpeed);
        $('#current-weather').append(mainCard);
        var forecast = $('<div>').addClass('forecast');
        $('.forecast').html('5 Day Forecast');
        $('#current-weather').append(forecast);
        getforecast(lat,lon);
    })
}


//creates 5 day weather forcast section
function getforecast(lat,lon){
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
        console.log('data', data);
        var day1 = data.list[5];
        var day2 = data.list[13];
        var day3 = data.list[21];
        var day4 = data.list[29];
        var day5 = data.list[37];
        var daysarray = [day1, day2, day3, day4, day5];
        console.log(daysarray)
        for (let i = 0; i < daysarray.length; i++){
            var daydata = daysarray[i].main;
            var temp = $('<h1>').text('Temp: ' + daydata.temp);
            var feelslike = $('<h1>').text('Feels Like: ' + daydata.feels_like);
            //weather img icon
            var iconurl = `https://openweathermap.org/img/w/${daysarray[i].weather[0].icon}.png`
            var icon = document.createElement('img')
            icon.setAttribute('src', iconurl)
                // adds the elements to 5 day forecast titlecards
                var forecastCard = document.createElement('div');
                var forecastCardTitle = document.createElement('p');
                var forecastTemp = document.createElement('p');
                forecastCardTitle.innerHTML = ('Day ' + (i + 1));
                forecastTemp.innerHTML = daydata.temp;
                forecastCard.appendChild(icon);
                forecastCard.appendChild(forecastCardTitle);
                forecastCard.appendChild(forecastTemp);
            $('.forecast').append(forecastCard);
        }
    })
}
})