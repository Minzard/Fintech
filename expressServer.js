const express = require('express')
const app = express()
const path = require('path')

app.set('views', path.join(__dirname, 'views')); // ejs file location
app.set('view engine', 'ejs'); // select view templet engine

app.use(express.static(path.join(__dirname, 'public'))); // to use static asset



app.get('/', function (req, res) {
    var title = "javascript"
  res.send('<html><h1>' + title + '</h1><h2>contents</h2></html>')
})

app.get('/ejs', function (req, res) {
    res.render('test')
})

app.get('/test', function (req, res) {
    res.send('test page')
})

app.get('/design', function(req, res) {
    res.render('designTest')    
}) 
app.listen(3000)