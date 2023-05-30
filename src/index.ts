import { Spear } from './libs/index.js';
import { PrismaClient } from '@prisma/client';

export const bot = new Spear();
export const prisma = new PrismaClient();

bot.start().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
});
