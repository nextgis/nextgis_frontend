import { qmsCatalog } from './catalog';
import { QmsClient } from './QmsClient';
import {
  getQmsControlAboutMessages,
  QMS_CONTROL_MESSAGES,
} from './QmsControlMessages';

import type {
  QmsCatalog,
  QmsCatalogService,
  QmsSearchService,
} from './interfaces';
import type {
  QmsControlLanguage,
  QmsControlMessages,
} from './QmsControlMessages';

import './QmsControl.css';

export type {
  QmsControlLanguage,
  QmsControlMessages,
} from './QmsControlMessages';
export {
  QMS_CONTROL_LANGUAGES,
  QMS_CONTROL_MESSAGES,
} from './QmsControlMessages';

export type QmsControlItem =
  | { source: 'qms'; service: QmsSearchService }
  | { source: 'catalog'; service: QmsCatalogService };

export interface QmsControlElementOptions {
  lang?: QmsControlLanguage;
  limit?: number;
  search?: boolean;
  catalog?: boolean;
  messages?: Partial<QmsControlMessages>;
  className?: string;
  catalogData?: QmsCatalog;
  closeOnSelect?: boolean;
  onSelect?: (item: QmsControlItem) => Promise<void>;
}

export class QmsControlElement {
  readonly element: HTMLDivElement;
  onSelect?: QmsControlElementOptions['onSelect'];

  private readonly _catalog?: HTMLElement;
  private readonly _language: QmsControlLanguage;
  private readonly _closeOnSelect: boolean;
  private readonly _limit: number;
  private readonly _messages: QmsControlMessages;
  private readonly _panel: HTMLDivElement;
  private readonly _results: HTMLDivElement;
  private readonly _toggle: HTMLButtonElement;
  private _abort?: AbortController;
  private _selectedItemKey?: string;
  private _timer?: ReturnType<typeof setTimeout>;

  constructor(options: QmsControlElementOptions = {}) {
    const searchEnabled = options.search !== false;
    const catalogEnabled = options.catalog !== false;
    const language = options.lang || 'en';
    this._language = QMS_CONTROL_MESSAGES[language] ? language : 'en';
    this._closeOnSelect = options.closeOnSelect === true;
    this._limit = options.limit ?? 10;
    this._messages = {
      ...QMS_CONTROL_MESSAGES[this._language],
      ...options.messages,
    };
    this.onSelect = options.onSelect;

    this.element = document.createElement('div');
    this.element.className = `nextgis-qms-control${
      options.className ? ` ${options.className}` : ''
    }`;
    this.element.lang = this._language;

    this._toggle = document.createElement('button');
    this._toggle.className = 'nextgis-qms-control__toggle';
    this._toggle.type = 'button';
    this._toggle.setAttribute('aria-label', this._messages.open);
    this._toggle.setAttribute('aria-expanded', 'false');

    this._panel = document.createElement('div');
    this._panel.className = 'nextgis-qms-control__panel';
    this._panel.hidden = true;

    const close = document.createElement('button');
    close.className = 'nextgis-qms-control__close';
    close.type = 'button';
    close.textContent = '×';
    close.setAttribute('aria-label', this._messages.close);

    const header = document.createElement('div');
    header.className = 'nextgis-qms-control__header';
    const title = document.createElement('strong');
    title.className = 'nextgis-qms-control__title';
    title.textContent = this._messages.title;
    header.append(title, close);
    this._panel.append(header);

    if (searchEnabled) {
      const input = document.createElement('input');
      input.className = 'nextgis-qms-control__input';
      input.type = 'search';
      input.placeholder = this._messages.searchPlaceholder;
      input.setAttribute('aria-label', input.placeholder);
      input.addEventListener('input', () => this._scheduleSearch(input.value));
      this._panel.append(input);
    }

    this._results = document.createElement('div');
    this._results.className = 'nextgis-qms-control__results';
    this._results.hidden = true;
    this._panel.append(this._results);

    if (catalogEnabled) {
      this._catalog = this._createCatalog(options.catalogData || qmsCatalog);
      this._panel.append(this._catalog);
    }

    const about = document.createElement('button');
    about.className = 'nextgis-qms-control__about';
    about.type = 'button';
    about.textContent = getQmsControlAboutMessages(this._language).about;

    const footer = document.createElement('div');
    footer.className = 'nextgis-qms-control__footer';
    footer.append(about);
    this._panel.append(footer);

    const aboutDialog = this._createAboutDialog();

    this.element.append(this._toggle, this._panel, aboutDialog);
    this._toggle.addEventListener('click', () => this.open());
    close.addEventListener('click', () => this.close());
    about.addEventListener('click', () => aboutDialog.showModal());
  }

