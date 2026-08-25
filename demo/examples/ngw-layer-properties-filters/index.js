import NgwMap from '@nextgis/ngw-leaflet';
const BASE_URL = 'https://demo.nextgis.com';
const RESOURCE_ID = 10048;

const isNumberField = (datatype) =>
  datatype === 'INTEGER' || datatype === 'BIGINT' || datatype === 'REAL';

NgwMap.create({
  baseUrl: BASE_URL,
  target: 'map',
  osm: true,
  controls: ['ZOOM', 'ATTRIBUTION'],
}).then(async (ngwMap) => {
  const resource = await ngwMap.connector.getResourceOrFail(RESOURCE_ID);
  const fields = (resource.feature_layer?.fields || []).filter(
    (x) => x.keyname,
  );

  let layer;

  const panel = document.createElement('div');
  panel.className = 'filter-panel';
  panel.innerHTML = `
    <h3>Layer filter</h3>

    <label>Adapter</label>
    <select id="adapter">
      <option value="TILE">TILE</option>
      <option value="IMAGE">IMAGE</option>
      <option value="GEOJSON">GEOJSON</option>
    </select>

    <label>Field</label>
    <select id="field"></select>

    <label>Operator</label>
    <select id="operator">
      <option value="eq">=</option>
      <option value="ne" selected>!=</option>
      <!--
      <option value="gt">></option>
      <option value="ge">>=</option>
      <option value="lt"><</option>
      <option value="le"><=</option>
      -->
    </select>

    <label>Value</label>
    <input id="value" value="yes" />
  `;

  /** @type {HTMLSelectElement} */
  const adapterEl = panel.querySelector('#adapter');
  /** @type {HTMLSelectElement} */
  const fieldEl = panel.querySelector('#field');
  /** @type {HTMLSelectElement} */
  const operatorEl = panel.querySelector('#operator');
  /** @type {HTMLInputElement} */
  const valueEl = panel.querySelector('#value');

  fields.forEach((field) => {
    const option = document.createElement('option');
    option.value = field.keyname;
    option.textContent = field.display_name || field.keyname;
    if (field.keyname === 'BUILDING') {
      option.selected = true;
    }
    fieldEl.appendChild(option);
  });

  ngwMap.addControl('CONTROL', 'top-right', {
    control: { onAdd: () => panel },
    options: { bar: true },
  });

  function getField() {
    return fields.find((x) => x.keyname === fieldEl.value);
  }

  function getFilter() {
    const field = getField();
    const rawValue = valueEl.value;

    if (!field || rawValue === '') {
      return undefined;
    }

    const value = isNumberField(field.datatype) ? Number(rawValue) : rawValue;

    return /** @type {import('@nextgis/properties-filter').PropertiesFilter} */ ([
      [field.keyname, operatorEl.value, value],
    ]);
  }

  function updateValueType() {
    const field = getField();
    valueEl.type = field && isNumberField(field.datatype) ? 'number' : 'text';
  }

  async function createLayer() {
    if (layer) {
      ngwMap.removeLayer(layer);
    }

    // Recreate layer only when adapter changes
    layer = await ngwMap.addNgwLayer({
      resource: RESOURCE_ID,
      adapter: /** @type {'TILE' | 'IMAGE' | 'GEOJSON'} */ (adapterEl.value),
      fit: true,
    });

    applyFilter();
  }

  function applyFilter() {
    updateValueType();

    // Update only the filter
    if (layer?.propertiesFilter) {
      layer.propertiesFilter(getFilter());
    }
  }

  await createLayer();

  adapterEl.addEventListener('change', createLayer);
  fieldEl.addEventListener('change', applyFilter);
  operatorEl.addEventListener('change', applyFilter);
  valueEl.addEventListener('input', applyFilter);
});
