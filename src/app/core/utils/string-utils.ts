export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getInitial(name: string): string {
  return name?.charAt(0)?.toUpperCase() ?? '?';
}

export function getBackgroundColor(name: string): string {
  const initial = getInitial(name);
  // Simple hash: convierte letra en valor entre 0 y 360 (hue)
  const charCode = initial.charCodeAt(0);
  const hue = (charCode * 57) % 360; // 57 es solo un número primo para variar

  // Devuelve un color HSL (más controlable que HEX para esto)
  return `hsl(${hue}, 70%, 70%)`;
}
