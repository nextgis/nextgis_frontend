function extractScripts(html: string) {
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
  let match;
  let scriptContents = '';

  while ((match = scriptRegex.exec(html)) !== null) {
    scriptContents += match[1] + '\n';
  }

  return scriptContents;
}

function extractKeysAndValues(scriptContent: string) {
  const blockRegex = /{([\s\S]+?)}/gm;
  let blockMatch;
  const results: string[] = [];

  while ((blockMatch = blockRegex.exec(scriptContent)) !== null) {
    const keyValueRegex = /(\w+):\s*(?:"([^"]*)"|(\S+))/g;
    const matches = [...blockMatch[1].matchAll(keyValueRegex)];

    matches.forEach((match) => {
      const key = match[1];
      const value = match[3];

      if (value) {
        if (value.startsWith('function') || value.includes('=>')) {
          return;
        }
      }

      results.push(key);
      if (value) {
        results.push(value.trim());
      }
    });
  }

  return results;
}

function findSpecificWords(scriptContent: string) {
  const wordRegex = /\.(\w+)/g;
  const matches = scriptContent.match(wordRegex);

  if (matches) {
    return matches.map((match) => match.replace(/^[.]/, ''));
  }

  return [];
}

export function getHtmlSearchTags(html: string) {
  const scriptContents = extractScripts(html);
  const props = extractKeysAndValues(scriptContents);
  const methods = findSpecificWords(scriptContents);
  return [...props, ...methods];
}
