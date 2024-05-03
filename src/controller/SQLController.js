const { sql, poolPromise, closePool } = require("../configs/mssql.database");

let getSQLHome = (req, res) => {
    return res.render('HomeSQL.ejs');
}

let getSQLSearch = async (req, res) => {
    let pool;
    try {
        console.time("QueryTime");
        pool = await poolPromise;

        console.log(req.query.keyword1);
        console.log(req.query.keyword2);

        const request = pool.request();

        request.input('departureKeyword', sql.VarChar(255), req.query.keyword1);
        request.input('destinationKeyword', sql.VarChar(255), req.query.keyword2);

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
    //finally {
    //     if (pool) {
    //         closePool();
    //     }
    // }
};

module.exports = {
    getSQLHome,
    getSQLSearch
}