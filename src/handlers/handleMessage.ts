import NodeCache from 'node-cache';
import { bot, prisma } from '../index.js';
import { Command } from '../types/bot/command.js';
import { i18n } from '../utils/index.js';
import { GroupChatId, Message } from '@open-wa/wa-automate-types-only';

const userCache = new NodeCache({ stdTTL: 60 * 60 * 24 * 1 }); // Cache for 1 day

async function handleGreeting(message: Message): Promise<void> {
  const isOnCache = userCache.has(message.from);
  if (isOnCache) return;

  let user = await prisma.user.findUnique({ where: { id: message.from } });
  if (user) {
    userCache.set(message.from, true); // Sets as true so it only takes 1 bit of memory
    return;
  }

  await bot.client.sendText(message.chatId, i18n.__('common.greeting'));

  user = await prisma.user.create({ data: { id: message.from } });
  userCache.set(message.from, user);
}

export async function handleMessage(message: Message): Promise<void> {
  if (message.fromMe || !message.text) return;
  if (!message.isGroupMsg) handleGreeting(message);

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
