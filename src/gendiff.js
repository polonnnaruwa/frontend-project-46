import parseFile from './parsers.js';

function removeDublicates(array) {
  return [...new Set(array)];
}

function isObject(value) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null
}

const makeInnerStruct = (object1, object2) => {
  const objectKeys1 = Object.keys(object1);
  const objectKeys2 = Object.keys(object2);

  const objectKeys = removeDublicates(objectKeys1.concat(objectKeys2));
  const output = [];
  output.push('{');

  const innerStruct = [];
  objectKeys.sort().forEach((objectKey) => {
    if (Object.hasOwn(object1, objectKey) && !Object.hasOwn(object2, objectKey)) {
      if (isObject(object1[objectKey])) {
        const obj = {
          action: 'removed', 
          property: objectKey, 
          old: makeInnerStruct(object1[objectKey], object1[objectKey]),
        };
        innerStruct.push(obj);
        return;
      }
      const obj = {
        action: 'removed', 
        property: objectKey, 
        old: object1[objectKey], 
      };
      innerStruct.push(obj);
    }
    if (!Object.hasOwn(object1, objectKey) && Object.hasOwn(object2, objectKey)) {
      if (isObject(object2[objectKey])) {
        const obj = {
          action: 'added', 
          property: objectKey, 
          new: makeInnerStruct(object2[objectKey], object2[objectKey]),
        };
        innerStruct.push(obj);
        return;
      }
      const obj = {
        action: 'added',
        property: objectKey,
        new: object2[objectKey],
      };
      innerStruct.push(obj);
    }
    if (Object.hasOwn(object1, objectKey) && Object.hasOwn(object2, objectKey)) {

      if (isObject(object1[objectKey]) && isObject(object2[objectKey])) {
        const obj = {
          action: 'kept',
          property: objectKey,
          old: makeInnerStruct(object1[objectKey], object2[objectKey]),
        };
        innerStruct.push(obj);
        return;
      }

      if (object1[objectKey] === object2[objectKey]) {
        const obj = {
          action: 'kept',
          property: objectKey,
          old: object1[objectKey],
        };
        innerStruct.push(obj);
      } else {
        const obj = {
          action: 'changed',
          property: objectKey,
          old: isObject(object1[objectKey]) ? makeInnerStruct(object1[objectKey], object1[objectKey]) : object1[objectKey],
          new: isObject(object2[objectKey]) ? makeInnerStruct(object2[objectKey], object2[objectKey]) : object2[objectKey],
        };
        innerStruct.push(obj);
      }
    }
  });
  return innerStruct;
}

const stylish = (innerStruct, property='', depth=0) => {
  const output = [];
  let prefix = '';
  for (let i = 0; i < depth; i++) {
    prefix += '    ';
  }

  if (property) {
    const newPrefix = prefix.substring(4);
    output.push(`${newPrefix}${property}: {`);
  } else {
    output.push(`${prefix}{`);
  }

  innerStruct.forEach((obj) => {
    if(obj.action === 'added') {
      if (Array.isArray(obj.new)) {
        output.push(stylish(obj.new, `  + ${obj.property}`, depth+1));
      } else {
        output.push(`${prefix}  + ${obj.property}: ${obj.new}`);
      }

    } else if (obj.action === 'removed') {
      if (Array.isArray(obj.old)) {
        output.push(stylish(obj.old, `  - ${obj.property}`, depth+1));
      } else {
        output.push(`${prefix}  - ${obj.property}: ${obj.old}`);
      }
    } else if (obj.action === 'kept') {
      if (Array.isArray(obj.old)) {
        output.push(stylish(obj.old, `    ${obj.property}`, depth+1));
      } else {
        output.push(`${prefix}    ${obj.property}: ${obj.old}`);
      }
    } else if (obj.action === 'changed') {
      if (Array.isArray(obj.old)) {
        output.push(stylish(obj.old, `  - ${obj.property}`, depth+1));
      } else {
        output.push(`${prefix}  - ${obj.property}: ${obj.old}`);
      }
      if (Array.isArray(obj.new)) {
        output.push(stylish(obj.new, `  + ${obj.property}`, depth+1));
      } else {
        output.push(`${prefix}  + ${obj.property}: ${obj.new}`);
      }
    }
  });
  output.push(`${prefix}}`);
  return output.join('\n');
}

const formatters = {
  stylish: stylish,
};

export default function genDiff(filepath1, filepath2, formatter='stylish') {
  const left = parseFile(filepath1);  
  const right = parseFile(filepath2);
  const innerStruct = makeInnerStruct(left, right);
  const formatterFunc = formatters[formatter];
  const output = formatterFunc(innerStruct);
  return output;
}

// {
//   settings2: 200,
//   foo: 'foo',
//   baz: 'bas',
//   zzz: {sss: 'sss'},
//   "group1": {
//     "baz": "bas",
//     "foo": "bar",
//     "nest": {
//       "key": "value"
//     }
//   }
// }

// {
//   follow: false,
//   foo: 'foo',
//   baz: 'bars',
//   zzz: [],
//   "group1": {
//     "foo": "bar",
//     "baz": "bars",
//     "nest": "str"
//   }
// }
// const obj = {
//   action: '...', 
//   property: '...', 
//   old: '...', 
//   new: '...', 
//   children: []
// }

// [
//   {action: '...', property: '...', old: '...', new: '...', children: []}
// ]

// [
//   {action: 'removed', property: 'setting2', old: 200},
//   {action: 'added', property: 'follow', new: false},
//   {action: 'kept', property: 'foo', old: 'foo'},
//   {action: 'changed', property: 'baz', old: 'bas', new: 'bars'},
//   {action: 'changed', property: 'zzz', old: {sss: 'sss'}, new: []},
//   {
//     action: 'kept', 
//     property: 'group', 
//     old: {}, 
//     new: {}, 
//     children: [
//       {action: 'changed', property: 'baz', old: 'bas', new: 'bars'},
//       {action: 'kept', property: 'foo', old: 'foo', new: 'foo'},
//       {action: 'changed', property: 'nest', old: {key: 'value'}, new: 'str'},
//       {action: 'kept', property: 'foo', children: []},
//     ]
//   },
// ]

// removed settings2 : 200
// + follow : false
//   foo : foo
// - baz : old bas new bars
 