export const getTranslation = (name: string, BLOCK_TYPES: Array<string>) => {
  const namespace = name.split(':')[0];
  const identifier = namespace === 'minecraft' ? name.split(':')[1] : name;

  return BLOCK_TYPES.includes(name) ? `tiles.${identifier}.name` : `items.${identifier}.name`;
};
