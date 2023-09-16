const allowedOrigin = require('./allowedOrigins');

const corsOptions = {
    origin: (origin,callback)=>{
        console.log(origin)
        if(allowedOrigin.indexOf(origin)!== -1) {
            callback(null,true)
        } else {
            callback(new Error('No allowed by cors'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions;