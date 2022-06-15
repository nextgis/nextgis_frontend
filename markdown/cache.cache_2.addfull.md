<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/cache](./cache.md) &gt; [Cache\_2](./cache.cache_2.md) &gt; [addFull](./cache.cache_2.addfull.md)

## Cache\_2.addFull() method

Caching only a non-empty value.

Useful for get or create strategy

<b>Signature:</b>

```typescript
addFull(key: string, valueToSet: CacheValue<V> | (() => CacheValue<V>), props?: CacheMatchProps<O>): CacheValue<V>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  key | string |  |
|  valueToSet | CacheValue&lt;V&gt; \| (() =&gt; CacheValue&lt;V&gt;) |  |
|  props | CacheMatchProps&lt;O&gt; |  |

<b>Returns:</b>

CacheValue&lt;V&gt;

## Example


```javascript
const cache = new Cache();
const getItemFunc = () => fetch(url).then((data) => {
 return data.json(); // undefined
});
const item = await cache.addFull('foo', getItemFunc);
if (!item) {
  await createItem(); // 'New item'
}

// somewhere else in the code
const item = await cache.addFull('foo', getItemFunc).then((resp) => {
  console.log(resp); // 'New item'
})

```
