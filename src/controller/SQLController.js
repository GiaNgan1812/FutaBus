//const { sql, poolPromise, closePool } = require("../configs/mssql.database");
const sql = require("mssql/msnodesqlv8");
let getSQLHome = (req, res) => {
    return res.render('HomeSQL.ejs');
}

let getSQLSearch = async (req, res) => {
    const poolPromise = new sql.ConnectionPool(require("../configs/mssql"))
        .connect()
        .then((pool) => {
            console.log("Connect to MSSQL");
            return pool;
        })
        .catch((err) =>
            console.error("Database Connection failed! Bad config: ", err)
        );
    let pool;
    try {

        pool = await poolPromise;

        console.log(req.query.keyword1);
        console.log(req.query.keyword2);

        const request = pool.request();
        const request1 = pool.request();
        const request2 = pool.request();

        console.time("QueryTime");
        request.input('departureKeyword', sql.VarChar(255), req.query.keyword1);
        request.input('destinationKeyword', sql.VarChar(255), req.query.keyword2);
        request1.input('departureKeyword', sql.VarChar(255), req.query.keyword1);
        request2.input('destinationKeyword', sql.VarChar(255), req.query.keyword2);

        let result;
        if (req.query.keyword1 && req.query.keyword2) {
            result = await request.execute('searchBuses');
        }
        if (req.query.keyword1) {
            result = await request1.execute('searchBuses1');
        }
        if (req.query.keyword2) {
            result = await request2.execute('searchBuses2');
        }
        //console.log(result.recordset);
        console.timeEnd("QueryTime");
        if (result.recordset.length > 0) {
            res.render('SearchSQL.ejs', { bus: result.recordset });
        } else {
            res.render('Error.ejs', { message: "This bus does not exist!" });
        }
    } catch (err) {
        console.error('Error when searching, please try again!!: ', err);
        res.render('Error.ejs', { message: "Error when searching, please try again!!" });
    }
    finally {
        if (pool) {
            pool.close();
        }
    }
};

module.exports = {
    getSQLHome,
    getSQLSearch
}