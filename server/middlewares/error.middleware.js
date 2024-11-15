// errorMiddleware handle error
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message=err.message || "BACKEND ERROR"
    const extraDetails=err.extraDetails || "ERROR FROM SERVER"
    return res.status(statusCode).json({ message, extraDetails })
}

export default  errorMiddleware;