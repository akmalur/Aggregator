"use strict";
var Promise = require('promise');

var ImageRepository = rootRequire('/repositories/imageRepository');
var GiphyClient = rootRequire('/services/api_clients/giphyClient');
var ImgurClient = rootRequire('/services/api_clients/imgurClient');

var config = rootRequire('config');

class AggregatorService {
    constructor() {
        this.ImageRepository = new ImageRepository();
        this.GiphyClient = new GiphyClient();
        this.ImgurClient = new ImgurClient();
    }
    
    prePopulate() {
        this.GiphyClient.getImages(config.numberOfImages())
            .then(this.save.bind(this)).catch(console.log);
        this.ImgurClient.getImages(config.numberOfImages())
            .then(this.save.bind(this)).catch(console.log);
    }
    
    getImages(page) {
        return this.ImageRepository.getImages(page);
    }
    
    getImageDetails(id) {
        return this.ImageRepository.getImage(id)
            .then(this.getDetails.bind(this))
            .catch(console.log);
    }
    
    getDetails(item) {
        if(item.source === 'giphy') {
            return this.GiphyClient.getImageDetails(item);
        }
        return this.ImgurClient.getImageDetails(item);
    }
    
    save(images) {
        for(var i = 0; i < images.length; i++) {
            this.ImageRepository.saveImage(images[i]);
        }
    }
}

module.exports = AggregatorService;