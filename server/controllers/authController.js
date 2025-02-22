const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

exports.validateSignup = (req, res, next) => {
    req.sanitizeBody('name');
    req.sanitizeBody('email');
    req.sanitizeBody('password');

    //check name is not null and is 4 to 10 chars long
    req.checkBody('name', 'Enter a name').notEmpty();
    req.checkBody('name', 'Name must be between 4 and 10 characters').isLength({min: 4, max: 10});

    //check email is not null, valid and normalized
    req.checkBody('email', 'Enter a valid email').isEmail().normalizeEmail({gmail_remove_dots: false});


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
        res.json(user.name);
    })
};

exports.signin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json(err.message);
        if (!user) return res.status(400).json(info.message);
        req.login(user, (err) => {
            if (err) return res.status(400).json(err.message);
            res.json(user);
        })
    })(req, res, next);
};

exports.signout = (req, res, next) => {
    res.clearCookie('next-cookie.sid');
    req.logout();
    res.json({message: 'You are signed out!'})
};

exports.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/signin');
};
