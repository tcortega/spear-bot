import i18n from 'i18n';
import { join } from 'path';
import { config } from './config';

i18n.configure({
  locales: ['pt-BR'],
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
