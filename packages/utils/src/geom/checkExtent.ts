import type { LngLatBoundsArray } from './interfaces';

export function checkExtent(extent: number[]): extent is LngLatBoundsArray {
  const [minLon, minLat, maxLon, maxLat] = extent;

  // Check if coordinates are in the correct order
  const isOrderValid = minLon < maxLon && minLat < maxLat;

  if (!isOrderValid) {
    console.log('Error: The extent coordinates are not in the correct order.');
    console.log(
      `Received extent: [${minLon}, ${minLat}, ${maxLon}, ${maxLat}]`,
    );

    // Create a valid array with corrected order
    const correctedExtent = [
      Math.min(minLon, maxLon),
      Math.min(minLat, maxLat),
      Math.max(minLon, maxLon),
      Math.max(maxLat, minLat),
    ];

    console.log(`Expected order: [${correctedExtent.join(', ')}]`);
  }

  // Check if the coordinates are within valid ranges
  const isValidLon = minLon >= -180 && maxLon <= 180;
  const isValidLat = minLat >= -90 && maxLat <= 90;

  if (!isValidLon || !isValidLat) {
    console.log(
      'Warning: The coordinates may not be within valid geographic ranges.',
    );
  }

  // Return true only if all checks pass
  return isOrderValid && isValidLon && isValidLat;
}
