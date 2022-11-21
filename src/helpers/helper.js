
const HttpResponse = ( {statusCode, statusMessage, body, message }, res) => {
    if( statusMessage === "success") {
        return res.status(statusCode).json({status: statusMessage, body: body});
    }else if( statusMessage === "error") {
        return res.status(statusCode).json({status: statusMessage, message: message});
    }
    return res.status(statusCode).json({status: statusMessage, body: body});
}

module.exports = {
    HttpResponse
}