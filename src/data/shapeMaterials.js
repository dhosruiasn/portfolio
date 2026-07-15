// Hero 幾何色票：核心深色 → 中間色 → 外緣淺色。
export const SHAPE_MATERIALS = {
  blue: ['#17256f', '#3156b8', '#7095e6', '#c0d7ff', '#edf2ff'],
  purple: ['#28108f', '#5530c8', '#9668ef', '#d5a9ff', '#f1ddff'],
  orange: ['#861c0b', '#ce3515', '#f2652f', '#ffa071', '#ffd7bd'],
  green: ['#294f18', '#588821', '#92bd35', '#cce968', '#eff8b8'],
};

// Footer 幾何與文字隨機配對時，僅從這四個印刷色取色。
export const FOOTER_COLORS = {
  blue: '#68abe8',
  orange: '#e13103',
  brown: '#5d1c02',
  cream: '#f1e9de',
};

const mixHex = (from, to, amount) => {
  const parse = (hex) => [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
  const a = parse(from);
  const b = parse(to);
  return `#${a
    .map((channel, index) => Math.round(channel + (b[index] - channel) * amount).toString(16).padStart(2, '0'))
    .join('')}`;
};

// 外圈維持幾何底色；中心只將該底色往米白提亮，不混入另一個幾何色。
export const createFooterMaterial = (color) => [
  color,
  color,
  color,
  mixHex(color, FOOTER_COLORS.cream, 0.46),
  mixHex(color, FOOTER_COLORS.cream, 0.78),
];
