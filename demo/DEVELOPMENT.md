# Docker

```bash
docker build -t registry.nextgis.com/code-nextgis:0.14.12 .
docker build -t registry.nextgis.com/code-nextgis:latest .
docker run -it -p 8080:8080 --rm --name code-nextgis-1 registry.nextgis.com/code-nextgis:latest

docker push registry.nextgis.com/code-nextgis:0.14.12
docker push registry.nextgis.com/code-nextgis:latest
```
