const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../secret");
// ahead -> protect that route 
function protectedRoute(req, res, next) {
    // console.log(req.cookies)
    try {
        if (req.cookies.jwt) {
            let decrytptedToken = jwt.verify(req.cookies.jwt, JWT_KEY);
            if (decrytptedToken) {
                req.uid = decrytptedToken.id;
                next();
            }
        } else {
            res.status(401).json({
                message: "You are not allowed"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "server error"
        })
    }
}
module.exports = protectedRoute;