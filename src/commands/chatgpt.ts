import { Command } from '../types/bot/command.js';
import { bot } from '../index.js';
import { config, i18n } from '../utils/index.js';
import { Message } from '@open-wa/wa-automate-types-only';
import { ChatGPTUnofficialProxyAPI } from '@tcortega/chatgpt';
import PQueue from 'p-queue';

const queue = new PQueue({ concurrency: 1 });

const api = new ChatGPTUnofficialProxyAPI({
  accessToken: config.OPENAI_ACCESS_TOKEN,
  apiReverseProxyUrl: 'https://bypass.churchless.tech/api/conversation',
});

const conversations = new Map<string, { conversationId: string; parentMessageId: string }>();

export const command: Command = {
  name: 'conversar',
  aliases: ['c'],
  description: i18n.__('chatgpt.description'),
  async execute(msg: Message, args: string[]): Promise<void> {
    if (!config.OPENAI_ACCESS_TOKEN) {
      await bot.client.reply(msg.chatId, i18n.__('chatgpt.missingApiKey'), msg.id);
      return;
    }

    const author = `${msg.chatId}:${msg.author}`;

    if (!args.length) {
      await bot.client.reply(msg.chatId, i18n.__('chatgpt.usage'), msg.id);
      return;
    }

    const firstArg = args[0].toLocaleLowerCase();
    if (firstArg === 'reset') {
      conversations.delete(author);
      await bot.client.reply(msg.chatId, i18n.__('chatgpt.reset'), msg.id);
      return;
    }

    let query = '';
    if (firstArg.startsWith('p:')) {
      if (args.length < 2) {
        await bot.client.reply(msg.chatId, i18n.__('chatgpt.promptsUsage'), msg.id);
        return;
      }

      const stringId = args.shift().substring(2, firstArg.length);
      const promptId = parseInt(stringId);
      if (isNaN(promptId)) {
        await bot.client.reply(msg.chatId, i18n.__('chatgpt.invalidPromptId'), msg.id);
        return;
      }

      const prompt = bot.aiprm.getById(promptId);
      if (!prompt) {
        await bot.client.reply(msg.chatId, i18n.__('chatgpt.promptNotFound'), msg.id);
        return;
      }

      const promptText = args.join(' ');
      query = prompt.prompt.replaceAll('[PROMPT]', promptText).replaceAll('[TARGETLANGUAGE]', 'In the same language as the one used in the question from the user or of the given instructions, usually surrounded by quotes.');
    } else {
      query = args.join(' ');
    }

    const conversationData = conversations.get(author) ?? {};
    const messageOptions = { ...conversationData };

    await bot.client.reply(msg.chatId, i18n.__('chatgpt.processing'), msg.id);

    const sendApiRequest = async () => {
      console.log('Perguntando ao ChatGPT');
      const res = await api.sendMessage(query, messageOptions);
      console.log('Recebi resposta do ChatGPT...');

      if (isObjectEmpty(conversationData)) {
        conversations.set(author, { conversationId: res.conversationId, parentMessageId: res.id });
      } else {
        conversationData['parentMessageId'] = res.id;
      }

      await bot.client.reply(msg.chatId, res.text, msg.id);
    };

    await queue.add(sendApiRequest);
  },
};

const isObjectEmpty = (objectName) => {
  return Object.keys(objectName).length === 0 && objectName.constructor === Object;
};
