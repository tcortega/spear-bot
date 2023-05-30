import { Message } from '@open-wa/wa-automate-types-only';
import { Command } from '../types/bot/command.js';
import { bot } from '../index.js';
import { isValidTweetUrl } from '../utils/validators.js';
import { TwitterScraper } from '@tcortega/twitter-scraper';
import { i18n } from '../utils/index.js';

export const command: Command = {
  name: 'twitter',
  aliases: ['tt'],
  description: i18n.__('twitter.description'),
  async execute(msg: Message, args: string[]): Promise<void> {
    if (args.length === 0) {
      await bot.client.reply(msg.chatId, i18n.__('twitter.usage'), msg.id);
      return;
    }

    const url = args.pop()!;
    if (!isValidTweetUrl(url)) {
      await bot.client.reply(msg.chatId, i18n.__('twitter.invalidUrl'), msg.id);
      return;
    }

    const tweetScraper = await TwitterScraper.create();
    const tweetData = await tweetScraper.getTweetMeta(url);

    if (!tweetData.isMedia) {
      await bot.client.reply(msg.chatId, i18n.__('twitter.notMedia'), msg.id);
      return;
    }

    await bot.client.sendFileFromUrl(
      msg.chatId,
      tweetData.media_url![0].url,
      'ZapBots',
      tweetData.description!,
      msg.id,
    );
  },
};
