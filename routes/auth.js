const router = require("express").Router();
const User = require("../models/User");
// const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
// const { default: mongoose } = require("mongoose");

//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});
// router.post('/', (req, res, next) => {
//     bcrypt.hash(req.body.password, 10, (err, hash) => {
//         if (err) {
//             return res.status(500).json({
//                 error: err
//             })
//         }
//         else {
//             const user = new User({
//                 _id: new mongoose.Types.ObjectId,
//                 username: req.body.username,
//                 email: req.body.email,
//                 password: req.body.password
//             })
//             user.save().then(result => {
//                 res.status(200).json({
//                     new_user: result
//                 })
//             })
//         }
//     })
// })

//LOGIN

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne(
            {
                username: req.body.username
            }
        );
        !user && res.status(401).json("Wrong User Name");
        const hashedPassword = req.body.password
        const passwordUser = await User.findOne(
            {
                password: req.body.password
            }
        );
        console.log("password:", hashedPassword);
        !passwordUser && res.status(401).json("Wrong Password");
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.Jwt_SEC,
            { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });

    } catch (err) {
        res.status(500).json(err);
    }

});

module.exports = router;