const express = require('express')
const app = express()
const path = require('path')
var request = require('request')
var jwt = require('jsonwebtoken')
var auth = require('./lib/auth')

app.set('views', path.join(__dirname, 'views')); // ejs file location
app.set('view engine', 'ejs'); // select view templet engine

app.use(express.static(path.join(__dirname, 'public'))); // to use static asset

app.use(express.json());
app.use(express.urlencoded({extended:false}));

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '****',
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

app.post('/authTest', auth, function(req, res) {
    res.json(req.decoded)
})


//-------Service Start -------//
app.get('/signUp', function(req, res) {
    res.render('signUp');
})

app.get('/login', function(req, res) {
    res.render('login');
})

app.get('/main', function(req, res) {
    res.render('main');
})

app.get('/balance', function(req, res) {
    res.render('balance');
})

app.get('/qrCode', function(req, res) {
    res.render('qrCode');
})

app.get('/qrReader' , function(req, res) {
    res.render('qrReader');
})

app.get('/qrReader2' , function(req, res) {
    res.render('qrReader2');
})

app.get('/authResult', function(req, res) {
    var authCode = req.query.code
    console.log(authCode)
    var option = {
        method : "POST",
        url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
        headers : {
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
    var userName = req.body.userName;
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    var userAccessToken = req.body.userAccessToken;
    var userRefreshToken = req.body.userRefreshToken;
    var userSeqNo = req.body.userSeqNo;
    console.log(userName, userAccessToken, userSeqNo);
    var sql = "INSERT INTO fintech.user (name, email, password, accesstoken, refreshtoken, userseqno) VALUES (?,?,?,?,?,?)";
    connection.query(
        sql, //excute sql
        [userName, userEmail, userPassword, userAccessToken, userRefreshToken, userSeqNo],
        function(err, result) {
            if(err){
            console.error(err);
            res.json(0);
            throw err;
        }
        else {
            res.json(1);
        }
    })
})

app.post('/login', function(req, res) {
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    var sql = "SELECT * from fintech.user where email = ?";
    connection.query(
        sql, //excute sql
        [userEmail],
        function(err, result) {
            if(err){
            console.error(err);
            res.json(0);
            throw err;
            }
            else {
                if(result.length == 0){
                    res.json(3);
                }
                else {
                    var dbPassword = result[0].password;
                    if(dbPassword == userPassword) {
                        //login success
                        var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%"
                        jwt.sign(
                        {
                            userId : result[0].id,
                            userEmail : result[0].email
                        },
                        tokenKey,
                        {
                            expiresIn : '10d',
                            issuer : 'fintech.admin',
                            subject : 'user.login.info'
                        },
                        function(err, token){
                            console.log('로그인 성공', token)
                        res.json(token)
                        })
                    }
                    else {
                        res.json(2);
                    }
                }
 
            }
        })
})

app.post('/list', auth, function(req, res) {
    // https://testapi.openbanking.or.kr/v2.0/user/me?user_seq_no=1100758770
    // api response body
    var userId = req.decoded.userId;
    var sql = "SELECT * from fintech.user WHERE id = ?"

    connection.query(sql, [userId], function(err, result){
        if(err) {
            console.error(err)
            throw err
        }
        else {
            console.log(result)
            var option = {
                method : "GET",
                url : "https://testapi.openbanking.or.kr/v2.0/user/me",
                headers : {
                    Authorization : "Bearer " + result[0].accesstoken
                },
                qs : {
                    user_seq_no : result[0].userseqno,       
                }
            }    
           //accesstoken get request
            request(option, function(err, response, body) {
                if(err) {
                    console.error(err)
                    throw err
                }
                else {
                    var accessRequestResult = JSON.parse(body);
                    console.log(accessRequestResult);
                    res.json(accessRequestResult);
                }
            })
        }
    })
})

app.post('/balance', auth, function(req, res) {
    var userId = req.decoded.userId;
    var fin_use_num = req.body.fin_use_num;

    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991624360U" + countnum;

    var sql = "SELECT * from fintech.user WHERE id = ?"

    connection.query(sql, [userId], function(err, result){
        if(err) {
            console.error(err)
            throw err
        }
        else {
            console.log(result)
            var option = {
                method : "GET",
                url : "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
                headers : {
                    Authorization : "Bearer " + result[0].accesstoken
                },
                qs : {
                    bank_tran_id : transId,
                    fintech_use_num : fin_use_num,
                    tran_dtime : "20200515113300"
                }
            }    
           //accesstoken get request
            request(option, function(err, response, body) {
                if(err) {
                    console.error(err)
                    throw err
                }
                else {
                    var accessRequestResult = JSON.parse(body);
                    console.log(accessRequestResult);
                    res.json(accessRequestResult);
                }
            })
        }
    })
})

app.post('/transactionlist', auth, function(req, res) {
    var userId = req.decoded.userId;
    var fin_use_num = req.body.fin_use_num;

    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991624360U" + countnum;

    var sql = "SELECT * from fintech.user WHERE id = ?"

    connection.query(sql, [userId], function(err, result){
        if(err) {
            console.error(err)
            throw err
        }
        else {
            console.log(result)
            var option = {
                method : "GET",
                url : "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
                headers : {
                    Authorization : "Bearer " + result[0].accesstoken
                },
                qs : {
                    bank_tran_id : transId,
                    fintech_use_num : fin_use_num,
                    inquiry_type : "A",
                    inquiry_base : "D",
                    from_date : "20200510",
                    to_date : "20200515",
                    sort_order : "D",
                    tran_dtime : "20200515130900"
                }
            }    
           //accesstoken get request
            request(option, function(err, response, body) {
                if(err) {
                    console.error(err)
                    throw err
                }
                else {
                    var accessRequestResult = JSON.parse(body);
                    console.log(accessRequestResult);
                    res.json(accessRequestResult);
                }
            })
        }
    })
})

app.post('/withdraw', auth, function(req, res) {
    var userId = req.decoded.userId;
    var fin_use_num = req.body.fin_use_num;
    var amount = req.body.amount;

    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991624360U" + countnum;

    var sql = "SELECT * from fintech.user WHERE id = ?"

    connection.query(sql, [userId], function(err, result){
        if(err) {
            console.error(err)
            throw err
        }
        else {
            console.log(result)
            var option = {
                method : "POST",
                url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
                headers : {
                    Authorization : "Bearer " + result[0].accesstoken,
                    "Content-Type" : "application/json"
                },
                json : {
                    bank_tran_id: transId,
                    cntr_account_type: "N",
                    cntr_account_num: "0627325084",
                    dps_print_content: "쇼핑몰환불",
                    fintech_use_num: fin_use_num,
                    wd_print_content: "오픈뱅킹출금",
                    tran_amt: amount,
                    tran_dtime: "20200515130900",
                    req_client_name: "홍길동",
                    req_client_fintech_use_num: fin_use_num,
                    req_client_num: "HONGGILDONG1234",
                    transfer_purpose: "TR",
                    recv_client_name: "김민제",
                    recv_client_bank_code: "097",
                    recv_client_account_num: "0627325084"
                }
            }    
           //accesstoken get request
            request(option, function(err, response, body) {
                if(err) {
                    console.error(err)
                    throw err
                }
                else {
                    console.log(body)
                    if(body.rsp_code == 'A0000') {
                        res.json(1);
                    }
                }
            })
        }
    })
})

// app.post('/deposit', function(req, res) {
//     var userId = req.decoded.userId;
//     var fin_use_num = req.body.fin_use_num;
//     var amount = req.body.amount;

//     var countnum = Math.floor(Math.random() * 1000000000) + 1;
//     var transId = "T991624360U" + countnum;

//     var sql = "SELECT * from fintech.user WHERE id = ?"

//     connection.query(sql, [userId], function(err, result){
//         if(err) {
//             console.error(err)
//             throw err
//         }
//         else {
//             console.log(result)
//             var option = {
//                 method : "POST",
//                 url : "https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
//                 headers : {
//                     Authorization : "Bearer " + result[0].accesstoken,
//                     "Content-Type" : "application/json"
//                 },
//                 json : {
//                     cntr_account_type : "N",
//                     cntr_account_num : "6668531544",
//                     wd_pass_phrase : "NONE",
//                     wd_print_content : "환불금액",
//                     name_check_option : "off",
//                     tran_dtime : "20200515224400",
//                     req_cnt : "1",
//                     req_list : [
//                         {
//                             tran_no : "1",
//                             bank_tran_id : transId,
//                             fintech_use_num : fin_use_num,
//                             print_content : "쇼핑몰환불",
//                             tran_amt : amount,
//                             req_client_name : "홍길동",
//                             req_client_bank_code : "097",
//                             req_client_account_num : "91757515010",
//                             req_client_num : "HONGGILDONG1234",
//                             transfer_purpose : "TR"			
//                         }
//                     ]}
//                 }
//            //accesstoken get request
//             request(option, function(err, response, body) {
//                 if(err) {
//                     console.error(err)
//                     throw err
//                 }
//                 else {
//                     console.log(body)
//                     if(body.rsp_code == 'A0000') {
//                         res.json(1);
//                     }
//                 }
//             })
//         }
//     })
// })


app.listen(3000)