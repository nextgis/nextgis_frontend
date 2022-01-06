<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/webmap](./webmap.md) &gt; [CreatePopupContentProps](./webmap.createpopupcontentprops.md) &gt; [onClose](./webmap.createpopupcontentprops.onclose.md)

## CreatePopupContentProps.onClose property

The callback function that is called when the popup is closed

<b>Signature:</b>

```typescript
onClose: (cb: PopupOnCloseFunction) => void;
```

## Example


```javascript
createPopupContent: (e) => {
  const onZoomEnd = () => e.close();
  ngwMap.emitter.on('zoomend', onZoomEnd)
  e.onClose(() => {
    ngwMap.emitter.off('zoomend', onZoomEnd)
  })
  return createContentFunc(e);
},
```
