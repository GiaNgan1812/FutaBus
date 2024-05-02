const initWebRoute = require('./routers/web.js');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const ejs = require('ejs');
// const configViewEngine = require('./configs/viewEngine.js');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express()
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set("Views", path.join(__dirname, "Views"));
app.use(morgan('combined'));
app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejs.renderFile)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.locals.user = req.user
    next()
})

initWebRoute(app)
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})