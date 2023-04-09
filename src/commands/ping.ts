import { Command } from '../types/bot/command.js';
import { bot } from '../index.js';
import { i18n } from '../utils/index.js';
import { Message } from '@open-wa/wa-automate-types-only';

export const command: Command = {
  name: 'ping',
  description: i18n.__mf('ping.description'),
  async execute(msg: Message): Promise<void> {
    await bot.client.reply(msg.chatId, i18n.__mf('ping.result', { ping: 1001203012 }), msg.id);
  },
};
