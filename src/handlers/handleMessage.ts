import { bot } from '../index.js';
import { Command } from '../types/bot/command.js';
import { i18n } from '../utils/index.js';
import { GroupChatId, Message } from '@open-wa/wa-automate-types-only';

export async function handleMessage(message: Message): Promise<void> {
  if (message.fromMe || !message.text) return;

  const commandRegex = new RegExp(`^${bot.prefix}(\\w+.*)$`, 's');
  const matches = message.text.match(commandRegex);
  if (!matches) return;

  const [, content] = matches;
  const args: string[] = content.trim().split(/ +/);
  const commandName = args.shift()!.toLowerCase();

  const command = bot.getCommand(commandName);
  if (!command) return;

  if (!(await isValidCommandUsage(command, message))) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    await bot.client.reply(message.chatId, i18n.__('common.error'), message.id);
  }
}

async function isValidCommandUsage(command: Command, message: Message): Promise<boolean> {
  if (command.disabled) return false;
  if ((command.groupOnly || command.adminOnly) && !message.isGroupMsg) return false;

  if (!command.adminOnly) return true;

  const { me } = await bot.client.getMe();
  const adminList: string[] = await bot.client.getGroupAdmins(message.chat.id as GroupChatId);
  return adminList.includes(me._serialized) || adminList.includes(message.author);
}
