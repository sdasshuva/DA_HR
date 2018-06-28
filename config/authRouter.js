const fs = require('fs');
const async = require('async');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt-nodejs');

module.exports = function() {};

function addExtJsFront(callback) {
    walk('app', function(err, files) {
        if (err) throw err;
        var script = '\n';
        async.eachSeries(files, function(file, cb) {
            script = script + '<script type="text/javascript" src="' + file.replace("app", "/js") + '"></script>\n';
            cb();
        }, function(err) {
            if (err) {
                throw err;
            }
            callback({
                extjs_app_scripts: script
            })
        })
    })
}

function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    })
                } else {
                    results.push(file)
                    next()
                }
            })
        })()
    })
}



function authRouter(app, dbFull, io) {
    var db = dbFull.DA_HR

    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    const bCrypt = require('bcrypt-nodejs');
    const jade = require('jade');
    const pdf = require('html-pdf');

    var factory_name = 'Not Found. Please Contact With Developer';
    var site_title = 'Not Found. Please Contact With Developer';
    var factoryShort = 'NULL';


    var isAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }

    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    }

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use('local', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            db.user.findOne({
                where: {
                    username: username
                }
            }).then(function(user) {
                if (user == null) {
                    return done(null, false, {
                        message: 'Incorrect credentials.'
                    })
                }
                if (isValidPassword(user, password)) {
                    user.updateAttributes({
                        is_online: true,
                        last_login: new Date()
                    }).then(s => {
                        return done(null, user)
                    }).catch(e => {
                        return done(null, false, {
                            message: 'Incorrect credentials.'
                        })
                    })
                } else {
                    return done(null, false, {
                        message: 'Incorrect credentials.'
                    })
                }
            })
        }
    ));

    app.get('/', isAuthenticated, function(req, res) {
        addExtJsFront(function(r) {
            res.render('index.ejs', {
                title: "DA HR",
                loginUserId: req.user.id,
                loginUserName: req.user.username,
                extjs_app_scripts: r.extjs_app_scripts
            });
            io.on('connection', function(s) {
                s.on('disconnect', function() {
                    db.user.findOne({
                        where: {
                            id: req.user.id
                        }
                    }).then(function(user) {
                        user.updateAttributes({
                            is_online: false,
                            last_logout: new Date()
                        }).then(s => {

                        }).catch(e => {

                        })
                    }).catch(e => {

                    })
                });
            })
        })
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            title: "DA HR System",
            message: req.flash('loginMessage')
        });
    });

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }),
        function(req, res) {
            res.redirect('/');
        }
    );

    app.get('/logout', function(req, res) {
        req.session.destroy(function(err) {
            req.logout();
            res.redirect('/login'); //Inside a callback… bulletproof!
        });
    });

    app.get('/verify', function(req, res) {
        console.log('====DA_HR_S1====')
        var decryptedData = urlCrypt.decryptObj(req.query.token);
        req.session.passport = decryptedData.passport;
        req.session.current = decryptedData.current;
        console.log(req.session)
        res.redirect('/');
        console.log('====DA_HR_E1====')
    });

    app.get('/hello', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        database.sequelize.query('SELECT * FROM brand').complete(function(err, data) {
            res.send(data);
        });
    });
}


module.exports.authRouter = authRouter;