function reverse(str: string): string;
function reverse<T>(array: T[]): T[];
function reverse<T>(stringOrArray: string | T[]): string | T[] {
    return typeof stringOrArray === "string"
        ? stringOrArray.split("").reverse().join("")
        : stringOrArray.slice().reverse();
}


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

export const map = <T, R = T>(project: (x: T) => R, list: T[]) => {
  const result = [];
  for (const item of list) {
    result.push(project(item));
  }

  return result;
}

export const intersperce = <T, R = T>(sep: T, list: R[]) => list.reduce<Array<T | R>>((acc, item, idx) => (
  idx === list.length - 1 ? acc.push(item) : acc.push(item, sep),
  acc
), []);

export const range = (from: number, to: number) => {
  const result = [];
  for (let i = from; i < to; i++) {
    result.push(i);
  }

  return result;
}

export const just = <T>(value: T) => () => value;

export const throttle = <T, R>(cb: (...args: T[]) => R, trailing = false) => {
  let clear = true;

  return (...args: T[]) => {
    if (clear) {
      clear = false;

      // TODO - use requestAnimationFrame
      setTimeout(() => {
        if (trailing) {
          cb(...args);
        }
        clear = true;
      }, 16);

      if (!trailing) {
        return cb(...args);
      }
    }
  };
};
