const NgwUploader = require('../../lib/ngw-uploader.cjs');

const fs = require('fs');
const path = require('path');

async function upload(filename, paint) {
  const file = fs.readFileSync(path.join(__dirname, filename));

  const uploader = new NgwUploader({
    baseUrl: 'https://sandbox.nextgis.com',
    auth: { login: 'administrator', password: 'demodemo' },
  });
  try {
    console.log(`start "${filename}" uploading`);

    const resp = await uploader.uploadVector(
      { file, filename },
      {
        addTimestampToName: true,
        parentId: 0,
        paint,
      },
    );
    console.log(resp);
  } catch (er) {
    console.log(er);
  }
}

upload('buildings.shp.zip', {
  fillColor: 'red',
  strokeColor: '#C400AB',
  opacity: 0.5,
  weight: 2,
});
upload('railway.geojson', {
  color: 'black',
  opacity: 0.8,
  weight: 3,
});
upload('railway_stations.shp.zip', {
  color: 'blue',
  strokeColor: 'white',
  radius: 12,
});
