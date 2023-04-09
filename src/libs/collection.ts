export default class Collection<K, V> {
  private values = new Map<K, V>();

  set(key: K, value: V): void {
    this.values.set(key, value);
  }

  get(key: K): V | undefined {
    return this.values.get(key);
  }

  find(predicate: (value: V) => boolean): V | undefined {
    for (const value of this.values.values()) {
      if (predicate(value)) {
        return value;
      }
    }
  }

  getValues(): V[] {
    return Array.from(this.values.values());
  }
}
