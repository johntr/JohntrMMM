var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({
    
    start: function() {
        console.log("Starting module: " + this.name);
        this.temp = [];
    },
    

    socketNotificationReceived: function(notification, payload) {
        if (notification === "SET_TEMP") {
            this.apiVersion = payload.apiVersion;
            this.apiBase = payload.apiBase;
            this.weatherEndpoint = payload.weatherEndpoint;
            this.lang = payload.lang;
            this.units = payload.units;
            this.location = payload.location;
            this.appid = payload.appid;

            console.log("Setting Temp from Open Weather.");
            this.getWeather();
        }
    },

    /**
     *  get weather info functions.
     */
    getWeather: function() {
        var url = this.apiBase + this.apiVersion + "/" + this.weatherEndpoint + this.getParams();
        console.log(url);
        var self = this;
        request(url, function(error, response, body){
            if (!error && response.statusCode == 200) {
                self.processData(JSON.parse(body));
            }
            else {
                //@TODO Do something just in case we do not get the weather.
                console.log(error);
                console.log(response.statusCode);
            }
        });
    },
    getParams: function() {
        var params = "?";
        params += "q=" + this.location;
        params += "&units=" + this.units;
        params += "&lang=" + this.lang;
        params += "&APPID=" + this.appid;

        return params;
    },
    processData: function(data){

        var weather = data;
        this.sendSocketNotification("GET_TEMP", weather);

    }
});
