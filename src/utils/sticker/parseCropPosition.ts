import { CropPosition } from '../../types/sticker/cropPosition.js';

const positions = [
  'top',
  'right top',
  'right',
  'right bottom',
  'bottom',
  'left bottom',
  'left',
  'left top',
  'north',
  'northeast',
  'east',
  'southeast',
  'south',
  'southwest',
  'west',
  'northwest',
  'center',
  'centre',
  'entropy',
  'attention',
];

export function parseCropPosition(args: string[]): CropPosition | undefined {
  if (!args.includes('crop')) return undefined;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return args.find((arg) => isCropPosition(arg));
}

function isCropPosition(position: string): boolean {
  return positions.includes(position);
}
