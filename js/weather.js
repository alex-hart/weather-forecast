$(".container").hide();
$(document).ready(function() {
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  function getLongAndLat(position) {
    var coordinates = position.coords;
    getWeatherInfo(coordinates);
  }

  function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(getLongAndLat);
  }

  if (navigator.geolocation) {
    getCurrentPosition();
  }

  function getWeatherInfo(coordinates) {
    var lat = coordinates.latitude;
    var long = coordinates.longitude;
    var baseURL =
      "https://fcc-weather-api.glitch.me/api/current?lat=" +
      lat +
      "&lon=" +
      long;

    $.ajax({
      url: baseURL,
      success: function(data) {
        var post = data;
        //Displaying main info
        $("#location").text(post.name + ", " + post.sys.country);
        $("#description").text(toTitleCase(post.weather[0].main));
        $("#temp").html(Math.round(post.main.temp) + "&degC");
        var degF = Math.round(post.main.temp * 1.8 + 32);
        $("#temp-f").html(degF + "&degF");
        console.log(data);

        //Times for sunset and sundown converted from unix
        var sunUp = new Date(post.sys.sunrise * 1000);
        var sunUpHours = sunUp.getHours();
        var sunUpMins = "0" + sunUp.getMinutes();
        var sunUpTime = sunUpHours + ":" + sunUpMins.substr(-2);
        var sunDown = new Date(post.sys.sunset * 1000);
        var sunDownHours = sunDown.getHours();
        var sunDownMins = "0" + sunDown.getMinutes();
        var sunDownTime = sunDownHours + ":" + sunDownMins.substr(-2);
        $("#sunrise").text(sunUpTime);
        $("#sunset").text(sunDownTime);

        //Weather icon depending on sunrise or sunset
        var timeNow = +new Date().getTime();
        if (timeNow >= sunDown || timeNow < sunUp) {
          $("#weather-icon").addClass("wi-owm-night-" + post.weather[0].id);
        } else {
          $("#weather-icon").addClass("wi-owm-day-" + post.weather[0].id);
        }

        //Last time weather info was updated
        var updatedDate = new Date(post.dt * 1000);
        var updatedHours = updatedDate.getHours();
        var updatedMins = "0" + updatedDate.getMinutes();
        var updatedTime = updatedHours + ":" + updatedMins.substr(-2);
        $("#updated").text("Last updated: " + updatedTime);

        //Displaying extra info in the table
        $("#humidity").text(post.main.humidity + "%");
        $("#wind-speed").text((post.wind.speed * 2.2).toFixed(2) + " mph");
        $("#visibility").html(
          (post.visibility * 0.000621371).toFixed(2) + "miles"
        );
        $("#pressure").text(post.main.pressure + " hPa");
        $(".container").show();
      }
    });
  }
});
