declare global {
  interface ObjectConstructor {
    keys<T extends Object>(o: T): Array<keyof T>;
  }
}
