import devLogger from './devLogger';
import uatLogger from './uatLogger';
import productionLogger from './productionLogger';
import { Logger } from 'winston';

let logger = new Logger();

if (process.env.NODE_ENV === 'production') {
  logger = productionLogger();
}

if (process.env.NODE_ENV === 'uat') {
  logger = uatLogger();
}

if (process.env.NODE_ENV === 'dev') {
  logger = devLogger();
}
else{
  logger = devLogger();
}

export default logger;