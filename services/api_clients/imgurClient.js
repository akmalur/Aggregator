"use strict";
var lodash = require('lodash');
var Promise = require('promise');
var AggregatedImage = rootRequire('/models/image');
var AggregatedImageDetails = rootRequire('/models/imageDetails');

class ImgurClient {
    constructor() {}
    
    getImages(numberOfImages) {
        return this.getImagesResponse(numberOfImages)
                    .then(function(response) {
                        return this.parseImagesResponse(response, numberOfImages);
                    }.bind(this));
    }
    
    getImageDetails(item) {
        return this.getDetailsResponse(item)
                .then(function(response) {
                    return this.parseDetailsResponse(response, item)}
                .bind(this));
    }
    
    getDetailsResponse(item) {
        const request = Promise.denodeify(require('request'));
        
        var uri = 'https://api.imgur.com/3/gallery/image/' + item.id +'/comments/'
        
        var options = {
            url: uri,
            headers: {'Authorization': 'Client-ID 9c25456c9416bd3'}
        };
        
        return request(options);
    }
    
    parseDetailsResponse(response, item) {
        var data = JSON.parse(response.body).data;
        console.log(data);
        
        var i =  new AggregatedImageDetails(
            item, 
            JSON.parse(response.body).data.slice(0, 9));
        console.log(i);
        return i;
    }
    
    getImagesResponse(numberOfImages) {
        const request = Promise.denodeify(require('request'))
        
        var uri = 'https://api.imgur.com/3/gallery/top/time/0';
        
        var options = {
            url: uri,
            headers: {'Authorization': 'Client-ID 9c25456c9416bd3'}
        };
        
        return request(options);
    }
    
    parseImagesResponse(response, numberOfImages) {
        var data = JSON.parse(response.body).data;
        
        var images = [];

        for (var i = 0; i < data.length; i++) {
            if (!data[i].is_album) {
                var image = new AggregatedImage(
                    lodash.uniqueId(),
                    'imgur',
                    data[i].link,
                    data[i].account_url,
                    data[i].views,
                    data[i].comment_count,
                    data[i].title,
                    new Date(data[i].datetime * 1000)
                );
                
                if (numberOfImages > images.length) {
                    images.push(image);
                }
            }
        }

        return images;
    }
}

module.exports = ImgurClient;