export const QMS_CONTROL_LANGUAGES = [
  'en',
  'de',
  'es',
  'fr',
  'it',
  'pt',
  'ru',
] as const;

export type QmsControlLanguage = (typeof QMS_CONTROL_LANGUAGES)[number];

export interface QmsControlMessages {
  title: string;
  open: string;
  close: string;
  searchPlaceholder: string;
  searching: string;
  noResults: string;
  searchFailed: string;
}

interface QmsControlAboutMessages {
  about: string;
  description: string;
  catalog: string;
  close: string;
  contact: string;
  communityForum: string;
  developedBy: string;
  links?: Partial<QmsControlAboutLinks>;
}

interface QmsControlAboutLinks {
  catalog: string;
  contact: string;
  communityForum: string;
}

export const QMS_CONTROL_MESSAGES: Readonly<
  Record<QmsControlLanguage, Readonly<QmsControlMessages>>
> = {
  en: {
    title: 'QuickMapServices',
    open: 'Open NextGIS QMS',
    close: 'Close NextGIS QMS',
    searchPlaceholder: 'Search NextGIS QMS',
    searching: 'Searching…',
    noResults: 'No results',
    searchFailed: 'Search failed',
  },
  de: {
    title: 'QuickMapServices',
    open: 'NextGIS QMS öffnen',
    close: 'NextGIS QMS schließen',
    searchPlaceholder: 'NextGIS QMS durchsuchen',
    searching: 'Suche…',
    noResults: 'Keine Ergebnisse',
    searchFailed: 'Suche fehlgeschlagen',
  },
  es: {
    title: 'QuickMapServices',
    open: 'Abrir NextGIS QMS',
    close: 'Cerrar NextGIS QMS',
    searchPlaceholder: 'Buscar en NextGIS QMS',
    searching: 'Buscando…',
    noResults: 'Sin resultados',
    searchFailed: 'Error de búsqueda',
  },
  fr: {
    title: 'QuickMapServices',
    open: 'Ouvrir NextGIS QMS',
    close: 'Fermer NextGIS QMS',
    searchPlaceholder: 'Rechercher dans NextGIS QMS',
    searching: 'Recherche…',
    noResults: 'Aucun résultat',
    searchFailed: 'Échec de la recherche',
  },
  it: {
    title: 'QuickMapServices',
    open: 'Apri NextGIS QMS',
    close: 'Chiudi NextGIS QMS',
    searchPlaceholder: 'Cerca in NextGIS QMS',
    searching: 'Ricerca…',
    noResults: 'Nessun risultato',
    searchFailed: 'Ricerca non riuscita',
  },
  pt: {
    title: 'QuickMapServices',
    open: 'Abrir NextGIS QMS',
    close: 'Fechar NextGIS QMS',
    searchPlaceholder: 'Pesquisar no NextGIS QMS',
    searching: 'A pesquisar…',
    noResults: 'Sem resultados',
    searchFailed: 'Falha na pesquisa',
  },
  ru: {
    title: 'QuickMapServices',
    open: 'Открыть NextGIS QMS',
    close: 'Закрыть NextGIS QMS',
    searchPlaceholder: 'Поиск в NextGIS QMS',
    searching: 'Поиск…',
    noResults: 'Ничего не найдено',
    searchFailed: 'Ошибка поиска',
  },
};

const QMS_CONTROL_ABOUT_MESSAGES: Readonly<
  Record<QmsControlLanguage, Readonly<QmsControlAboutMessages>>
> = {
  en: {
    about: 'About QMS',
    description:
      'QuickMapServices (QMS) helps you quickly find and add basemaps and geospatial web services from an open community catalog.',
    catalog: 'Discover the catalog and contribute',
    close: 'Close About QMS',
    contact: 'Contact us',
    communityForum: 'Community forum',
    links: {
      catalog: 'https://qms.nextgis.com',
      contact: 'https://nextgis.com/contact',
      communityForum: 'https://community.nextgis.com',
    },
    developedBy: 'Developed by NextGIS.',
  },
  de: {
    about: 'Über QMS',
    description:
      'QuickMapServices (QMS) hilft Ihnen, Grundkarten und räumliche Webdienste aus einem offenen Community-Katalog schnell zu finden und hinzuzufügen.',
    catalog: 'Katalog entdecken und mitwirken',
    close: 'Über QMS schließen',
    contact: 'Kontaktieren Sie uns',
    communityForum: 'Community-Forum',
    developedBy: 'Entwickelt von NextGIS.',
  },
  es: {
    about: 'Acerca de QMS',
    description:
      'QuickMapServices (QMS) le ayuda a encontrar y añadir rápidamente mapas base y servicios web geoespaciales desde un catálogo comunitario abierto.',
    catalog: 'Descubra el catálogo y contribuya',
    close: 'Cerrar Acerca de QMS',
    contact: 'Contáctenos',
    communityForum: 'Foro de la comunidad',
    developedBy: 'Desarrollado por NextGIS.',
  },
  fr: {
    about: 'À propos de QMS',
    description:
      'QuickMapServices (QMS) vous aide à trouver et ajouter rapidement des fonds de carte et des services web géospatiaux depuis un catalogue communautaire ouvert.',
    catalog: 'Découvrez le catalogue et contribuez',
    close: 'Fermer À propos de QMS',
    contact: 'Contactez-nous',
    communityForum: 'Forum de la communauté',
    developedBy: 'Développé par NextGIS.',
  },
  it: {
    about: 'Informazioni su QMS',
    description:
      'QuickMapServices (QMS) consente di trovare e aggiungere rapidamente mappe di base e servizi web geospaziali da un catalogo aperto della comunità.',
    catalog: 'Scopri il catalogo e contribuisci',
    close: 'Chiudi Informazioni su QMS',
    contact: 'Contattaci',
    communityForum: 'Forum della comunità',
    developedBy: 'Sviluppato da NextGIS.',
  },
  pt: {
    about: 'Sobre o QMS',
    description:
      'O QuickMapServices (QMS) ajuda a encontrar e adicionar rapidamente mapas base e serviços Web geoespaciais de um catálogo comunitário aberto.',
    catalog: 'Explore o catálogo e contribua',
    close: 'Fechar Sobre o QMS',
    contact: 'Contacte-nos',
    communityForum: 'Fórum da comunidade',
    developedBy: 'Desenvolvido pela NextGIS.',
  },
  ru: {
    about: 'О QMS',
    description:
      'QuickMapServices (QMS) помогает быстро находить и добавлять базовые карты и геопространственные веб-сервисы из открытого каталога сообщества.',
    catalog: 'Открыть каталог и внести свой вклад',
    close: 'Закрыть окно «О QMS»',
    contact: 'Связаться с нами',
    communityForum: 'Форум сообщества',
    links: {
      contact: 'https://nextgis.ru/contact',
    },
    developedBy: 'Разработано компанией NextGIS.',
  },
};

export function getQmsControlAboutMessages(
  language: QmsControlLanguage,
): Readonly<QmsControlAboutMessages & { links: QmsControlAboutLinks }> {
  const messages = QMS_CONTROL_ABOUT_MESSAGES[language];
  return {
    ...messages,
    links: {
      ...QMS_CONTROL_ABOUT_MESSAGES.en.links,
      ...messages.links,
    } as QmsControlAboutLinks,
  };
}
