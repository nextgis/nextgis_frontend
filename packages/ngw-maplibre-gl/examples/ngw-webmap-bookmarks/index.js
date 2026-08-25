import NgwMap from '@nextgis/ngw-maplibre-gl';

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
}).then((ngwMap) => {
  // Create bookmark panel control
  const bookmarksList = document.createElement('div');
  bookmarksList.className = 'bookmarks-panel';
  const bookmarksControl = ngwMap.createControl(
    {
      onAdd: () => bookmarksList,
      onRemove: () => {},
    },
    { bar: true },
  );

  ngwMap.addControl(bookmarksControl, 'top-right');

  // Method to fill bookmark panel
  const appendBookmarkItem = (bookmark) => {
    const elem = document.createElement('div');
    elem.innerHTML = bookmark.name;
    elem.addEventListener('click', () => {
      bookmark.extent().then((bound) => {
        ngwMap.fitBounds(bound);
      });
    });
    bookmarksList.appendChild(elem);
  };

  // Add Webmap resource with bookmarks
  ngwMap.addNgwLayer({ resource: 4226, fit: true }).then((layer) => {
    const webmapLayer =
      /** @type {import('@nextgis/ngw-kit').NgwWebmapLayerAdapter} */ (layer);
    webmapLayer.fetchBookmarks({}).then((bookmarks) => {
      bookmarks.forEach(appendBookmarkItem);
    });
  });
});
