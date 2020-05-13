const express = require('express')
const app = express()
const path = require('path')
var request = require('request')

app.set('views', path.join(__dirname, 'views')); // ejs file location
app.set('view engine', 'ejs'); // select view templet engine

app.use(express.static(path.join(__dirname, 'public'))); // to use static asset

app.use(express.json());
app.use(express.urlencoded({extended:false}));

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '********',
    database : 'fintech'
  });

connection.connect();

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

app.get('/dataSend', function(req, res) {
    res.render('dataSend')
})

app.post('/getTime', function(req, res) {
    var now = new Date()
    res.json(now)
})

app.post('/getData', function(req, res) {
    console.log(req.body)
    var userData = req.body.userInputData
    console.log('userData = ', userData)
    res.json(userData + "!!!")
})

//-------Service Start -------//
app.get('/signUp', function(req, res) {
    res.render('signUp')
})

app.get('/authResult', function(req, res) {
    var authCode = req.query.code
    console.log(authCode)
    var option = {
        method : "POST",
        url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
        header : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        form : {
            code : authCode,
            client_id : '0VZoAyN85T7gYXiLXdorm5XqdY0Z5DtfX3fXxRaj',
            client_secret : 'bB8Mtw9mDzT5Gk36O6bAyOpX0UTBvJJD1LgSX2hC',
            redirect_uri : 'http://localhost:3000/authResult',
            grant_type : 'authorization_code'
        }
    }
    //accesstoken get request
    request(option, function(err, response, body) {
        if(err) {
            console.error(err)
            throw err
        }
        else {
            var accessRequestResult = JSON.parse(body)
            console.log(accessRequestResult)
            res.render('resultChild',{data : accessRequestResult})
        }
    })
})

app.post('/signUp', function(req, res){
    var userName = req.body.userName
    var userEmail = req.body.userEmail
    var userPassword = req.body.userPassword
    var userAccessToken = req.body.userAccessToken
    var userRefreshToken = req.body.userRefreshToken
    var userSeqNo = req.body.userSeqNo
    console.log(userName, userAccessToken, userSeqNo)
})


app.listen(3000)