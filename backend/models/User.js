const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    Name: {
        type: String,
        required: true
    },

    Email: {
        type: String,
        required: true,
        unique: true
    },

    Password: {
        type: String,
        required: true
    },

    Image: {
        type: String,
        default: ""
    },

    CoverImage: {
        type: String,
        default: ""
    },

    Role: {
        type: String,
        default: ""
    },

    Location: {
        type: String,
        default: ""
    },

    Bio: {
        type: String,
        default: ""
    },

    Skills: [{
        type: String
    }],

    Projects: {
        type: Number,
        default: 0
    },

    Connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    SentRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    ReceivedRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    
    RejectedRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    Contributions: {
        type: Number,
        default: 0
    },

    Github: {
        type: String,
        default: ""
    },

    Linkedin: {
        type: String,
        default: ""
    },

    Portfolio: {
        type: String,
        default: ""
    },

    Experience: {
        type: String,
        default: ""
    },

    Education: {
        type: String,
        default: ""
    },

    Company: {
        type: String,
        default: ""
    }

}, { timestamps: true });

userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.Password;
        return ret;
    }
});

userSchema.set("toObject", {
    transform: (doc, ret) => {
        delete ret.Password;
        return ret;
    }
});

module.exports = mongoose.model("User", userSchema);