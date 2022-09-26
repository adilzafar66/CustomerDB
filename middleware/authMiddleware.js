const jwt = require('jsonwebtoken');

function verifyAuth(req, res, next) {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'cogitoergosum', (error, decodedToken) => {
            // console.log(decodedToken.userId);
            next();
        });

    } else {
        res.redirect('/login');
    }
}

module.exports = {
    verifyAuth
}