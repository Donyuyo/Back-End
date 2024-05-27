import { createLogger, format, transports } from 'winston';
import varenv from '../dotenv.js';

const customLevels = {
    levels: {
        debug: 4,
        info: 3,
        warning: 2,
        error: 1,
        fatal: 0,
    },
    colors: {
        debug: 'blue',
        info: 'green',
        warning: 'yellow',
        error: 'orange',
        fatal: 'red',
    },
};

const devLogger = createLogger({
    levels: customLevels.levels,
    format: format.combine(
        format.colorize(),
        format.simple()
    ),
    transports: [
        new transports.Console({ level: 'debug' })
    ],
});

const prodLogger = createLogger({
    levels: customLevels.levels,
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console({ level: 'info' }),
        new transports.File({ filename: 'errors.log', level: 'error' })
    ],
});

const logger = varenv.logger_env === 'production' ? prodLogger : devLogger;

export default logger;
