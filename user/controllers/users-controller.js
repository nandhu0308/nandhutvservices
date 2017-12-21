var jwt = require('jsonwebtoken');
var ApplicationUsers = require('./../models/application-users-model');

var userSignUp = function(req, res) {
    var reqObj = req.body;
    console.log(reqObj);
    ApplicationUsers.create({
        application_id: reqObj.application_id,
        user_type: reqObj.user_type,
        user_short_name: reqObj.user_short_name,
        country: reqObj.country,
        city: reqObj.city,
        zip: reqObj.zip,
        country_iso_code: reqObj.country_iso_code,
        device_id: reqObj.device_id,
        mobile: reqObj.mobile,
        email_id: reqObj.email_id,
        passwd: reqObj.passwd,
        client_id: reqObj.client_id,
        is_anonymous: reqObj.is_anonymous,
        is_active: reqObj.is_active,
        created_by: reqObj.created_by,
        last_updated_by: reqObj.last_updated_by
    }).then(user => {
        console.log(user.id);
        var token = jwt.sign({
            user_id: user.id
        }, '19cf80e8837fe0b043da07632f05b5c5e6551f9ae36bd34de7ce6099980cdddb', {expiresIn: '7d'});
        res.status(200).json({
            user: user,
            token: token
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong!',
            error: err
        })
    });
};

var userLogin = function (req, res) {
    var reqObj = req.body;
    console.log(reqObj.user);
    // noinspection JSAnnotator
    ApplicationUsers.findOne({
        where: {
            email_id: reqObj.email_id,
            passwd: reqObj.passwd
        },
        attributes: {
            exclude: ['passwd','created_by', 'created_on', 'last_updated_by', 'last_updated_on']
        }
    }).then(user => {
        if(user == null) {
            res.status(404).json({
                success: false,
                status: 404,
                message: 'User not found'
            });
        } else if (user != null) {
            var token = jwt.sign({
                user_id: user.id
            }, '19cf80e8837fe0b043da07632f05b5c5e6551f9ae36bd34de7ce6099980cdddb', { expiresIn: '7d' });
            res.status(200).json({
                success: true,
                user: user,
                token: token
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        });
    });
}

var getUser = function (req, res) {
    var token = req.headers.authorization;
    jwt.verify(token, '19cf80e8837fe0b043da07632f05b5c5e6551f9ae36bd34de7ce6099980cdddb', function (err, decoded) {
        if (err) {
            res.status(401).json({
                success: false,
                status: 404,
                message: 'Not authorized'
            });
        } else if (decoded) {
            ApplicationUsers.findById(decoded.user_id, {
                attributes: {
                    exclude: ['created_on', 'last_updated_on', 'passwd', 'utm_source', 'utm_medium', 'utm_campign', 'utm_term', 'utm_content']
                }
            }).then(user => {
                res.status(200).json(user);
            }).catch(err => {
                res.status(500).json({
                    error: err,
                    message: 'something went wrong'
                });
            });
        }
    });
};

var userPasswordChange = function (req, res) {
    var token = req.headers.authorization;
    jwt.verify(token, '19cf80e8837fe0b043da07632f05b5c5e6551f9ae36bd34de7ce6099980cdddb', function (err, decoded) {
        if(err) {
            res.status(401).json({
                success: false,
                status: 401,
                message: 'Not Authorized'
            });
        } else if(decoded) {
            var reqObj = req.body;
            ApplicationUsers.findById(decoded.user_id).then(user => {
                if(user == null) {
                    res.status(404).json({
                        success: false,
                        status: 404,
                        message: 'Not Authorized'
                    });
                } else {
                    ApplicationUsers.updateAttributes({
                        passwd: reqObj.new_passwd
                    }).then(updatedUser => {
                        res.status(200).json({
                            success: true,
                            status: 200,
                            message: 'Password Updated'
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            success: false,
                            status: 500,
                            message: 'Something went wrong'
                        });
                    });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    success: false,
                    status: 500,
                    message: 'Something went wrong'
                });
            })
        }
    });
};

var userLogout = function (req, res) {
    var token = req.headers.authorization;
}

module.exports = {
    getUser: getUser,
    userLogin: userLogin,
    userSignUp: userSignUp,
    userPasswordChange: userPasswordChange
}