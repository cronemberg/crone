export function match(param: string): boolean {
    return /^[a-z]{2}(-[a-z]{2})?$/.test(param);
}