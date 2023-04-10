import { Command } from '../types/bot/command.js';
import { bot } from '../index.js';
import { i18n } from '../utils/index.js';
import { Message } from '@open-wa/wa-automate-types-only';

export const command: Command = {
  name: 'ping',
  description: i18n.__('ping.description'),
  async execute(msg: Message): Promise<void> {
    const ping = Date.now()/1000 - msg.timestamp;
    await bot.client.reply(msg.chatId, i18n.__mf('ping.result', { ping: ping.toFixed(2) }), msg.id);
  },
};
