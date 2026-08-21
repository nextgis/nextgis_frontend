import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'ini';

const REPOSITORY = 'https://github.com/nextgis/quickmapservices_contrib.git';

const packageDir = fileURLToPath(new URL('..', import.meta.url));
const tempDir = mkdtempSync(join(tmpdir(), 'nextgis-qms-catalog-'));
const repositoryDir = join(tempDir, 'quickmapservices_contrib');

const readIni = (filename) => parse(readFileSync(filename, 'utf8'));

function findFiles(root, name) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);

    if (entry.isDirectory()) {
      return findFiles(path, name);
    }

    return name(entry.name) ? [path] : [];
  });
}

function number(value) {
  const result = Number(value);
  return value !== undefined && value !== '' && Number.isFinite(result)
    ? result
    : undefined;
}

function stringList(value) {
  return typeof value === 'string'
    ? Array.from(value.matchAll(/['"]([^'"]+)['"]/g), (match) => match[1])
    : [];
}

function createService(filename, groups) {
  const ini = readIni(filename);
  const { general = {}, ui = {}, license = {} } = ini;
  const type = general.type?.toLowerCase();
  const group = groups.get(ui.group);

  if (!group || !['tms', 'wms'].includes(type)) {
    return;
  }

  const protocol = ini[type] || {};
  const epsg = number(protocol.epsg_crs_id);

  if (epsg !== undefined && epsg !== 3857) {
    return;
  }

  const service = {
    id: general.id || basename(dirname(filename)),
    type,
    name: ui.alias || general.id,
    group: group.id,
    copyrightText: license.copyright_text || undefined,
    copyrightUrl: license.copyright_link || undefined,
    termsOfUseUrl: license.terms_of_use || undefined,
  };

  if (!protocol.url) {
    return;
  }

  if (type === 'tms') {
    const mirrors = [...new Set(stringList(protocol.mirrors))];
    const sourceMirror =
      mirrors.length > 1
        ? mirrors.find((mirror) => protocol.url.includes(`//${mirror}.`))
        : undefined;
    const url = sourceMirror
      ? protocol.url.replace(
          `//${sourceMirror}.`,
          `//{switch:${mirrors.join(',')}}.`,
        )
      : protocol.url;
    return {
      ...service,
      url,
      minZoom: number(protocol.zmin),
      maxZoom: number(protocol.zmax),
      yOriginTop: protocol.y_origin_top !== '0',
    };
  }

  return {
    ...service,
    url: protocol.url,
    layers: protocol.layers || '',
    params: protocol.params || '',
  };
}

try {
  execFileSync(
    'git',
    ['clone', '--depth', '1', '--branch', 'master', REPOSITORY, repositoryDir],
    { stdio: 'inherit' },
  );

  const groups = new Map();

  for (const filename of findFiles(join(repositoryDir, 'groups'), (name) =>
    name.endsWith('.ini'),
  )) {
    const ini = readIni(filename);
    const id = ini.general?.id || basename(dirname(filename));

    groups.set(id, {
      id,
      name: ini.ui?.alias || id,
      services: [],
    });
  }

  for (const filename of findFiles(
    join(repositoryDir, 'data_sources'),
    (name) => name === 'metadata.ini',
  )) {
    const service = createService(filename, groups);

    if (service) {
      groups.get(service.group).services.push(service);
    }
  }

  const catalog = {
    revision: execFileSync('git', ['-C', repositoryDir, 'rev-parse', 'HEAD'], {
      encoding: 'utf8',
    }).trim(),

    groups: [...groups.values()]
      .filter(({ services }) => services.length)
      .map((group) => ({
        ...group,
        services: group.services.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };

  writeFileSync(
    join(packageDir, 'src', 'catalog.json'),
    `${JSON.stringify(catalog, null, 2)}\n`,
  );
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