  open(): void {
    this._toggle.hidden = true;
    this._toggle.setAttribute('aria-expanded', 'true');
    this._panel.hidden = false;
  }

  close(): void {
    this._panel.hidden = true;
    this._toggle.hidden = false;
    this._toggle.setAttribute('aria-expanded', 'false');
  }

  private _createCatalog(catalog: QmsCatalog): HTMLElement {
    const element = document.createElement('div');
    element.className = 'nextgis-qms-control__catalog';
    for (const group of catalog.groups) {
      if (!group.services.length) {
        continue;
      }
      const folder = document.createElement('details');
      folder.className = 'nextgis-qms-control__group';
      const title = document.createElement('summary');
      const titleText = document.createElement('span');
      titleText.className = 'nextgis-qms-control__group-title';
      titleText.textContent = group.name;
      title.append(titleText);
      folder.append(title);
      for (const service of group.services) {
        folder.append(
          this._createServiceButton(service.name, {
            source: 'catalog',
            service,
          }),
        );
      }
      element.append(folder);
    }
    return element;
  }

  private _createServiceButton(
    label: string,
    item: QmsControlItem,
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'nextgis-qms-control__service';
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => this._select(item));
    return button;
  }

  private _createAboutDialog(): HTMLDialogElement {
    const messages = getQmsControlAboutMessages(this._language);
    const dialog = document.createElement('dialog');
    dialog.className = 'nextgis-qms-control__about-dialog';

    const close = document.createElement('button');
    close.className = 'nextgis-qms-control__about-close';
    close.type = 'button';
    close.textContent = '×';
    close.setAttribute('aria-label', messages.close);
    close.addEventListener('click', () => dialog.close());

    const title = document.createElement('strong');
    title.className = 'nextgis-qms-control__about-title';
    title.textContent = 'QuickMapServices';

    const description = document.createElement('p');
    description.textContent = messages.description;

    const links = document.createElement('div');
    links.className = 'nextgis-qms-control__about-links';
    for (const [label, href] of [
      [messages.catalog, messages.links.catalog],
      [messages.contact, messages.links.contact],
      [messages.communityForum, messages.links.communityForum],
    ]) {
      const link = document.createElement('a');
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = label;
      links.append(link);
    }

    const developedBy = document.createElement('p');
    developedBy.className = 'nextgis-qms-control__about-developed-by';
    developedBy.textContent = messages.developedBy;

    dialog.append(close, title, description, links, developedBy);
    return dialog;
  }

  private _scheduleSearch(search: string): void {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._abort?.abort();
    search = search.trim();
    if (search.length < 3) {
      this._results.hidden = true;
      if (this._catalog) {
        this._catalog.hidden = false;
      }
      return;
    }
    if (this._catalog) {
      this._catalog.hidden = true;
    }
    this._results.hidden = false;
    this._results.textContent = this._messages.searching;
    this._timer = setTimeout(() => {
      this._search(search);
    }, 300);
  }

  private async _search(search: string): Promise<void> {
    const abort = new AbortController();
    this._abort = abort;
    try {
      const client = new QmsClient();
      const services = await Promise.all(
        (['tms', 'wms'] as const).map((type) =>
          client.searchServices(search, {
            type,
            limit: this._limit,
            signal: abort.signal,
          }),
        ),
      );
      if (this._abort !== abort) {
        return;
      }
      this._results.replaceChildren(
        ...services
          .flat()
          .map((service) =>
            this._createServiceButton(
              `${service.name} (${service.type.toUpperCase()})`,
              { source: 'qms', service },
            ),
          ),
      );
      if (!this._results.childElementCount) {
        this._results.textContent = this._messages.noResults;
      }
    } catch {
      if (!abort.signal.aborted) {
        this._results.textContent = this._messages.searchFailed;
      }
    }
  }

  private async _select(item: QmsControlItem): Promise<void> {
    const onSelect = this.onSelect;
    if (!onSelect) {
      return;
    }
    const itemKey = `${item.source}:${item.service.id}`;
    if (itemKey === this._selectedItemKey) {
      return;
    }
    this._selectedItemKey = itemKey;
    try {
      await onSelect(item);
      if (this._closeOnSelect) {
        this.close();
      }
    } catch (error) {
      if (itemKey === this._selectedItemKey) {
        this._selectedItemKey = undefined;
      }
      throw error;
    }
  }
}
