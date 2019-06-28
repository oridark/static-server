var express = require('express');
var app = express();
var port = process.env.PORT || 8989;
var compression = require('compression');

app.use(compression());
app.use(express.static(__dirname+'/dist'));

app.listen(port, '0.0.0.0', function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('运行中');
});