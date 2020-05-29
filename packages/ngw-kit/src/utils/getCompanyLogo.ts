import NgwConnector from '@nextgis/ngw-connector';
import { CompanyLogoOptions } from '@nextgis/ngw-map';

export async function getCompanyLogo(
  connector: NgwConnector,
  options?: CompanyLogoOptions
): Promise<HTMLElement | undefined> {
  const settings = await connector.get(
    'pyramid.settings',
    { cache: true },
    { component: 'pyramid' }
  );
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
      const src = await connector.get('pyramid.company_logo', {
        responseType: 'blob',
      });
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(src);
      img.src = imageUrl;
    } catch (er) {
      console.log(er);
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
