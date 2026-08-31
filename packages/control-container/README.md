# Control Container

![version](https://img.shields.io/npm/v/@nextgis/control-container)

`@nextgis/control-container` is a universal library for creating and managing map controls layout.

It provides a flexible system for placing controls in map corners, creating grouped toolbars, nested panels, and switchable controls.

The library can be used standalone with any map engine and also serves as the foundation for framework-specific integrations:

- Leaflet: `@nextgis/leaflet-control-container`
- MapLibre GL JS: `@nextgis/maplibre-gl-control-container`
- OpenLayers: `@nextgis/ol-control-container`

This allows using the same control layout patterns and APIs across different map engines.

```text
╭───────────────────────────────────────────╮
│ top-left                        top-right │
│                   MAP                     │
│ bottom-left                  bottom-right │
╰───────────────────────────────────────────╯
```

## Installation

```bash
npm install @nextgis/control-container
```

## Import

```javascript
import ControlContainer, {
  createButtonControl,
  createControl,
  createControlContainer,
  createToggleControl,
} from '@nextgis/control-container';
```

## Basic usage

```javascript
const controlContainer = new ControlContainer({
  map,
});

controlContainer.addTo('#map');
```

## Positions

Available positions:

- `top-left`
- `top-right`
- `bottom-left`
- `bottom-right`

```javascript
controlContainer.append('<div>Top right</div>', 'top-right');
```

## Add HTML content

```javascript
controlContainer.append(
  '<div class="map-label">Map tools</div>',
  'top-right',
);
```

```javascript
const element = document.createElement('div');
element.textContent = 'Custom element';

controlContainer.append(element, 'top-right');
```

## Order controls

The `order` option controls the order of controls in the same position or panel.

```javascript
controlContainer.append('<div>First</div>', 'top-right', 0);
controlContainer.append('<div>Second</div>', 'top-right', 10);
```

For controls, pass `order` in the third argument.

```javascript
controlContainer.addControl(firstControl, 'top-right', {
  order: 0,
});

controlContainer.addControl(secondControl, 'top-right', {
  order: 10,
});
```

## Margin

Controls are attached to the map edge by default. Controls created with
`bar: true` use the standard outer offset automatically.
Set `margin: false` to keep a bar control attached to the map edge. This also
works for button and toggle controls.

```javascript
const panel = createControl(
  {
    onAdd() {
      return undefined;
    },

    onRemove() {},
  },
  {
    bar: true,
    margin: false,
  },
);
```

## Custom control

A control is an object with an `onAdd` method. The method returns an HTML element.

```javascript
const customControl = {
  onAdd() {
    const container = document.createElement('div');
    container.textContent = 'Custom control';
    return container;
  },

  onRemove() {},
};

controlContainer.addControl(customControl, 'bottom-right');
```

## Button control

Use `createButtonControl` for simple button controls.

```javascript
const button = createButtonControl({
  title: 'Action',
  html: 'Run',
  onClick() {
    console.log('Clicked');
  },
});

controlContainer.addControl(button, 'top-left');
```

## Panels

Use `createControl` to create a panel for other controls.

A panel can be registered with an `id` when it is added to the control container. After that, other controls can be placed inside it with `{ inside: id }`.

```javascript
const panel = createControl(
  {
    onAdd() {
      return undefined;
    },

    onRemove() {},
  },
  {
    orientation: 'vertical',
    gap: 6,
    margin: true,
  },
);

controlContainer.addControl(panel, 'top-right', {
  id: 'tools-panel',
  order: 20,
});
```

Then add controls inside the panel.

```javascript
const button = createButtonControl({
  title: 'Button',
  html: 'Button',
  onClick() {
    console.log('Button clicked');
  },
});

controlContainer.addControl(button, { inside: 'tools-panel' }, {
  order: 10,
});
```

## Panel orientation

```javascript
const horizontalPanel = createControl(
  {
    onAdd() {
      return undefined;
    },

    onRemove() {},
  },
  {
    orientation: 'horizontal', // 'vertical'
    gap: 0,
  },
);

controlContainer.addControl(horizontalPanel, 'top-right', {
  id: 'orientated-panel',
  order: 10,
});
```

## Switch controls

Switch controls allow only one active control in the same group and target container.

```javascript
const select = createToggleControl({
  html: {
    on: 'Select on',
    off: 'Select',
  },
  switch: 'tools',
  onClick(status) {
    console.log(status);
  },
});

const edit = createToggleControl({
  html: {
    on: 'Edit on',
    off: 'Edit',
  },
  switch: 'tools',
  onClick(status) {
    console.log(status);
  },
});

controlContainer.addControl(select, 'top-left');
controlContainer.addControl(edit, 'top-left');
```

## Switch controls inside a panel

```javascript
const panel = createControl(
  {
    onAdd() {
      return undefined;
    },

    onRemove() {},
  },
  {
    orientation: 'vertical',
    gap: 4,
  },
);

controlContainer.addControl(panel, 'top-right', {
  id: 'switch-panel',
});

const identify = createToggleControl({
  html: {
    on: 'Identify on',
    off: 'Identify',
  },
  switch: 'panel-tools',
});

const measure = createToggleControl({
  html: {
    on: 'Measure on',
    off: 'Measure',
  },
  switch: 'panel-tools',
});

controlContainer.addControl(identify, { inside: 'switch-panel' }, {
  order: 10,
});

controlContainer.addControl(measure, { inside: 'switch-panel' }, {
  order: 20,
});
```

## Independent switch groups

Use different `switch` names for independent groups.

```javascript
const draw = createToggleControl({
  html: 'Draw',
  switch: 'edit-tools',
});

const erase = createToggleControl({
  html: 'Erase',
  switch: 'edit-tools',
});

const info = createToggleControl({
  html: 'Info',
  switch: 'view-tools',
});
```

## `disableOnSecondClick`

```javascript
const measure = createToggleControl({
  html: {
    on: 'Measure on',
    off: 'Measure',
  },
  switch: 'tools',
  disableOnSecondClick: true,
});
```

## Switch events

```javascript
panel.onSwitchChange((event) => {
  console.log(event.group);
  console.log(event.status);
  console.log(event.activeControl);
});
```

## Async toggle action

```javascript
const asyncControl = createToggleControl({
  html: {
    on: 'Enabled',
    off: 'Disabled',
  },
  switch: 'layers',
  async onClick(status) {
    await Promise.resolve(status);
  },
});
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/control-container`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
