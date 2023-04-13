import { Message } from '@open-wa/wa-automate-types-only';
import { Command } from '../types/bot/command.js';
import { bot } from '../index.js';
import { i18n } from '../utils/index.js';

const pageSize = 10;

export const command: Command = {
    name: 'prompts',
    aliases: ['p'],
    description: i18n.__('prompts.description'),
    async execute(msg: Message, args: string[]): Promise<void> {
        const page = parseInt(args[0]) || 1;
        const prompts = bot.aiprm.getPrompts(page, pageSize);

        if (prompts.length === 0) {
            await bot.client.reply(msg.chatId, i18n.__('prompts.noPrompts'), msg.id);
            return;
        }

        let message = i18n.__mf('prompts.list', { page });

        prompts.forEach((prompt) => {
            message += i18n.__mf('prompts.item', {
                id: prompt.id,
                title: prompt.title,
                description: prompt.teaser,
                usage: prompt.promptHint,
            });
        });

        await bot.client.reply(msg.chatId, message.trim(), msg.id);
    },
};
