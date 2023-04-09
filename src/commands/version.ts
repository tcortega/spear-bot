import { Command } from '../types/bot/command.js';
import { bot, version } from '../index.js';
import { i18n } from '../utils/index.js';
import { Message } from '@open-wa/wa-automate-types-only';

export const command: Command = {
  name: 'version',
  aliases: ['v'],
  description: i18n.__mf('version.description'),
  async execute(msg: Message): Promise<void> {
    await bot.client.reply(msg.chatId, i18n.__mf('version.result', { version }), msg.id);
  },
};
