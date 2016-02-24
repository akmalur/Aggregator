"use strict";

class AggregatedPage {
    constructor(images, pageNumber, numberOfPages) {
        this.images = images;
        this.pageNumber = pageNumber;
        this.numberOfPages = numberOfPages;
    }
}

module.exports = AggregatedPage;