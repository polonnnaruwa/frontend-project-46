import { readFileSync } from 'node:fs';

function removeDublicates(array) {
  return [...new Set(array)];
}

export default function parse(filepath1, filepath2) {
  const fileContent1 = readFileSync(filepath1, 'utf8');
  const object1 = JSON.parse(fileContent1);
  const fileContent2 = readFileSync(filepath2, 'utf8');
  const object2 = JSON.parse(fileContent2);

  const objectKeys1 = Object.keys(object1);
  const objectKeys2 = Object.keys(object2);

  const objectKeys = removeDublicates(objectKeys1.concat(objectKeys2));
  let output = '{\n';

  objectKeys.sort().forEach((objectKey) => {
    if (Object.hasOwn(object1, objectKey) && !Object.hasOwn(object2, objectKey)) {
      output += `- ${objectKey} : ${object1[objectKey]}\n`;
    }
    if (!Object.hasOwn(object1, objectKey) && Object.hasOwn(object2, objectKey)) {
      output += `+ ${objectKey} : ${object2[objectKey]}\n`;
    }
    if (Object.hasOwn(object1, objectKey) && Object.hasOwn(object2, objectKey)) {
      if (object1[objectKey] === object2[objectKey]) {
        output += `  ${objectKey} : ${object1[objectKey]}\n`;
      } else {
        output += `- ${objectKey} : ${object1[objectKey]}\n`;
        output += `+ ${objectKey} : ${object2[objectKey]}\n`;
      }
    }
  });
  output += '}';
  return output;
}
