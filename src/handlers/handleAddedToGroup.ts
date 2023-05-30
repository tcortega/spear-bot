import { Chat } from '@open-wa/wa-automate-types-only';
import { bot } from '../index.js';
import { i18n } from '../utils/index.js';

export async function handleAddedToGroup(chat: Chat): Promise<void> {
  await bot.client.sendText(chat.id, i18n.__('common.greeting'));
}
