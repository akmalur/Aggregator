"use strict";
var lodash = require('lodash');
var Promise = require('promise');
var AggregatedImage = rootRequire('/models/image');
var AggregatedImageDetails = rootRequire('/models/imageDetails');

class GiphyClient {
    constructor() {}
    
    getImages(numberOfImages) {
        return this.getResponse(numberOfImages)
                    .then(this.parseResponse);
    }
    
    getImageDetails(item) {
        return new AggregatedImageDetails(item, []);
    }
    
    getResponse(numberOfImages) {
        const request = Promise.denodeify(require('request'))
        
        var uri = 'http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=' + numberOfImages;
        
        return request(uri);
    }
    
    parseResponse(response) {
        var data = JSON.parse(response.body).data;
        
        var images = [];

        for (var i = 0; i < data.length; i++) {
            var image = new AggregatedImage(
                lodash.uniqueId(),
                'giphy',
                data[i].images.fixed_height.url,
                data[i].username,
                0,
                0,
                data[i].caption,
                new Date(data[i].import_datetime.replace(" ", "T"))
            );
            images.push(image);
        }

        return images;
    }
}

module.exports = GiphyClient;