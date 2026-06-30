const publicBase = import.meta.env.BASE_URL || '/';

export function assetPath(path = '') {
  const value = String(path);
  if (!value || /^(https?:|mailto:|data:|blob:)/.test(value)) return value;
  return `${publicBase}${value.replace(/^\/+/, '')}`;
}
