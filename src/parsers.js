import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

export default (filePath) => {
  const fileContent = readFileSync(filePath, 'utf8');
  if (filePath.endsWith(".yml"))  {
    return yaml.load(fileContent);
  } else {
    return JSON.parse(fileContent);
  };
};
