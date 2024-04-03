# Geocoder

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/geocoder) ![version](https://img.shields.io/npm/v/@nextgis/geocoder)

Geocoder is a versatile library designed for intuitive geocoding functionalities.
With an emphasis on ease-of-use, it supports multiple providers to cater to diverse requirements, allowing developers to seamlessly integrate geocoding into their applications.

## Built-in providers

- NgwProvider: Specifically for the NGW vector layer, ideal for applications that rely on NextGIS services.
- NominatimProvider: Utilizes the Nominatim geocoding service, suitable for applications requiring free geocoding services with OpenStreetMap data.

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `Geocoder` will be registered as a global variable.

```html
<script src="../lib/geocoder.global.js"></script>

<script>
  var geocoder = Geocoder.create({
    ...options
  });
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/geocoder"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/geocoder"></script>
```

We recommend linking to a specific version number `/geocoder@[version]`

### In Node.js

```bash
npm install @nextgis/geocoder
```

## Usage

### Basic Usage with NGW Provider

```javascript
import { Geocoder, NgwProvider } from '@nextgis/geocoder';

// Initialize the NGW Provider
const ngwProvider = new NgwProvider({
    connectorOptions: {
        baseUrl: 'https://demo.nextgis.com',
    },
    searchResources: [
        {
            resourceId: 4224,
            limit: 3,
        },
        // ... other resources
    ],
});

// Initialize the geocoder
const geocoder = new Geocoder({ providers: [ngwProvider] });

// Use geocoder.search() for geocoding queries
const searchQuery = "example_search_query"; // Replace with your search term
const geocoderGenerator = geocoder.search(searchQuery);

// Iterate over the geocoder generator to get the search results
for await (const item of geocoderGenerator) {
    console.log(item.text); // Log the item name or description
    item.result().then(({ extent }) => {
        // Use the result's extent or other properties as needed
        console.log(extent);
    });
    break;
}
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_geocoder.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/geocoder`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
