# Documentation build

```bash
yarn build
```

The build creates the human-readable TypeDoc site in `build`, Markdown API
pages in `build/markdown`, and the LLM entry points `build/llms.txt` and
`build/llms-full.txt`.

Set `NEXTGIS_FRONTEND_DOCS_URL` when the documentation is published at another
origin. It defaults to `https://code-api.nextgis.com`.

## Docker

```bash
docker build -t harbor.nextgis.net/frontend/code-api:latest -f docker/Dockerfile . && docker push harbor.nextgis.net/frontend/code-api:latest
docker run -it -p 8080:80 --rm --name code-api-nextgis harbor.nextgis.net/frontend/code-api:latest
```
