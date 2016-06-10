/*
* Magic Mirror2 module.
* Name: Random Outfit Generator
* Desc: Module to randomly select an outfit for a day based on config.
*
* By: John Redlich http://johnredli.ch
*
*/

Module.register("randomoutfit", {
    //default
    defaults: {
        updateInterval: 1000
    },
    closet: {
        clothes: {
            black: {
                shirts: [
                    "Burgundy Polo",
                    "Navy Polo",
                    "Blue and Salmon Striped Polo",
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

    //maybe if we pick a random color scheme first we can organize data that way. 
    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

   start: function() {
       Log.log('Starting module: ' + this.name);

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
    debug: "",
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
                        self.color = "here";
                        break;
                    case 5:
                    case 6:
                    case 0:
                        self.color = "casual";
                        break;
                    default:
                        self.color = "wow";
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
        }
        //@TODO rule based on weather(add shorts or sweaters). Can we get the weather from the default weather modules? or Duplicate code?
    ],

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
        var c = this.getColor();

        var shirt = this.getShirts(c);
        var pants = this.getPants(c);
        var socks = this.getSocks(c);

        var displayText = "Today you should wear, a " + shirt[this.randomNumber(shirt.length)] + " with " + pants[this.randomNumber(pants.length)] + " and rock those " + socks[this.randomNumber(socks.length)] + " socks!";
        // var displayText = this.debug;
        //var testText = document.createTextNode(test);
        var wrapper = document.createElement("div");
        wrapper.className = "thin medium bright";
        wrapper.innerHTML = displayText;

        return wrapper;
    }
});
