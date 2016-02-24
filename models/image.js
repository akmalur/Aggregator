"use strict";

class AggregatedImage {
    constructor(id, source, link, author, views, comments, caption, date) {
        this.id = id;
        this.source = source;
        this.link = link;
        this.author = author;
        this.views = views;
        this.comments = comments;
        this.caption = caption;
        this.date = date;
    }
}

module.exports = AggregatedImage;