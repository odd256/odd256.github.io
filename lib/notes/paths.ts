/** URL 中空格统一映射为 '-' */
export function slugify(name: string) {
  return name.replace(/ /g, '-');
}

