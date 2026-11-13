export const mapHtml = `
<style>
  * {
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #map {
    width: 700px;
    height: 700px;
  }

  /* Avoid MapLibre's missing CSS canary warning. */
  .maplibregl-canary {
    background-color: rgb(250, 128, 114);
  }
</style>
<div id="map"></div>
`;
