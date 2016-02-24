var express = require('express');
var router = express.Router();

router.get('/:page?', function(req, res) {
    var page = 0;
    if (req.params.page) {
        page = req.params.page;
    }
    return req.aggregator.getImages(page).then(function(result) {
        return res.render('index', {"result": result});
    })
})

router.get('/details/:id', function(req, res) {
    return req.aggregator.getImageDetails(req.params.id)
            .then(function(details) {
                return res.render('details', {"details": details});
            })
})

module.exports = router;