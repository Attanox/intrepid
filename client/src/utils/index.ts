export const COLORS = ["#E779C1", "#58C7F3", "#71EAD2", "#F3CC30", "#E24056"];

export const getColor = (id: string) => {
  const index = (id?.charCodeAt(0) || 0) % COLORS.length;
  return COLORS[index];
};
