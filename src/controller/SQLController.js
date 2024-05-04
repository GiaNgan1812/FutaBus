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
        console.time("QueryTime");
        request.input('departureKeyword', sql.VarChar(255), req.query.keyword1);
        request.input('destinationKeyword', sql.VarChar(255), req.query.keyword2);

        console.time("QueryTime");
        const result = await request.execute('searchBuses');

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