const User = require("../models/User");

const signup = async (req, res) => {

    try {

        const user = new User({

            Name: req.body.name,
            Email: req.body.email,
            Password: req.body.password

        });

        await user.save();

        res.send({
            statuscode: 1
        });

    }

    catch (err) {

        res.send({
            statuscode: 0,
            message: err.message
        });

    }

};

const login = async (req, res) => {

    try {

        const user = await User.findOne({

            Email: req.body.email

        });

        if (!user) {

            return res.send({

                statuscode: 0,
                message: "User not found"

            });

        }

        if (user.Password !== req.body.password) {

            return res.send({

                statuscode: 0,
                message: "Wrong Password"

            });

        }

        res.send({

            statuscode: 1,
            user

        });

    }

    catch (err) {

        res.send({

            statuscode: 0,
            message: "Server Error"

        });

    }

};

module.exports = { signup, login };