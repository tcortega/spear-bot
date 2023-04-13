import { Client, SimpleListener, SocketClient } from '@open-wa/wa-automate-socket-client';
import { handleMessage } from '../handlers/index.js';
import path, { dirname } from 'path';
import { Command } from '../types/bot/command.js';
import { config, isValidScriptFile } from '../utils/index.js';
import Collection from './collection.js';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';
import AIPRMWrapper from './aiprm.js';

export default class Spear {
  public prefix = '!';
  public client!: Client & SocketClient;
  public commands = new Collection<string, Command>();
  public aiprm: AIPRMWrapper = new AIPRMWrapper();
  private callbackId: string;

  public async start(): Promise<void> {
    await this.loadCommands();
    this.client = new SocketClient(config.SOCKET_API_URL, config.SOCKET_API_KEY) as SocketClient & Client;

    this.client.socket.on('connect', async () => {
      console.log('🚀 ~ file: spear.ts ~ line 22 ~ start');
      this.callbackId = await this.registerOnMessage();
    });

    this.client.socket.on('disconnect', () => {
      console.log('🔌 ~ file: spear.ts ~ line 27 ~ start');
      this.unregisterOnMessage();
    });

    this.client.socket.on('connect_error', () => {
      console.log('❌ ~ file: spear.ts ~ line 32 ~ start');
    });

    this.client.socket.io.on('reconnect', () => {
      console.log('⏳ ~ file: spear.ts ~ line 36 ~ Reconnecting...');
    });

    // await apiWrapper.initializeApis();
  }

  private async registerOnMessage(): Promise<string> {
    // Register the onMessage handler
    return await this.client.listen(SimpleListener.Message, handleMessage);
  }

  private unregisterOnMessage(): void {
    // Unregister the onMessage handler
    this.client.stopListener(SimpleListener.Message, this.callbackId);
  }

  private async loadCommands(): Promise<void> {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const commandsDir = path.join(__dirname, '..', 'commands');

    const commandFiles = await fs.readdir(commandsDir, { withFileTypes: true });

    for (const file of commandFiles) {
      if (!isValidScriptFile(file.name)) continue;
      const filePath = path.join(commandsDir, file.name);

      const { command } = await import(`file://${filePath}`);
      this.commands.set(command.name, command);
    }
  }

  getCommand(commandName: string): Command | undefined {
    return this.commands.get(commandName) ?? this.commands.find((cmd) => cmd.aliases?.includes(commandName) ?? false);
  }
}
