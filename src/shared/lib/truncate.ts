/** Truncate to `max` chars, adding an ellipsis only when actually cut.
    (Search results previously appended "..." unconditionally, so short
    descriptions got a spurious ellipsis.) */
export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}
