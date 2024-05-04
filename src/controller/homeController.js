//const { connectToDb, getDb } = require('../Configs/connectMongo');
const connectToMongoDB = require('../configs/connectMongo');

let getHomepage = (req, res) => {
    return res.render('Home.ejs')
}

let getSearchpage = async (req, res) => {
    let client;
    try {


        client = await connectToMongoDB();
        const db = client.db();

        console.log(req.query.keyword1);
        console.log(req.query.keyword2);
        console.time("QueryTime");
        let query = [];
        if (req.query.keyword1) {
            query.push({ Departure: { $regex: req.query.keyword1, $options: 'i' } });
        }
        if (req.query.keyword2) {
            query.push({ Destination: { $regex: req.query.keyword2, $options: 'i' } });
        }
        if (query.length === 0) {
            return res.render('Error.ejs', { message: "Please enter the keyword!" });
        }
        console.time("QueryTime");
        const result = await db.collection('Bus').aggregate([
            { $match: { $or: query } }, // Lọc các bus theo điều kiện tìm kiếm
            { $unwind: "$ID_bustime" }, // Tách mỗi phần tử trong mảng ID_bustime thành một dòng riêng biệt
            {
                $lookup: {
                    from: "Bus_Time", // Tên của collection để lookup
                    localField: "ID_bustime", // Trường trong collection Bus chứa id của Bustime
                    foreignField: "ID", // Trường trong collection Bustime chứa id của mình
                    as: "bustimeInfo" // Tên của trường để lưu thông tin lookup
                }
            }
        ]).toArray();

        console.timeEnd("QueryTime");

        //console.log(result);
        if (result.length > 0) {
            res.render('Search.ejs', { bus: result });
        } else {
            res.render('Error.ejs', { message: "This bus does not exist!" });
        }
    }
    catch (err) {
        console.error('Error when searching, please try again!!: ', err);
        res.render('Error.ejs', { message: "Error when searching, please try again!!" });
    }
    finally {
        // Đóng kết nối dù có lỗi xảy ra hay không
        if (client) {
            console.log("Disonnect to MongoDB");
            client.close();
        }
    }
}


module.exports = {
    getHomepage,
    getSearchpage
}