declare global {
  interface ObjectConstructor {
    keys<T extends Object>(o: T): Array<keyof T>;
  }

  interface Array<T> {
    includes(value: unknown): value is T;
  }
}
