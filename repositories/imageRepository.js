"use strict";
var promise = require('promise');

var database = rootRequire('/repositories/database');
var config = rootRequire('config');

var AggregatedPage = rootRequire('/models/page');


class ImageRepository {
    constructor() {
        database.init(config.databasePath());
        this.db = database;
    }
    
    saveImage(image) {
        this.db.put(image.id, image);
    }
    
    getImages(page) {
        var getAllImages = promise.denodeify(this.db.getAll);
        return getAllImages().then(this.sort)
                .then(function(images) {
                    return this.getPage(images, page)}.bind(this));
    }
    
    getImage(id) {
        var getImage = promise.denodeify(this.db.get);
        return getImage(id);
    }
    
    getPage(images, page) {
        var start = page * config.pageSize();
        if (start > images.length) {
            throw new Error("Index out of bounds");
        }
        var end = start + config.pageSize();
        if (end > images.length) {
            end = images.length;
        }
        return new AggregatedPage(
            images.slice(start, end), 
            page, 
            Math.round(images.length/config.pageSize())); 
    }
    
    sort(images) {
        return images.sort(function(a, b) {
            if (a.date > b.date) {
                return 1;
            }
            if (a.date < b.date) {
                return -1;
            }
            return 0;
        });
    }
}

module.exports = ImageRepository;