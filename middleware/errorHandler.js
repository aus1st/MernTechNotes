const { format } = require('date-fns')
const {logEvents} =  require('./logger')

const errorHandler = (err, req,res,next)=>{
 logEvents(`${err.name}\t${err.message}\t${req.method}\t${req.ulr}\t${req.headers.origin}`,format(new Date(),'yyyyMMdd')+'_errorLog.txt')

 const status = res.statusCode ? res.statusCode : 500;
 res.status(status);
 res.json({message: err.message});
}

module.exports = errorHandler