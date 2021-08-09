export interface LoadScriptOptions {
  crossOrigin?: 'anonymous' | string;
  id?: string;
  async?: boolean;
  defer?: boolean;
  data?: Record<string, string | number | boolean>;
}

export function loadScript(
  src: string,
  options: LoadScriptOptions = {},
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    s.type = 'text/javascript';
    if (options.crossOrigin) {
      s.setAttribute('crossorigin', options.crossOrigin);
      // s.crossOrigin = options.crossOrigin;
    }
    // s.setAttribute('SameSite', 'None');
    // s.referrerPolicy = 'unsafe-url'; // 'same-origin';
    if (options.async) {
      s.setAttribute('async', '');
    }
    if (options.defer) {
      s.setAttribute('defer', '');
    }
    if (options.id) {
      s.setAttribute('id', options.id);
    }
    if (options.data) {
      for (const k in options.data) {
        const dataKey = k.replace(/^data\-/, '')
        s.setAttribute('data-' + dataKey, String(options.data[k]));
      }
    }
    document.head.appendChild(s);
  });
}
