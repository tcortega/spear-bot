import { Message } from '@open-wa/wa-automate-types-only';
import { Command } from '../types/bot/command.js';
import { bot } from '../index.js';
import { i18n } from '../utils/index.js';

const pageSize = 10;

export const command: Command = {
    name: 'psearch',
    aliases: ['ps'],
    description: i18n.__('search.description'),
    async execute(msg: Message, args: string[]): Promise<void> {
        const query = args.join(' ');
        const page = parseInt(args[args.length - 1], 10) || 1;

        if (!query || query.trim().length === 0) {
            await bot.client.reply(msg.chatId, i18n.__('search.noQuery'), msg.id);
            return;
        }

        const results = bot.aiprm.search(query, page, pageSize);

        if (results.length === 0) {
            await bot.client.reply(msg.chatId, i18n.__('search.noResults'), msg.id);
            return;
        }

        let message = i18n.__mf('search.results', { page });

        results.forEach((prompt) => {
            message += i18n.__mf('search.item', {
                id: prompt.id,
                title: prompt.title,
                description: prompt.teaser,
                usage: prompt.promptHint,
            });
        });

        await bot.client.reply(msg.chatId, message.trim(), msg.id);
    },
};
