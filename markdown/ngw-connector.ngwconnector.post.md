<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@nextgis/ngw-connector](./ngw-connector.md) &gt; [NgwConnector](./ngw-connector.ngwconnector.md) &gt; [post](./ngw-connector.ngwconnector.post.md)

## NgwConnector.post() method

Shortcut method for send POST request to NGW.

<b>Signature:</b>

```typescript
post<K extends keyof RequestItemsParamsMap>(name: K, options?: RequestOptions<'POST'>, params?: RequestItemsParams<K>): CancelablePromise<PostRequestItemsResponseMap[K]>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  name | K | NGW route name from [routes](https://docs.nextgis.com/docs_ngweb_dev/doc/developer/resource.html#routes) |
|  options | [RequestOptions](./ngw-connector.requestoptions.md)<!-- -->&lt;'POST'&gt; | Request options |
|  params | [RequestItemsParams](./ngw-connector.requestitemsparams.md)<!-- -->&lt;K&gt; | Request item params or query params |

<b>Returns:</b>

CancelablePromise&lt;[PostRequestItemsResponseMap](./ngw-connector.postrequestitemsresponsemap.md)<!-- -->\[K\]&gt;

## Example


```javascript
connector.post('resource.collection', { data: POST_PAYLOAD })
  .then((newResource) => console.log(newResource))
  .catch((error) => console.warn(error));

```
