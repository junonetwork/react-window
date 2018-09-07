import raf from 'raf';


export function pipe<T>(): (input: T) => T;
export function pipe<T, T1>(
  x1: (x: T) => T1
): (input: T) => T1;
export function pipe<T, T1, T2>(
  x1: (x: T) => T1,
  x2: (x: T1) => T2,
): (input: T) => T2;
export function pipe<T, T1, T2, T3>(
  x1: (x: T) => T1,
  x2: (x: T1) => T2,
  x3: (x: T1) => T3,
): (input: T) => T3;
export function pipe(...fns: Array<(x: any) => any>) {
  return (input: any) => {
    let result = input;

    for (const fn of fns) {
      result = fn(result);
    }

    return result;
  }
};

export const map = <T, R = T>(project: (item: T, idx: number) => R) => (list: T[]) => {
  const result = [];
  for (let i = 0; i < list.length; i++) {
    result.push(project(list[i], i));
  }

  return result;
}

export const intersperce = <T, R = T>(sep: T, list: R[]) => list.reduce<Array<T | R>>((acc, item, idx) => (
  idx === list.length - 1 ? acc.push(item) : acc.push(item, sep),
  acc
), []);

export const intersperceProject = <T, R = T>(projectSep: (idx: number) => T) => (list: R[]) =>
  list.reduce<Array<T | R>>((acc, item, idx) => (
    idx === list.length - 1 ? acc.push(item) : acc.push(item, projectSep(idx)),
    acc
  ), []);

export const range = (from: number, to: number) => {
  const result = [];
  for (let i = from; i < to; i++) {
    result.push(i);
  }

  return result;
}

export const sum = (a: number, b: number) => a + b;

export const add = (items: number[]) => {
  const firstTotal = items.reduce(sum);
  return (lastItem: number) => firstTotal + lastItem
};

export const just = <T>(value: T) => () => value;

export const throttle = <T, R>(cb: (...args: T[]) => R) => {
  let clear = true;

  return (...args: T[]) => {
    if (clear) {
      clear = false;

      raf(() => clear = true);

      return cb(...args);
    }
  };
};
