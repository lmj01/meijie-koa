import {configure, getLogger}  from 'log4js';

const config = {
    appenders: { 
        // debug: {
        //     type: 'console',
        // },
        info: {
            type: 'dateFile',
            filename: 'logs/info',
            pattern: '-yyyy-MM-dd.log',
        },
        // errorLog: {
        //     type: 'dateFile',
        //     filename: 'logs/error',
        //     pattern: '-yyyy-MM-dd.log',
        // },
        // error: {
        //     type: 'logLevelFilter',
        //     level: 'error',
        //     appender: 'errorLog',
        // },
        cheese: { 
            type: 'file', 
            filename: 'cheese.log',
        },   
    },
    categories: { 
        default: { 
            appenders: ['cheese'],
            level: 
                'trace'
                //'debug'
                //'info'
                //'warn'
                //'error'
                //'fatal'
        }, 
        info: {
            appenders: ['info'],
            level: 'info',
        }
    },
};

configure(config);

export const logInfo = getLogger('info');
logInfo.level = 'trace';

const logger = getLogger('cheese');
logger.level = 'info';
logger.debug('-log debug info')

export default logger;