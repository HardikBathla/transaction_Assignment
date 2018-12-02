const Boom = require('boom')

class responseSend {

    static sendSuccess(headers, response) {
    const statusCode = (response && response.statusCode) || 200;
    const message = 'SUCCESS'
    const data = response;
    return { statusCode, message, data};
   };



    static sendError(errorData) {
        let error
        if(errorData.isBoom){
            error = errorData
        } else {
             error = Boom.badRequest(errorData.errmsg)
        }
       
        return error;

    }

}


module.exports = responseSend
