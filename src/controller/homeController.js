//const { connectToDb, getDb } = require('../Configs/connectMongo');
const connectToMongoDB = require('../configs/connectMongo');

let getHomepage = (req, res) => {
    return res.render('Home.ejs')
}

let getSearchpage = async (req, res) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db();

        console.log(req.query.keyword1);
        console.log(req.query.keyword2);
        //const result = await db.collection('MOVIES').findOne({ title: req.query.keyword });
        //const result = await db.collection('MOVIES').findOne({ title: { $regex: req.query.keyword, $options: 'i' } });
        // const result = await db.collection('Bus').find({
        //     $or: [
        //         { Departure: { $regex: req.query.keyword1, $options: 'i' } },
        //         { Destination: { $regex: req.query.keyword2, $options: 'i' } }
        //     ]
        // }).toArray();

        // if (result) {
        //     res.render('Search.ejs', { bus: result });
        // } else {
        //     res.render('Error.ejs', { message: "Chuyến xe này không tồn tại" });
        // }
        let query = {};

        if (req.query.keyword1) {
            query.Departure = { $regex: req.query.keyword1, $options: 'i' };
        }
        if (req.query.keyword2) {
            query.Destination = { $regex: req.query.keyword2, $options: 'i' };
        }
        if (!req.query.keyword1 && !req.query.keyword2) {
            return res.render('Error.ejs', { message: "Please enter the keyword!" });
        }
        const result = await db.collection('Bus').find({ $or: [query] }).toArray();
        if (result.length > 0) {
            // const busIds = result.map(bus => bus.ID_bustime).flat(); // Lấy danh sách id của bustime từ kết quả
            // const bustimes = await db.collection('Bus_Time').find({ id: { $in: busIds } }).toArray(); // Truy vấn bustime tương ứng
            // const mergedResults = result.map(bus => {
            //     const busBustimes = bustimes.filter(bustime => bus.ID_bustime.includes(bustime.ID_buses)); // Lọc bustime tương ứng với từng bus
            //     return { ...bus, bustimes: busBustimes }; // Kết hợp thông tin của bus và bustime
            // });
            // console.log(mergedResults);
            res.render('Search.ejs', { bus: result });
        } else {
            res.render('Error.ejs', { message: "This bus does not exist!" });
        }

    }
    catch (err) {
        console.error('Error when searching, please try again!!: ', err);
        res.render('Error.ejs', { message: "Error when searching, please try again!!" });
    }
}

module.exports = {
    getHomepage,
    getSearchpage
}