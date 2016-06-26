/*
* Magic Mirror2 module.
* Name: Random Outfit Generator
* Desc: Module to randomly select an outfit for a day based on config.
*
* By: John Redlich http://johnredli.ch
*
*/

//var Promise = require('es6-promise').Promise;

Module.register("randomoutfit", {
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
    closet: {
        clothes: {
            black: {
                shirts: [
                    "Burgundy Polo",
                    "Navy Polo",
                    "Blue and Salmon Striped Polo"
                ],
                pants: [
                    "Dark Khakis",
                    "light Khakis",
                    "grey pants"
                ],
                socks: [
                    "Red Striped",
                    "Grey Stripes",
                    "Black"
                ]
            },
            brown: {
                shirts: [
                    "Burgundy Polo",
                    "Navy Polo",
                    "Blue and Salmon Striped Polo"
                ],
                pants: [
                    "Dark Khakis",
                    "light Khakis"
                ],
                socks: [
                    "Red Striped",
                    "Blue"
                ]
            },
            casual: {
                shirts: [
                    "NASA T-Shirt",
                    "Thor T-Shirt",
                    "Iron Man T-Shirt",
                    "Capt America T-Shirt",
                    "Flannel button down"
                ],
                pants: [
                    "Dark jeans",
                    "Light jeans"
                ],
                socks: [
                    "Black no-show",
                    "White no-show"
                ]
            }
        }
    },
    color: "",
    debug: "",
    weather: "",
    warning: "",
    //maybe if we pick a random color scheme first we can organize data that way. 
    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

   start: function() {
       Log.log('Starting module: ' + this.name);
       this.sendSocketNotification("SET_TEMP", this.config.url_info);
       moment.locale(config.language);
   },
    getShirts: function(color) {
        return this.closet.clothes[color].shirts;
    },
    getPants: function(color) {
        return this.closet.clothes[color].pants;
    },
    getSocks: function(color) {
        return this.closet.clothes[color].socks;
    },
    rules: [
        //check to see if its a casual day.
        function (self) {
            var day = parseInt(moment().format('e'));

            if(self.color === "") {
                switch (day) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        self.color = "";
                        break;
                    case 5:
                    case 6:
                    case 0:
                        self.color = "casual";
                        break;
                    default:
                        self.color = "";
                }
            }

            return self.color;
        },
        //if its not a casual day get a dress up color.
        function (self) {

            var numDay = self.randomNumber(2);
            if(self.color == "") {
                switch (numDay) {
                    case 0:
                        self.color = "black";
                        break;
                    case 1:
                        self.color = "brown";
                        break;
                    default:
                        self.color = "";
                }
            }
            return self.color;
        },
        //@TODO rule based on weather(add shorts or sweaters). Can we get the weather from the default weather modules? or Duplicate code?
        function(self) {
            //console.log("Do color stuff with weather.");

            if(self.weather.main.temp_max > 65) {
                self.warning += "<br/>Its going to be warm today. Maybe shorts?"
            }
            if (self.weather.main.temp_min < 40) {
                self.warning += "<br/>It's going to be cold, grab a sweater."
            }
            var rain = /rain/;
            if (rain.exec(self.weather.weather['main'])){
                self.warning += "<br/>It might rain today. Grab an umbrella!";
            }
            return self.color;
        }
    ],
    socketNotificationReceived: function(notification, payload) { 
        if(notification === "GET_TEMP"){
            this.weather = payload;
            this.getColor();
            this.updateDom();
        }
    },
    
    randomNumber: function (count) {
        return Math.floor((Math.random()*count));
    },
    getColor: function() {
        var color;
        var self = this;
        for(var i = 0; i < this.rules.length; i++) {
            color = this.rules[i](self);
        }
        return color;
    },

    getDom: function() {

        if(this.color === "") {
            var displayText = "Loading an outfit for you....";
        } else {
            var shirt = this.getShirts(this.color);
            var pants = this.getPants(this.color);
            var socks = this.getSocks(this.color);

            var displayText = "Today you should wear, a " + shirt[this.randomNumber(shirt.length)] + " with " + pants[this.randomNumber(pants.length)] + " and rock those " + socks[this.randomNumber(socks.length)] + " socks!";
        }
        //var displayText = this.debug;
        //var testText = document.createTextNode(test);
        var wrapper = document.createElement("div");
        wrapper.className = "thin medium bright";
        wrapper.innerHTML = displayText;
        if (this.warning !== "") {
            var warn = document.createElement("span");
            warn.className = "thin small";
            warn.innerHTML = this.warning;
            wrapper.appendChild(warn);
        }
        return wrapper;
    }
});
