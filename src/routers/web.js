const express = require('express');
const homeController = require('../controller/homeController');
const SQLController = require('../controller/SQLController');
const Neo4jController = require('../controller/Neo4jController');
const router = express.Router();

function initWebRoute(app) {
    router.get('/', homeController.getHomepage);

    router.get('/Home', homeController.getHomepage);
    router.get('/Search', homeController.getSearchpage);

    router.get('/Home/SQL', SQLController.getSQLHome);
    router.get('/Search/SQL', SQLController.getSQLSearch);

    router.get('/Home/Neo4j', Neo4jController.getHomeNeo4j);
    router.get('/Search/Neo4j', Neo4jController.getSearchNeo4j);
    return app.use('/', router)
}
module.exports = initWebRoute

// export default initWebRoute;
