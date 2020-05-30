const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.validateSignup = (req, res, next) => {
    req.sanitizeBody('name');
    req.sanitizeBody('email');
    req.sanitizeBody('password');

    //check name is not null and is 4 to 10 chars long
    req.checkBody('name', 'Enter a name').notEmpty();
    req.checkBody('name', 'Name must be between 4 and 10 characters').isLength({min: 4, max: 10});

    //check email is not null, valid and normalized
    req.checkBody('email', 'Enter a valid email').isEmail().normalizeEmail();


    //check password is not null and min 6 chars
    req.checkBody('password', 'Enter a password').notEmpty();
    req.checkBody('password', 'Password must be more than 6 characters').isLength({min: 6});

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(err => err.msg)[0];
        return res.status(400).send(firstError);
    }
    next();
};

exports.signup = async (req, res) => {
    const {name, email, password} = req.body;
    const user = await new User({name, email, password});
    await User.register(user, password, (err, user) => {
        if (err)
            return res.status(500).send(err.message);
        res.json(user);
    })
};

exports.signin = () => {};

exports.signout = () => {};

exports.checkAuth = () => {};
