class ExpressError extends Error {
    constructor(stausCode , message){
        super();
        this.statusCode = stausCode;
        this.message = message;
    }
}

module.exports = ExpressError;