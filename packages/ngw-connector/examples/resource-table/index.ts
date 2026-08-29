import NgwConnector from '@nextgis/ngw-connector';

const keyname = 'eat-here';
const table = document.getElementById('table') as HTMLTableElement;
const connector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com',
});
connector.getResourceId(keyname).then((id) => {
  connector.get('resource.item', null, { id }).then((item) => {
    if (!item.feature_layer) {
      throw new Error(`Resource ${id} is not a feature layer`);
    }
    const fields = item.feature_layer.fields;
    let str = '<caption>' + item.resource.display_name + '</caption>';
    str += '<thead><tr>';
    fields.forEach((field) => {
      if (field.grid_visibility) {
        str += '<th>' + field.display_name + '</th>';
      }
    });
    str += '</tr></thead>';
    connector
      .get('feature_layer.feature.collection', null, {
        id,
        limit: 10,
        fields: fields
          .map((x) => {
            return x.keyname;
          })
          .join(','),
      })
      .then((store) => {
        str += '<tbody>';
        store.forEach((row) => {
          str += '<tr>';
          fields.forEach((field) => {
            if (field.grid_visibility) {
              str += '<td>' + row.fields[field.keyname] + '</td>';
            }
          });
          str += '</tr>';
        });
        str += '</tbody>';
        table.innerHTML = str;
      });
  });
});
