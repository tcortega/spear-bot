import { Command } from '../types/bot/command.js';
import { i18n, parseCropPosition } from '../utils/index.js';
import { bot } from '../index.js';
import { Message } from '@open-wa/wa-automate-types-only';
import { decryptMedia } from '@open-wa/wa-decrypt';

export const command: Command = {
  name: 'sticker',
  aliases: ['fig', 'f'],
  description: i18n.__('sticker.description'),
  async execute(msg: Message, args: string[]): Promise<void> {
    if (!isValidUsage(msg)) return;
    await bot.client.reply(msg.chatId, i18n.__('sticker.receivedRequest'), msg.id);

    const { dataUrl, isVideo } = await getDecryptedMediaData(msg);
    const crop = args.includes('crop');
    const author = i18n.__('bot.name');
    const pack = i18n.__('sticker.pack');

    if (isVideo) {
      await bot.client.sendMp4AsSticker(msg.from, dataUrl, { crop }, { author, pack });
      return;
    }

    const cropPosition = parseCropPosition(args);
    const circle = args.includes('circle');
    const removebg = args.includes('bg');
    await bot.client.sendImageAsSticker(msg.from, dataUrl, {
      keepScale: !crop,
      removebg,
      circle,
      cropPosition,
      author,
      pack,
    });
  },
};

function isValidUsage(msg: Message) {
  return (
    msg.type === 'image' || msg.type === 'video' || msg.quotedMsg?.type === 'image' || msg.quotedMsg?.type === 'video'
  );
}

async function getDecryptedMediaData(msg: Message): Promise<{ dataUrl: string; isVideo: boolean }> {
  msg = msg.type === 'image' || msg.type === 'video' ? msg : msg.quotedMsg!;
  const media = await decryptMedia(msg);
  const dataUrl = `data:${msg.mimetype as string};base64,${media.toString('base64')}`;
  return { dataUrl, isVideo: msg.type === 'video' };
}
