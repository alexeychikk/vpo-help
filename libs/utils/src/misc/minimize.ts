export function minimize(str: string): string {
  return str.replace(/\n/g, ' ').replace(/\s+/g, ' ');
}
