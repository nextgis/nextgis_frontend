# Docker

```bash
docker build -t harbor.nextgis.net/frontend/code-api:latest -f docker/Dockerfile . && docker push harbor.nextgis.net/frontend/code-api:latest
docker run -it -p 8080:80 --rm --name code-api-nextgis harbor.nextgis.net/frontend/code-api:latest
```
