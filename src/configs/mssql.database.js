const sql = require("mssql/msnodesqlv8");

const poolPromise = new sql.ConnectionPool(require("./mssql"))
    .connect()
    .then((pool) => {
        //console.log("Connect to MSSQL");
        return pool;
    })
    .catch((err) =>
        console.error("Database Connection failed! Bad config: ", err)
    );

const closePool = async () => {
    try {
        const pool = await poolPromise;
        await pool.close();
        console.log("Disconnected from MSSQL");
    } catch (err) {
        console.error("Error when closing connection: ", err);
        throw err;
    }
};

module.exports = {
    sql,
    poolPromise,
    closePool
};
