const express = require('express')
const app = express()

const fs = require('fs')

const path = require('path')

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const favicon = require('serve-favicon')

app.use(favicon(__dirname + '/favicon.ico'))
app.set('view engine', 'ejs')
app.use(bodyParser())
app.use(cookieParser())


function read_check(password) {
    var jsonfile = fs.readFileSync('./keys.json', 'utf8')
    var jsondata = JSON.parse(jsonfile)

    return jsondata.hasOwnProperty(password)
}

app.get('/', function(req, res) {

    res.render('login.ejs')
})

app.post('/login_check', function(req, res) {
    var password = req.body.password
    res.cookie('password', password)

    var check = read_check(password)

    if (check) {
        res.redirect('/write')
    } else {
        res.redirect('/wrong')
    }
})

app.get('/write', function(req, res) {

    var filelist = fs.readdirSync('./data')

    if (filelist.indexOf(req.cookies.password) == -1 && read_check(req.cookies.password)) {
        res.render('main.ejs')
    }
    else {
        res.redirect('/wrong')
    }
})

app.post('/send', function(req, res) {
    fs.writeFileSync('./data/' + req.cookies.password, req.body.letter)
    res.render('complete')
})

app.get('/wrong', function(req, res) {
    res.render('error.ejs')
})

app.get('/santa_img', function(req, res) {
    fs.readFile('./public/santa.png', function(error, data) {
        res.writeHead(200, {'Content-Type' : 'text/html'})
        res.end(data)
    })
})
app.listen('3000')