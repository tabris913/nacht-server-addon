export const compareVersion = (v1: [number, number, number], v2: [number, number, number]) => {
  if (v1[0] < v2[0]) return -1;
  if (v1[0] > v2[0]) return 1;

  if (v1[1] < v2[1]) return -1;
  if (v1[1] > v2[1]) return 1;

  if (v1[2] < v2[2]) return -1;
  if (v1[2] > v2[2]) return 1;

  return 0;
};
