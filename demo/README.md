# demo-app (@nextgis/demo-app)

Demo site for NextGIS Frontend libraries

## Install the dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
yarn start
```

### Lint the files

```bash
yarn lint
```

### Format the files

```bash
yarn format
```

### Build the app for production

```bash
yarn build
```

### Docker

```bash
yarn docker

docker build -t nextgis-demo-app -f .\docker\Dockerfile .
docker run -p 8080:80 nextgis-demo-app
```
