var http = require('http');

http.createServer(function (req, res) {
    var body = "Hello!";
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end("<html><h1>Hello World!</h1></html>")
}).listen(3000);