import 'dotenv/config';
import { Config } from '../types/bot/config';

let config: Config;

try {
  config = require('../../config.json');
} catch {
  config = {
    LOCALE: process.env.LOCALE || 'pt-BR',
    LICENSE: process.env.LICENSE,
  };
}

export { config };
