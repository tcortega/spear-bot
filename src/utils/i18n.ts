import i18n from 'i18n';
import path, { join } from 'path';
import { config } from './config.js';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18n.configure({
  locales: ['pt_BR'],
  directory: join(__dirname, '..', 'locales'),
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,

  logWarnFn: console.warn,
  logErrorFn: console.error,
  missingKeyFn: (locale, value) => value,

  mustacheConfig: {
    tags: ['{{', '}}'],
    disable: false,
  },
});

i18n.setLocale(config.LOCALE);

export { i18n };
