import { LRUCache } from '../src/index';
import assert from 'assert';

// Test basic get and set
{
  const cache = new LRUCache({ maxSize: 3 });
  cache.set('a', 1);
  cache.set('b', 2);
  
  assert.strictEqual(cache.get('a'), 1, 'Should retrieve set value');
  assert.strictEqual(cache.get('b'), 2, 'Should retrieve another value');
  assert.strictEqual(cache.get('c'), undefined, 'Should return undefined for missing key');
  console.log('✓ Basic get/set tests passed');
}

// Test LRU eviction
{
  const cache = new LRUCache({ maxSize: 2 });
  cache.set('a', 1);
  cache.set('b', 2);
  cache.set('c', 3); // Should evict 'a' (least recently used)
  
  assert.strictEqual(cache.get('a'), undefined, 'LRU item should be evicted');
  assert.strictEqual(cache.get('b'), 2, 'Non-LRU item should still exist');
  assert.strictEqual(cache.get('c'), 3, 'New item should exist');
  console.log('✓ LRU eviction tests passed');
}

// Test recency update
{
  const cache = new LRUCache({ maxSize: 2 });
  cache.set('a', 1);
  cache.set('b', 2);
  cache.get('a'); // Access 'a' to make it most recent
  cache.set('c', 3); // Should evict 'b', not 'a'
  
  assert.strictEqual(cache.get('a'), 1, 'Recently accessed item should remain');
  assert.strictEqual(cache.get('b'), undefined, 'Non-recent item should be evicted');
  console.log('✓ Recency update tests passed');
}

// Test TTL expiration
{
  const cache = new LRUCache({ maxSize: 10, ttl: 100 });
  cache.set('a', 1);
  
  assert.strictEqual(cache.get('a'), 1, 'Item should exist immediately');
  
  setTimeout(() => {
    assert.strictEqual(cache.get('a'), undefined, 'Expired item should return undefined');
    console.log('✓ TTL expiration tests passed');
  }, 150);
}

// Test has method
{
  const cache = new LRUCache({ maxSize: 5 });
  cache.set('key', 'value');
  
  assert.strictEqual(cache.has('key'), true, 'has() should return true for existing key');
  assert.strictEqual(cache.has('missing'), false, 'has() should return false for missing key');
  console.log('✓ has() method tests passed');
}

// Test delete method
{
  const cache = new LRUCache({ maxSize: 5 });
  cache.set('a', 1);
  cache.set('b', 2);
  
  assert.strictEqual(cache.delete('a'), true, 'delete() should return true');
  assert.strictEqual(cache.get('a'), undefined, 'Deleted item should not exist');
  assert.strictEqual(cache.delete('c'), false, 'delete() should return false for missing key');
  console.log('✓ delete() method tests passed');
}

// Test clear method
{
  const cache = new LRUCache({ maxSize: 5 });
  cache.set('a', 1);
  cache.set('b', 2);
  cache.set('c', 3);
  
  cache.clear();
  assert.strictEqual(cache.size(), 0, 'Cache should be empty after clear()');
  assert.strictEqual(cache.get('a'), undefined, 'All items should be gone');
  console.log('✓ clear() method tests passed');
}

// Test size and stats
{
  const cache = new LRUCache({ maxSize: 10 });
  cache.set('a', 1);
  cache.set('b', 2);
  cache.set('c', 3);
  
  assert.strictEqual(cache.size(), 3, 'size() should return correct count');
  
  const stats = cache.stats();
  assert.strictEqual(stats.size, 3, 'stats.size should match');
  assert.strictEqual(stats.maxSize, 10, 'stats.maxSize should match');
  assert(stats.utilization.includes('30'), 'Utilization should be 30%');
  console.log('✓ size() and stats() tests passed');
}

console.log('\n✓ All LRUCache tests passed successfully!');
