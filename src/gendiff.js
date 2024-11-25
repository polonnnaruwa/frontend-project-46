import parseFile from './parsers.js';

function removeDublicates(array) {
  return [...new Set(array)];
}

export default function genDiff(filepath1, filepath2) {
  const object1 = parseFile(filepath1);  
  const object2 = parseFile(filepath2);

  const objectKeys1 = Object.keys(object1);
  const objectKeys2 = Object.keys(object2);

  const objectKeys = removeDublicates(objectKeys1.concat(objectKeys2));
  const output = [];
  output.push('{');

  objectKeys.sort().forEach((objectKey) => {
    if (Object.hasOwn(object1, objectKey) && !Object.hasOwn(object2, objectKey)) {
      output.push(`- ${objectKey} : ${object1[objectKey]}`);
    }
    if (!Object.hasOwn(object1, objectKey) && Object.hasOwn(object2, objectKey)) {
      output.push(`+ ${objectKey} : ${object2[objectKey]}`);
    }
    if (Object.hasOwn(object1, objectKey) && Object.hasOwn(object2, objectKey)) {
      if (object1[objectKey] === object2[objectKey]) {
        output.push(`  ${objectKey} : ${object1[objectKey]}`);
      } else {
        output.push(`- ${objectKey} : ${object1[objectKey]}`);
        output.push(`+ ${objectKey} : ${object2[objectKey]}`);
      }
    }
  });
  output.push('}');
  return output.join('\n');
}
