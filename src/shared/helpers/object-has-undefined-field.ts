export const objectHasUndefinedField = (o: object): boolean => {
  return Object.values(o).some((value) => value === undefined);
};
