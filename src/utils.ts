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
