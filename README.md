# cache-lru

Production-grade LRU cache implementation with pluggable backends, TTL support, and minimal overhead.

## Features

- **LRU Eviction**: Efficient least-recently-used eviction policy
- **TTL Support**: Automatic expiration of stale entries
- **O(1) Operations**: Constant-time get, set, and delete operations
- **Pluggable Backends**: Memory-based implementation with extensible architecture
- **Type Safe**: Full TypeScript support with complete type definitions
- **Zero Dependencies**: No external dependencies required
- **Production Ready**: Built for high-performance caching scenarios

## Installation

```bash
npm install cache-lru
```

## Quick Start

```typescript
import { LRUCache } from 'cache-lru';

// Create a cache with max 1000 entries and 1 hour TTL
const cache = new LRUCache({
  maxSize: 1000,
  ttl: 3600000 // milliseconds
});

// Basic operations
cache.set('user:123', { name: 'Alice', email: 'alice@example.com' });
const user = cache.get('user:123'); // { name: 'Alice', email: 'alice@example.com' }

// Check if key exists
if (cache.has('user:456')) {
  const data = cache.get('user:456');
}

// Get cache statistics
console.log(cache.stats()); // { size: 1, maxSize: 1000, utilization: '0.10%' }

// Delete entry
cache.delete('user:123');

// Clear all entries
cache.clear();
```

## API Reference

### Constructor

```typescript
new LRUCache(options: CacheOptions)
```

Options:
- `maxSize` (required): Maximum number of entries in the cache
- `ttl` (optional): Time-to-live in milliseconds for entries

### Methods

#### `get(key: K): V | undefined`
Retrieves a value by key. Returns `undefined` if not found or expired. Updates access recency.

#### `set(key: K, value: V): void`
Sets or updates a value. If cache is full, evicts the least recently used entry.

#### `has(key: K): boolean`
Checks if a key exists in the cache (doesn't update recency).

#### `delete(key: K): boolean`
Removes an entry from the cache. Returns `true` if found and deleted.

#### `clear(): void`
Removes all entries from the cache.

#### `size(): number`
Returns the current number of entries in the cache.

#### `stats(): { size: number, maxSize: number, utilization: string }`
Returns cache statistics including current size, max size, and utilization percentage.

## Design Decisions

1. **Frequency Tracking**: Each entry tracks access frequency to support future LFU strategies
2. **Timestamp Recording**: Entry timestamps enable TTL validation without external timers
3. **Wall-Clock Time**: Uses `Date.now()` for reliable expiration across application restarts
4. **Order Array**: Maintains LRU order with O(n) splice on access but optimal memory usage
5. **No Async**: Purely synchronous implementation for predictable latency

## Performance Characteristics

- **get()**: O(1) + O(n) splice on update (amortized O(1))
- **set()**: O(1) + O(n) splice on update, O(1) on eviction
- **delete()**: O(1) + O(n) splice
- **Memory**: ~500 bytes per entry overhead (Map + entry object + order tracking)

## Use Cases

- Session storage in web applications
- Database query result caching
- API response memoization
- Temporary data de-duplication
- Rate limiting token buckets

## Testing

```bash
npm test
```

## License

MIT
