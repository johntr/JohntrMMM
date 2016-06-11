# Module: Semi-Random Outfit Chooser

A module for the [Magic Mirror 2 platform](https://github.com/MichMich/MagicMirror). This module was developed to choose an outfit based on some custom rules and a small amount of randomness. 

## Using the module

To use this module you will need to populate the colset object with the clothes you want to choose from. 

````javascript
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
````

## Rules: 
You can add a new anonymous function to the rules array to process. 
The function is required to pass a copy of the object to the function and must have 2 return conditions. Either null ("") or the color you want to choose from. 

For Example: 
````javascript
function (self) {
    var day = moment().format('e');

    if(self.color == "") {
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
        }
    }
    return self.color;
},
````