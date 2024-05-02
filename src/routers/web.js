const express = require('express');
const homeController = require('../controller/homeController');
const router = express.Router();

function initWebRoute(app) {
    router.get('/', homeController.getHomepage);
    router.get('/Home', homeController.getHomepage);
    router.get('/Search', homeController.getSearchpage);

    return app.use('/', router)
}
module.exports = initWebRoute

// export default initWebRoute;
