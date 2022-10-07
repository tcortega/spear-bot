import { AdvancedConfig, Client, Collection, ConfigObject, create } from '@open-wa/wa-automate';
import { handleMessage } from '../handlers';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command } from '../types/bot/command';
import { isValidScriptFile } from '../utils';

export default class Spear {
  public prefix = '!';
  public client!: Client;
  public commands = new Collection<string, Command>();

  constructor(private config: AdvancedConfig | ConfigObject) {}

  public async start(): Promise<void> {
    this.client = await create(this.config);

    await this.loadCommands();
    await this.client.onMessage(handleMessage);
  }

  private async loadCommands(): Promise<void> {
    const commandFiles = readdirSync(join(__dirname, '..', 'commands'));

    for (const file of commandFiles) {
      if (!isValidScriptFile(file)) continue;

      const { command }: { command: Command } = await import(join(__dirname, '..', 'commands', file));
      this.commands.set(command.name, command);
    }
  }

  getCommand(commandName: string): Command | undefined {
    return this.commands.get(commandName) ?? this.commands.find(cmd => cmd.aliases?.includes(commandName) ?? false);
  }
}
