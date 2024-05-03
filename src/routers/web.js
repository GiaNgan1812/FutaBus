const express = require('express');
const homeController = require('../controller/homeController');
const SQLController = require('../controller/SQLController');

const router = express.Router();

function initWebRoute(app) {
    router.get('/', homeController.getHomepage);
    router.get('/Home', homeController.getHomepage);
    router.get('/Search', homeController.getSearchpage);

    router.get('/Home/SQL', SQLController.getSQLHome);
    router.get('/Search/SQL', SQLController.getSQLSearch);
    return app.use('/', router)
}
module.exports = initWebRoute

// export default initWebRoute;
