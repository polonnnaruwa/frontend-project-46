import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import yaml from 'js-yaml';

export default (filePath) => {
  const fileContent = readFileSync(filePath, 'utf8');
  if (extname(filePath) === '.yml' || extname(filePath) === '.yaml')  {
    return yaml.load(fileContent);
  } else {
    return JSON.parse(fileContent);
  };
};
