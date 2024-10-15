import type { CompanyLogoOptions } from '../interfaces';
import type NgwConnector from '@nextgis/ngw-connector';

export async function getCompanyLogo(
  connector: NgwConnector,
  options?: CompanyLogoOptions,
): Promise<HTMLElement | undefined> {
  const settings = await connector.route('pyramid.settings').get({
    query: {
      component: 'pyramid',
    },
  });
  if (settings && settings.company_logo && settings.company_logo.enabled) {
    const anchor = document.createElement('a');
    anchor.style.position = 'absolute';
    anchor.style.bottom = '0';
    anchor.style.right = '0';
    anchor.style.padding = options?.padding ?? '10px';
    anchor.className = 'ngw-map-logo';
    if (options && options.cssClass) {
      anchor.className += ' ' + options.cssClass;
    }
    const img = new Image();
    img.style.maxHeight = '100px';
    img.style.maxWidth = '100px';
    img.src = '';
    try {
      const resp = await connector.route('pyramid.csettings').get();
      const logo = resp.pyramid?.header_logo;
      if (logo) {
        const [mimeType, base64Data] = logo;

        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(blob);
        img.src = imageUrl;
      }
    } catch (er) {
      console.warn(er);
    }

    if (
      settings.company_logo.link !== null &&
      settings.company_logo.link.trim() !== ''
    ) {
      anchor.href = settings.company_logo.link;
      anchor.target = '_blank';
      if (settings.company_logo.link.search(/:\/\/nextgis/) !== -1) {
        img.alt = 'Get your own Web GIS at nextgis.com';
      }
    }
    anchor.appendChild(img);
    return anchor;
  }
}
