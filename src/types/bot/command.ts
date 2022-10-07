export type Command = {
  name: string;
  description: string;
  aliases?: string[];
  adminOnly?: boolean;
  groupOnly?: boolean;
  disabled?: boolean;
  execute(...args: any): Promise<void>;
}
