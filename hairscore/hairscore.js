/*
 * Magic Mirror2 module.
 * Name: Hair forcast
 * Desc: Module to give hair style recomendations based on weather.
 *
 * By: John Redlich http://johnredli.ch
 *
 */

//var Promise = require('es6-promise').Promise;

Module.register("hairscore", {
    //default
    defaults: {
        updateInterval: 1000,
        url_info: {
            apiVersion: "2.5",
            apiBase: "http://api.openweathermap.org/data/",
            weatherEndpoint: "weather",
            lang: config.language,
            units: config.units,
            location: 'New York',
            appid: 'c9ee5ff3302012283820763fbacc42e8'
        }
    },
    getScripts: function () {
        return ["moment.js"];
    },
    start: function () {
        Log.log('Starting module: ' + this.name);
        this.sendSocketNotification("SET_WEATHER", this.config.url_info);
        moment.locale(config.language);
    },
    socketNotificationReceived: function(notification, payload) {
        if(notification === "GET_WEATHER"){
            this.weather = payload;
            this.getHairScore();
            this.updateDom();
        }
    },
    getHumidity: function () {
        if(this.humidity > 85) {
            this.score -= 4;
        } else if (this.humidity > 75) {
            this.score -= 2;
        }
    },
    getWind: function () {
        if(this.wind > 30) {
            this.score -=4;
        } else if(this.wind > 15) {
            this.score -= 2; 
        }
    },
    getHairScore: function () {
        this.humidity = this.weather.main.humidity;
        this.wind = this.weather.wind.speed;
        this.score = 5;
        this.getHumidity();
        this.getWind();
    },
    
    getDom: function() {
        //@TODO make the display nicer.
        if(this.weather) {
            displayText = "HairScore for today is: " +this.score;
        } else {
            var displayText = "HairScore is loading";
        }

        var wrapper = document.createElement("div");
        wrapper.className = "thin medium bright";
        wrapper.innerHTML = displayText;
        return wrapper;
    }
});