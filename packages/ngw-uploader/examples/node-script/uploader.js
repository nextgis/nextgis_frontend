const NgwUploader = require('@nextgis/ngw-uploader');
const NgwConnector = require('@nextgis/ngw-connector');
// const NgwUploader = require('../../lib/ngw-uploader.cjs');

const fs = require('fs');
const path = require('path');
const groupKeyname = 'ngw-uploader-node-example-group';
const baseUrl = 'https://sandbox.nextgis.com';

const connector = new NgwConnector({
  baseUrl,
  auth: { login: 'administrator', password: 'demodemo' },
});
const uploader = new NgwUploader({ connector });

async function upload(filename, parentId, paint) {
  const file = fs.readFileSync(path.join(__dirname, filename));

  try {
    console.log(`start "${filename}" uploading`);

    const resp = await uploader.uploadVector(
      { file, name: filename },
      {
        addTimestampToName: true,
        parentId,
        paint,
      },
    );
    console.log(`${baseUrl}/resource/${resp.id}/preview`);
  } catch (er) {
    console.log(er);
  }
}

const uploadLayers = (parentId) => {
  upload('buildings.shp.zip', parentId, {
    fillColor: 'red',
    strokeColor: '#C400AB',
    opacity: 0.5,
    weight: 2,
  });
  upload('railway.geojson', parentId, {
    color: 'black',
    opacity: 0.8,
    weight: 3,
  });
  upload('railway_stations.shp.zip', parentId, {
    color: 'blue',
    strokeColor: 'white',
    radius: 12,
  });
};

connector.getResource(groupKeyname).then((existGroup) => {
  if (existGroup) {
    uploadLayers(existGroup.resource.id);
  } else {
    uploader
      .createGroup({
        parentId: 0,
        displayName: groupKeyname,
        keyname: groupKeyname,
      })
      .then((newGroup) => {
        uploadLayers(newGroup.id);
      });
  }
});
