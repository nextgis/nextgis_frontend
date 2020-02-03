# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.25.0](https://github.com/nextgis/nextgisweb_frontend/compare/v0.24.0...v0.25.0) (2020-02-03)


### Bug Fixes

* **ngw:** ngw webmap resource ordering ([f859ddb](https://github.com/nextgis/nextgisweb_frontend/commit/f859ddbe4e8bfa53c30cd90bef33cc359d81b472))
* **webmap:** not use ordering for layer id ([cd09734](https://github.com/nextgis/nextgisweb_frontend/commit/cd0973490a2c6ca0673bd01059056dd5fd68d866))


### Features

* **util:** move properties filter to utils library ([4099706](https://github.com/nextgis/nextgisweb_frontend/commit/40997068f633faf75f15011721d9aaa5f11343dd))
* **webmap:** add `getBoundsPoly` webmap util ([22cb565](https://github.com/nextgis/nextgisweb_frontend/commit/22cb5654e6a2c2c8b84d32581faed0b293570cc2))
* **webmap:** nesting for propertiesFilter utility ([28cb9ed](https://github.com/nextgis/nextgisweb_frontend/commit/28cb9ed583ec96fec675f8f6c63ec18c1fe030de))
* **webmap:** update PropertiesFilter interface ([c6bb69b](https://github.com/nextgis/nextgisweb_frontend/commit/c6bb69b948f660a0f8a522c8347176baa293380c))


### BREAKING CHANGES

* **util:** Use xport { propertiesFilter } from '@nextgis/utils'; instead of Webmap.utils.propertiesFilter
