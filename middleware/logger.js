const {format} = require('date-fns');
const {uuid} = require('uuidv4');
const fs = require('fs');
const fsPromises = require('fs/promises')
const path = require('path')

const logEvents = async(message, logFileName)=>{
    const dateTime = format(new Date,'yyyyMMdd\t HH:mm:ss');
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if(!fs.existsSync(path.join(__dirname,'..','logs'))) {
            fsPromises.mkdir(__dirname,'..','logs')
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',logFileName),logItem);

    } catch (error) {
        console.log(error);
    }
}

const logger = (req,res, next)=>{
    logEvents(`${req.method}\t${req.url}\t${req.origin}`,`${format(new Date,'yyyyMMdd')}_reqLog.txt`)
    
    console.log(`${req.method}\t${req.url}`)
    next();
}

module.exports = {logEvents,logger}