# Ngw Connector

Module for interaction with NGW (NextGis Web) server API

## Development

Install dependencies

    npm i

Run server

    npm start

Open browser on http://localhost:8080/examples/ page

!important -  do not open 127.0.0.1 to avoid Access-Control-Allow-Origin not allowed access

## Generate code for a specific API version

    node ./scripts/generate -u [NGW_SERVER_API_URL]

  or

    npm run gen -- -u [NGW_SERVER_API_URL]

Run without params to get current version of base NGW SERVER API
