# Docker

```bash
docker build -t registry.nextgis.com/code-api-nextgis:latest -f docker/Dockerfile . && docker push registry.nextgis.com/code-api-nextgis:latest
docker run -it -p 8080:80 --rm --name code-api-nextgis registry.nextgis.com/code-api-nextgis:latest
```
