export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getInitial(name: string): string {
  return name?.charAt(0)?.toUpperCase() ?? '?';
}
