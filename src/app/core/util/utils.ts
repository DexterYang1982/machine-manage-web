let last = Date.now();

export function currentTime(): number {
  let current = Date.now();
  if (current <= last) {
    current = last + 1;
  }
  last = current;
  return current;
}

export function generateId() {
  return '' + currentTime();
}

export function clone<T>(target:T):T {
  return (JSON.parse(JSON.stringify(target)) as T)
}

