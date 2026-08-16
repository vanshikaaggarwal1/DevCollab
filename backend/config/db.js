const mongoose = require("mongoose");

const connectDB = async () => {

    try {
        const connUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/DeveloperDB";
        await mongoose.connect(connUri);

        console.log(`Database Connected: ${connUri}`);

    }
    catch (err) {
        console.log(err);
    }

};

module.exports = connectDB;