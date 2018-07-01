let express = require('express');
var https = require('https');

function fetchData(endpoint, cb) {

    var url = 'https://free.currencyconverterapi.com/api/v5/' + endpoint;

    https.get(url, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            
            try {
                var jsonObj = body;
                console.log(jsonObj);
                // var results = jsonObj[results];
                if (jsonObj) {
                    cb(null, jsonObj);
                }
            } catch (e) {
                console.log("Parse error: ", e);
                cb(e);
            }
        });
    }).on('error', function (e) {
        console.log("Got an error: ", e);
        cb(e);
    });
}

let router = express.Router();

router.get('/', (req, res, next) => {
    // res.render('index', { title: 'Currency Converter' });
    
    res.json(
        fetchData('currencies', function (err, data) {
            console.log(data);
            return data;
        })
    )
});

module.exports = router;
