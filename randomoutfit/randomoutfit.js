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
        clothes: {
            shirts: [
                'Burgundy Polo',
                'Navy Polo',
                'Blue and Salmon Striped Polo',
                'Flannel Button Down'
            ],
            pants: [
                'Dark Khakis',
                'light Khakis',
                'Jeans'
            ],
            socks: [
                'Red Striped',
                'Blue',
                'Grey Stripes',
                'Black'
            ]
        },
        updateInterval: 1000
    },

    // Define required scripts.
    // getScripts: function() {
    //     return ["moment.js"];
    // },

   start: function() {
       Log.info('Starting module: ' + this.name);

   },
    getShirts: function() {
        return this.defaults.clothes.shirts;
    },
    getPanits: function() {
        return this.defaults.clothes.pants;
    },
    getSocks: function() {
        return this.defaults.clothes.socks;
    },

    randomNumber: function () {
        return Math.floor((Math.random()*4));
    },

    getDom: function() {
            var shirt = this.getShirts();
            var pants = this.getPanits();
            var socks = this.getSocks();

            var text = "Today you should wear, a " + shirt[this.randomNumber()] + " with " + pants[this.randomNumber()] + " and rock those " + socks[this.randomNumber()] + " socks!";
        //var shirts = this.randomNumber();
        //var testText = document.createTextNode(test);
        var wrapper = document.createElement("div");
        wrapper.className = "thin medium bright";
        wrapper.innerHTML = text;

        return wrapper;
    }
});
