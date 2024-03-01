export const mapHtml = `
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Vector paint</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
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

    /*
      Fix to remove WARN: 'This page appears to be missing CSS declarations for Maplibre GL JS...
    */
    .maplibregl-canary {
      background-color: rgb(250, 128, 114)
    }
  </style>
</head>

<body>
  <div id='map'></div>
</body>

</html>
`;
