import { Router } from 'express';
import logger from '../utils/logger.js';

const loggerTestRouter = Router();

loggerTestRouter.get('/loggerTest', (req, res) => {
    logger.debug('Este es un mensaje de debug');
    logger.info('Este es un mensaje informativo');
    logger.warning('Este es un mensaje de advertencia');
    logger.error('Este es un mensaje de error');
    logger.fatal('Este es un mensaje fatal');

    res.send('Logs de prueba enviados');
});

export default loggerTestRouter;
