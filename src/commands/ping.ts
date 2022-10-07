import { Command } from '../types/bot/command';
import { Message } from '@open-wa/wa-automate';
import { bot } from '../index';
import { i18n } from '../utils/i18n';

export const command: Command = {
    name: 'ping',
    description: i18n.__mf('ping.description'),
    async execute(msg: Message): Promise<void> {
        await bot.client.reply(msg.chatId, i18n.__mf('ping.result', {ping: 1001203012}), msg.id);
    }
};
