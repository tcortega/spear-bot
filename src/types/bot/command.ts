export type Command = {
  name: string;
  description: string;
  aliases?: string[];
  adminOnly?: boolean;
  groupOnly?: boolean;
  disabled?: boolean;
  execute(...args: unknown[]): Promise<void>;
};
