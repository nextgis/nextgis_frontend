import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const docsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(docsDir, 'build');
const markdownDir = path.join(buildDir, 'markdown');
const baseUrl = (
  process.env.NEXTGIS_FRONTEND_DOCS_URL || 'https://code-api.nextgis.com'
).replace(/\/$/, '');

const sections = [
  {
    title: 'NextGIS Web maps and API',
    packages: [
      ['ngw-leaflet', 'Ready-to-use NextGIS Web map based on Leaflet.'],
      ['ngw-ol', 'Ready-to-use NextGIS Web map based on OpenLayers.'],
      [
        'ngw-maplibre-gl',
        'Ready-to-use NextGIS Web map based on MapLibre GL JS.',
      ],
      [
        'ngw-kit',
        'NextGIS Web layer adapters, feature requests, identification, legends, and resource utilities.',
      ],
      [
        'ngw-connector',
        'Map-independent NextGIS Web HTTP client and typed route API.',
      ],
      [
        'ngw-types-loader',
        'Installs deployment-specific @nextgisweb TypeScript declarations.',
      ],
    ],
  },
  {
    title: 'React integration',
    packages: [
      ['react-ngw-leaflet', 'Ready-to-use Leaflet-based React map component.'],
      ['react-ngw-ol', 'Ready-to-use OpenLayers-based React map component.'],
      [
        'react-ngw-maplibre-gl',
        'Ready-to-use MapLibre GL JS-based React map component.',
      ],
      [
        'react-ngw-map',
        'Common React component, context, hooks, layers, and controls for custom adapters.',
      ],
    ],
  },
  {
    title: 'QuickMapServices',
    packages: [
      ['qms-leaflet', 'QMS layers and search control for a native Leaflet map.'],
      ['qms-ol', 'QMS layers and search control for a native OpenLayers map.'],
      [
        'qms-maplibre-gl',
        'QMS layers and search control for a native MapLibre GL JS map.',
      ],
      ['qms-core', 'Map-independent QMS client, catalog, and shared control UI.'],
      ['qms-kit', 'QMS layer adapter for libraries built on WebMap.'],
    ],
  },
  {
    title: 'Library foundations',
    packages: [
      [
        'ngw-map',
        'Framework-independent NextGIS Web map class underlying the ready-to-use maps.',
      ],
      [
        'webmap',
        'Framework-independent map engine, common API, and adapter contracts.',
      ],
    ],
  },
];

function packageMarkdownUrl(name) {
  return `${baseUrl}/markdown/@nextgis/${name}/README.md`;
}

function makeAbsoluteLinks(markdown, sourceUrl) {
  return markdown.replace(/\]\(([^)]+)\)/g, (match, href) => {
    if (/^(?:[a-z]+:|#)/i.test(href)) {
      return match;
    }
    return `](${new URL(href, sourceUrl).href})`;
  });
}

function demoteHeadings(markdown, levels = 2) {
  const prefix = '#'.repeat(levels);
  return markdown.replace(/^(#{1,4}) /gm, `${prefix}$1 `);
}

function buildIndex() {
  const lines = [
    '# NextGIS Frontend',
    '',
    '> TypeScript libraries for building NextGIS Web maps with Leaflet, OpenLayers, MapLibre GL JS, React, and NextGIS QMS.',
    '',
    'Most applications should start with an engine-specific `ngw-*` or `react-ngw-*` package. These packages share the `NgwMap` and `WebMap` APIs. Use `ngw-connector` without a map and generate server-specific route declarations with `ngw-types-loader`.',
    '',
    'Detailed API pages are generated from the TypeScript source. The full overview contains the architecture guide and export indexes for the packages listed below.',
    '',
    '## Architecture and overview',
    '',
    `- [Package architecture](${baseUrl}/markdown/documents/PACKAGES.md): Package selection, inheritance, composition, and API boundaries.`,
    `- [Full LLM overview](${baseUrl}/llms-full.txt): Architecture, usage guides, and export indexes for the main packages.`,
  ];

  for (const section of sections) {
    lines.push('', `## ${section.title}`, '');
    for (const [name, description] of section.packages) {
      lines.push(
        `- [@nextgis/${name}](${packageMarkdownUrl(name)}): ${description}`,
      );
    }
  }

  lines.push(
    '',
    '## Optional',
    '',
    `- [HTML API documentation](${baseUrl}/): Human-readable TypeDoc site.`,
    '- [Live examples](https://code.nextgis.com): Runnable examples for the supported map engines.',
    '- [GitHub repository](https://github.com/nextgis/nextgis_frontend): Source code, package README files, and development history.',
    '- [NextGIS Web HTTP API](https://demo.nextgis.com/doc/api): Server route reference for the public demo deployment.',
    '',
  );

  return lines.join('\n');
}

async function buildFullOverview(index) {
  const parts = [
    '# NextGIS Frontend: full LLM overview',
    '',
    '> Architecture, usage guides, and export indexes for the main NextGIS Frontend packages.',
    '',
    'This file intentionally omits individual API member pages to keep the context manageable. Follow the absolute links in each package index for detailed methods, parameters, interfaces, and types.',
    '',
    '## Documentation index',
    '',
    demoteHeadings(index, 2),
  ];

  const architecturePath = path.join(markdownDir, 'documents', 'PACKAGES.md');
  const architectureUrl = `${baseUrl}/markdown/documents/PACKAGES.md`;
  const architecture = await fs.readFile(architecturePath, 'utf8');
  parts.push(
    '',
    '## Package architecture',
    '',
    demoteHeadings(makeAbsoluteLinks(architecture, architectureUrl)),
  );

  for (const section of sections) {
    parts.push('', `## ${section.title}`);
    for (const [name] of section.packages) {
      const readmePath = path.join(
        markdownDir,
        '@nextgis',
        name,
        'README.md',
      );
      const readme = await fs.readFile(readmePath, 'utf8');
      parts.push(
        '',
        `### @nextgis/${name}`,
        '',
        demoteHeadings(makeAbsoluteLinks(readme, packageMarkdownUrl(name))),
      );
    }
  }

  return `${parts.join('\n')}\n`;
}

const index = buildIndex();
const fullOverview = await buildFullOverview(index);

await Promise.all([
  fs.writeFile(path.join(buildDir, 'llms.txt'), index, 'utf8'),
  fs.writeFile(path.join(buildDir, 'llms-full.txt'), fullOverview, 'utf8'),
]);
