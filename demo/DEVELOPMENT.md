# Demo site development

Run these commands from the `demo` directory.

## Install dependencies

```bash
yarn install
```

## Development

Generate the example catalog and start the site with hot reload:

```bash
yarn start
```

Regenerate `src/examples.json` without starting the site:

```bash
yarn gen:examples
```

The generated file collects README pages and examples from the repository and
should not be edited manually.

## Checks and production build

```bash
yarn lint
yarn format
yarn build
```

## Docker

Build and run the demo image locally:

```bash
docker build -t nextgis-demo-app -f ./docker/Dockerfile .
docker run --rm -p 8080:80 nextgis-demo-app
```

The maintainer deployment command is:

```bash
yarn docker
```
