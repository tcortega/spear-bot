import { NotificationLanguage } from '@open-wa/wa-automate';
import Spear from './libs/spear';
import { config } from './utils/config';

export const bot = new Spear({
  sessionId: 'spear-bot',
  multiDevice: true,
  hostNotificationLang: NotificationLanguage.PTBR,
  licenseKey: config.LICENSE
});

bot.start()
  .then(() => console.log('Oi'));
//    .then(() => bot.logger.info('Bot has successfully started.'))
