// Middleware auth realizzato in classe
const authMiddleware = (request, response, next) => {
    console.log("Route Controllata");
    const {headers} = request;

    if (headers['secret'] === process.env.API_KEY) {
        next();
    } else {
        response
            .status(401)
            .json({
                status: 'fail',
                code: 403,
                error: 'Unauthorized'
            });
    }
}
export default authMiddleware