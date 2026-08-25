import NgwMap from '@nextgis/ngw-maplibre-gl';

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
  resources: [
    {
      resource: 9018,
      id: 'webmap',
      fit: true,
      adapterOptions: { selectable: true },
    },
  ],
}).then((ngwMap) => {
  const legendContainer = document.getElementById('legend');
  const layer = ngwMap.getLayer('webmap');

  // #1 Fetch and display the legend for all layers
  ngwMap.getLegend().then((legend) => {
    displayLegend(legend, legendContainer, ngwMap);
  });

  // #2 Alternate way to fetch legend for a specific layer
  // Uncomment to use layer specific legend fetching
  // layer.getLegend().then((legend) => {
  //   displayLegend(legend, legendContainer, ngwMap);
  // });

  // #3 Fetching legends for dependent layers
  // Uncomment to process legends for each dependent layer
  // const webmapLayers = layer
  //   .getDependLayers()
  //   .sort((a, b) => b.id - a.id);
  // for (const d of webmapLayers) {
  //   const layerLegend = d.getLegend().then((legend) => {
  //     displayLegend(legend, legendContainer, ngwMap);
  //   });
  // }
});

function displayLegend(legend, legendContainer, webMap) {
  legendContainer.innerHTML = '';

  legend.forEach((layerLegend) => {
    const layerSection = document.createElement('div');
    layerSection.classList.add('layer-section');

    // Add a title for the layer
    const layerTitle = document.createElement('h3');

    layerTitle.textContent =
      webMap.getLayer(layerLegend.layerId).options.name ||
      `Layer ID: ${layerLegend.layerId}`;
    layerSection.appendChild(layerTitle);

    // Iterate through each LegendItem in the current LayerLegend
    layerLegend.legend.forEach((item) => {
      if (item.icon.format === 'png') {
        // Create an image element for the PNG symbol
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${item.icon.data}`;
        img.alt = item.display_name;

        // Create a label for the legend item
        const label = document.createElement('span');
        label.textContent = item.display_name;

        // Append the image and label to the layer section
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('legend-item');
        itemContainer.appendChild(img);
        itemContainer.appendChild(label);

        layerSection.appendChild(itemContainer);
      }
    });

    legendContainer.appendChild(layerSection);
  });
}
