const creds = {
    neo4jusername: "neo4j",
    neo4jpw: "12345678"
}

//const { DateRound } = require('msnodesqlv8');
const neo4j = require('neo4j-driver');

function connectToNeo4j() {
    const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));
    console.log('Connected to Neo4j')
    //console.log(serverInfo)
    return driver;
}

module.exports = connectToNeo4j;
