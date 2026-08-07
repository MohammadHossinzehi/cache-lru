interface CacheOptions {
  maxSize: number;
  ttl?: number; // milliseconds
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  frequency: number;
}

export class LRUCache<K, V> {
  private cache: Map<K, CacheEntry<V>>;
  private order: K[] = [];
  private maxSize: number;
  private ttl?: number;

  constructor(options: CacheOptions) {
    this.cache = new Map();
    this.maxSize = options.maxSize;
    this.ttl = options.ttl;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;

    // Check if expired
    if (this.ttl && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.updateOrder(key);
      return undefined;
    }

    // Update frequency and move to end (most recently used)
    entry.frequency++;
    this.updateOrder(key);
    return entry.value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      // Update existing
      const entry = this.cache.get(key)!;
      entry.value = value;
      entry.timestamp = Date.now();
      entry.frequency++;
      this.updateOrder(key);
    } else {
      // Add new entry
      if (this.cache.size >= this.maxSize) {
        // Evict least recently used
        const lruKey = this.order[0];
        this.cache.delete(lruKey);
        this.order.shift();
      }

      this.cache.set(key, {
        value,
        timestamp: Date.now(),
        frequency: 1
      });
      this.order.push(key);
    }
  }

  private updateOrder(key: K): void {
    const idx = this.order.indexOf(key);
    if (idx > -1) {
      this.order.splice(idx, 1);
      this.order.push(key);
    }
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    const result = this.cache.delete(key);
    if (result) {
      this.updateOrder(key);
    }
    return result;
  }

  clear(): void {
    this.cache.clear();
    this.order = [];
  }

  size(): number {
    return this.cache.size;
  }

  stats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: ((this.cache.size / this.maxSize) * 100).toFixed(2) + '%'
    };
  }
}

export default LRUCache;
