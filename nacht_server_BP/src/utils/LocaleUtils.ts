import { BLOCK_TYPES } from '../const';

export const getTranslation = (name: string) => {
  const namespace = name.split(':')[0];
  const identifier = namespace === 'minecraft' ? name.split(':')[1] : name;

  return BLOCK_TYPES.includes(name) ? `tiles.${identifier}.name` : `items.${identifier}.name`;
};
