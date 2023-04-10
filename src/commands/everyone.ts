import { Command } from '../types/bot/command.js';
import { bot } from '../index.js';
import { i18n } from '../utils/index.js';
import { Message } from '@open-wa/wa-automate-types-only';

export const command: Command = {
  name: 'todos',
  aliases: ['t'],
  description: i18n.__('ping.description'),
  groupOnly: true,
  async execute(msg: Message, args: string[]): Promise<void> {
    if (!msg.chat.isGroup) return;

    await bot.client.tagEveryone(msg.chat.id, args.join(' '), true);
  },
};
