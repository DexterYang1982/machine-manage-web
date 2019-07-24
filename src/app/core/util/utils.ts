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

export function clone<T>(target: T): T {
  return (JSON.parse(JSON.stringify(target)) as T)
}


export function findAndUpdate(list: any[], newOne: any) {
  const oldOne = list.find(it => it['id'] && (it['id'] === newOne['id']));
  if (oldOne) {
    deepCopy(oldOne, newOne);
    return oldOne;
  } else {
    list.push(newOne);
    return newOne;
  }
}

export function deepCopy(oldOne: any, newOne: any) {
  for (const p in newOne) {
    if (newOne.hasOwnProperty(p)) {
      if (Array.isArray(newOne[p])) {
        if (oldOne[p] == null) {
          oldOne[p] = [];
        }
        const oldList = oldOne[p] as any[];
        const newList = (newOne[p] as any[]).map(it => findAndUpdate(oldList, it));
        oldList.filter(it => newList.indexOf(it) < 0).forEach(it => oldList.splice(oldList.indexOf(it), 1));
      } else if (typeof newOne[p] === 'object') {
        deepCopy(oldOne[p], newOne[p]);
      } else if (newOne[p] !== oldOne[p]) {
        oldOne[p] = newOne[p];
      }
    }
  }
}
