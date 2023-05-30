import { Command } from '../types/bot/command.js';
import { bot } from '../index.js';
import { i18n } from '../utils/index.js';
import { Message } from '@open-wa/wa-automate-types-only';

let cachedMessage: string;

export const command: Command = {
  name: 'ajuda',
  aliases: ['h', 'a', 'comandos'],
  description: i18n.__('help.description'),
  async execute(msg: Message): Promise<void> {
    if (cachedMessage) {
      await bot.client.reply(msg.chatId, cachedMessage, msg.id);
      return;
    }

    const commands = bot.commands.toArray();

    let response = i18n.__('help.title');
    commands.forEach((cmd) => {
      if (cmd.disabled) return;

      response += `*!${cmd.name}*\n${cmd.description}\n`;

      if (cmd.aliases) {
        const aliases = cmd.aliases.join(', ');
        response += i18n.__mf('help.aliases', { aliases });
      }

      if (cmd.adminOnly) {
        response += i18n.__('help.adminOnly');
      }

      if (cmd.groupOnly) {
        response += i18n.__('help.groupOnly');
      }

      response += '\n';
    });

    cachedMessage = response.trim();
    await bot.client.reply(msg.chatId, cachedMessage, msg.id);
  },
};
