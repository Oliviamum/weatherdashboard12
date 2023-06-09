$(document).ready(function () {
    // Variables
    var apiKey = "094d0a277545ccc1cd5e098b36a1a3c3"; // Replace with your OpenWeatherMap API key
    var searchForm = $("#search-form");
    var searchInput = $("#search-input");
    var historyList = $("#history");
    var todaySection = $("#today");
    var forecastSection = $("#forecast");
  
    // Event listener for the search form submission
    searchForm.on("submit", function (event) {
      event.preventDefault();
      var cityName = searchInput.val().trim();
      if (cityName !== "") {
        getWeather(cityName);
      }
      searchInput.val("");
    });
  
    // Event listener for the search history click
    historyList.on("click", ".list-group-item", function () {
      var cityName = $(this).text();
      getWeather(cityName);
    });
  
    // Function to get the weather data for a city
    function getWeather(cityName) {
      // Clear previous data
      todaySection.empty();
      forecastSection.empty();
  
      // API call to retrieve weather data
      var queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityName +
        "&appid=" +
        apiKey;
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        // Store the search history
        storeSearchHistory(cityName);
  
        // Display the current weather
        displayCurrentWeather(response);
  
        // Display the 5-day forecast
        displayForecast(response);
      });
    }
  
    // Function to display the current weather
    function displayCurrentWeather(data) {
      var currentData = data.list[0];
      var cityName = data.city.name;
      var date = moment.unix(currentData.dt).format("MM/DD/YYYY");
      var iconURL =
        "https://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png";
      var temperature = convertKelvinToFahrenheit(currentData.main.temp);
      var humidity = currentData.main.humidity;
      var windSpeed = currentData.wind.speed;
  
      // Create elements for current weather
      var cityHeader = $("<h2>").text(cityName + " (" + date + ")");
      var weatherIcon = $("<img>").attr("src", iconURL);
      var tempP = $("<p>").text("Temperature: " + temperature + " °F");
      var humidityP = $("<p>").text("Humidity: " + humidity + "%");
      var windSpeedP = $("<p>").text("Wind Speed: " + windSpeed + " MPH");
  
      // Append current weather elements to the today section
      todaySection.append(cityHeader, weatherIcon, tempP, humidityP, windSpeedP);
    }
  
    // Function to display the 5-day forecast
    function displayForecast(data) {
      var forecastData = data.list;
      for (var i = 1; i < forecastData.length; i += 8) {
        var forecast = forecastData[i];
        var date = moment.unix(forecast.dt).format("MM/DD/YYYY");
        var iconURL =
          "https://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png";
        var temperature = convertKelvinToFahrenheit(forecast.main.temp);
        var humidity = forecast.main.humidity;
  
        // Create elements for forecast
        var forecastCard = $("<div>").addClass("col-lg-2 card bg-primary text-white");
        var dateP = $("<p>").text(date);
        var weatherIcon = $("<img>").attr("src", iconURL);
        var tempP = $("<p>").text("Temp: " + temperature + " °F");
        var humidityP = $("<p>").text("Humidity: " + humidity + "%");
  
        // Append forecast elements to the forecast section
        forecastCard.append(dateP, weatherIcon, tempP, humidityP);
        forecastSection.append(forecastCard);
      }
    }
  
    // Function to store the search history
    function storeSearchHistory(cityName) {
      var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
      if (!searchHistory.includes(cityName)) {
        searchHistory.unshift(cityName);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        displaySearchHistory();
      }
    }
  
    // Function to display the search history
    function displaySearchHistory() {
      var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
      historyList.empty();
      searchHistory.forEach(function (cityName) {
        var historyItem = $("<a>")
          .addClass("list-group-item list-group-item-action")
          .text(cityName);
        historyList.append(historyItem);
      });
    }
  
    // Function to convert temperature from Kelvin to Fahrenheit
    function convertKelvinToFahrenheit(temp) {
      return Math.round((temp - 273.15) * 1.8 + 32);
    }
  
    // Initialize the weather dashboard
    displaySearchHistory();
  });
  