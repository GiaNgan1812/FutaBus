const express = require('express')

const configViewEngine = (app) => {
    app.set("view engine", "ejs");
    app.set("views", "./src/views") //tat ca file ejs phai viet trong views
}

module.exports = {
    configViewEngine
}