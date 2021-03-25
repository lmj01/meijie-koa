const log4js = require('log4js');

log4js.configure({
    appenders: {
        cheese: {
            // "type": "console",
            "type": "file",
            filename: "cheese.log",
            "layout": {
                "type": "pattern", 
                "pattern": "%[[%p]%] - %10.-100f{2} | %7.12l:%7.12o - %[%m%]",
            }
        }
    },
    categories: {
        default: {
            appenders: ["cheese"],
            enableCallStack: true,
            level: "info"
        }
    }
})

const logger = log4js.getLogger();

export default logger;