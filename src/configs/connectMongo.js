const { MongoClient } = require('mongodb')

//let dbConnection

async function connectToMongoDB() {
    try {
        const client = new MongoClient('mongodb://localhost:27017/FutaBus', { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB');
        // Trả về client để sử dụng cho các truy vấn khác, nếu cần
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectToMongoDB;
// module.exports = {
//     connectToDb: (cb) => {
//         MongoClient.connect('mongodb://localhost:27017/FutaBus')
//             .then((client) => {
//                 dbConnection = client.db()
//                 return cb()
//             })
//             .catch(err => {
//                 console.log(err)
//                 return cb(err)
//             })
//     },
//     getDb: () => dbConnection
// }

// module.exports = {
//     server: "DESKTOP-Q8CECPE\\SQLSERVER",
//     driver: "msnodesqlv8",
//     database: "QLyDatHang_CSDL",
//     options: {
//         trustedConnection: true,
//     },
// };
