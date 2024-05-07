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
    var session = driver.session({ database: 'futabus' });
    try {
        const departure = req.query.keyword1;
        const destination = req.query.keyword2;
        const departure_date = req.query.keyword3;
        let query = '';
        let params = {};
        if (departure && destination && !departure_date) {
            query = `
    MATCH (bus:bus)-[:depart_from]->(departure:stop), 
          (bus)-[:arrive_at]->(destination:stop), 
          (bus)-[:has_schedule]->(schedule:schedule)
    WHERE departure.stop =~ '(?i).*' + $departure + '.*' 
          AND destination.stop =~ '(?i).*' + $destination + '.*' 
    RETURN bus, schedule;
`;
            params = { departure: departure, destination: destination };
        } else if (departure && destination && departure_date) {
            query = `
            MATCH (bus:bus)-[:depart_from]->(departure:stop), 
                  (bus)-[:arrive_at]->(destination:stop), 
                  (bus)-[:has_schedule]->(schedule:schedule)
            WHERE departure.stop =~ '(?i).*' + $departure + '.*' 
                  AND destination.stop =~ '(?i).*' + $destination + '.*' 
                  AND schedule.departure_date =~ '(?i).*' + $departure_date + '.*'
            RETURN bus, schedule;
        `;
            params = { departure: departure, destination: destination, departure_date: departure_date };
        }
        else if (departure) {
            query = `
    MATCH (bus:bus)-[:depart_from]->(departure:stop),
          (bus)-[:has_schedule]->(schedule:schedule)
    WHERE departure.stop =~ '(?i).*' + $departure + '.*' 
    RETURN bus, schedule;
`;
            params = { departure: departure };
        } else if (destination) {
            query = `
    MATCH (bus)-[:arrive_at]->(destination:stop), 
          (bus)-[:has_schedule]->(schedule:schedule)
    WHERE destination.stop =~ '(?i).*' + $destination + '.*'
    RETURN bus, schedule;
`;
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
            const schedule = record.get('schedule').properties;
            buses.push({ bus: bus, schedule: schedule });
        });

        console.log(buses);

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

let getDetailNeo4j = async (req, res) => {
    var driver = connectToNeo4j();
    var session = driver.session({ database: 'futabus' });
    try {
        const IDBus = req.query.IDBus;
        //const destination = req.query.des;

        let query = '';
        let params = {};
        query = `
        MATCH (b:bus {IDBus: $IDBus})-[:has_schedule]->(s:schedule)-[:has_stop]->(st:stop)
  RETURN DISTINCT s, st
`;
        params = { IDBus: IDBus };

        let params1 = { IDBus: IDBus };
        let query1 = `
    MATCH (b:bus {IDBus: $IDBus})-[:has_seat]->(seat:seat)
    RETURN seat
    ORDER BY 
        seat.IDSeat,
        toInteger(SUBSTRING(seat.IDSeat, 2))
`;
        console.time("QueryTime");
        const result = await session.run(query, params);
        const result1 = await session.run(query1, params1);
        console.timeEnd("QueryTime");

        const sch = [];
        result.records.forEach(record => {
            const schedule = record.get('s').properties;
            const stop = record.get('st').properties;
            sch.push({ schedule: schedule, stop: stop });
        });

        const sea = [];
        result1.records.forEach(record => {
            const seat = record.get('seat').properties;
            sea.push({ seat: seat });
        });
        console.log(sch);
        console.log(sea);
        res.render('searchDetail.ejs', { sch: sch, sea: sea });
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
    getSearchNeo4j,
    getDetailNeo4j
}