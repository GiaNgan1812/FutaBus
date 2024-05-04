const connectToNeo4j = require('../configs/connectNeo4j');

let getHomeNeo4j = (req, res) => {
    return res.render('HomeNeo.ejs')
}

// let getSearchNeo4j = async (req, res) => {
//     var driver = connectToNeo4j();
//     var session = driver.session({ database: 'futafuta' });
//     try {
//         const departure = req.query.keyword1;
//         const destination = req.query.keyword2;

//         const result = await session.run(
//             'MATCH (bus:Bus)-[:Move_At]->(bus_time:Bus_time) ' +
//             'WHERE bus.Departure = $departure AND bus.Destination = $destination ' +
//             'RETURN bus, bus_time',
//             { departure: departure, destination: destination }
//         );

//         const buses = [];
//         result.records.forEach(record => {
//             const bus = record.get('bus').properties;
//             const bus_time = record.get('bus_time').properties;
//             buses.push({ bus: bus, bus_time: bus_time });
//         });

//         console.log(buses);

//         res.render('SearchNeo.ejs', { buses: buses });
//     }
//     catch (error) {
//         console.error('Error searching for buses:', error);
//         res.render('Error.ejs', { message: 'Error searching for buses' });
//     }
//     finally {
//         await session.close();
//         await driver.close();
//     }
// }

let getSearchNeo4j = async (req, res) => {
    var driver = connectToNeo4j();
    var session = driver.session({ database: 'futafuta' });
    try {
        const departure = req.query.keyword1;
        const destination = req.query.keyword2;

        let query = '';
        let params = {};
        if (departure && destination) {
            query = 'MATCH (bus:Bus)-[:Move_At]->(bus_time:Bus_time) ' +
                'WHERE bus.Departure CONTAINS  $departure AND bus.Destination CONTAINS  $destination ' +
                'RETURN bus, bus_time';
            params = { departure: departure, destination: destination };
        } else if (departure) {
            query = 'MATCH (bus:Bus)-[:Move_At]->(bus_time:Bus_time) ' +
                'WHERE bus.Departure CONTAINS  $departure ' +
                'RETURN bus, bus_time';
            params = { departure: departure };
        } else if (destination) {
            query = 'MATCH (bus:Bus)-[:Move_At]->(bus_time:Bus_time) ' +
                'WHERE bus.Destination CONTAINS  $destination ' +
                'RETURN bus, bus_time';
            params = { destination: destination };
        } else {
            // Handle the case when neither keyword1 nor keyword2 is provided
            return res.render('Error.ejs', { message: 'Please provide either departure or destination keyword' });
        }
        console.time("QueryTime");
        const result = await session.run(query, params);
        console.timeEnd("QueryTime");
        const buses = [];
        result.records.forEach(record => {
            const bus = record.get('bus').properties;
            const bus_time = record.get('bus_time').properties;
            buses.push({ bus: bus, bus_time: bus_time });
        });

        //console.log(buses);

        res.render('SearchNeo.ejs', { buses: buses });
    }
    catch (error) {
        console.error('Error searching for buses:', error);
        res.render('Error.ejs', { message: 'Error searching for buses' });
    }
    finally {
        console.log('Disconeted to Neo4j');
        await session.close();
        await driver.close();
    }
}


module.exports = {
    getHomeNeo4j,
    getSearchNeo4j
}