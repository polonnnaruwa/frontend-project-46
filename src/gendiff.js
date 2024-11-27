import parseFile from './parsers.js';

function removeDublicates(array) {
  return [...new Set(array)];
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
      const obj = {
        action: 'removed', 
        property: objectKey, 
        old: object1[objectKey], 
      };
      innerStruct.push(obj);
    }
    if (!Object.hasOwn(object1, objectKey) && Object.hasOwn(object2, objectKey)) {
      const obj = {
        action: 'added',
        property: objectKey,
        new: object2[objectKey],
      };
      innerStruct.push(obj);
    }
    if (Object.hasOwn(object1, objectKey) && Object.hasOwn(object2, objectKey)) {
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
          old: object1[objectKey],
          new: object2[objectKey],
        };
        innerStruct.push(obj);
      }
    }
  });
  return innerStruct;
}

const formater = (innerStruct) => {
  const output = [];
  output.push('{');
  innerStruct.forEach((obj) => {
    if(obj.action === 'added') {
      output.push(`  + ${obj.property}: ${obj.new}`);
    } else if (obj.action === 'removed') {
      output.push(`  - ${obj.property}: ${obj.old}`);
    } else if (obj.action === 'kept') {
      output.push(`    ${obj.property}: ${obj.old}`);
    } else if (obj.action === 'changed') {
      output.push(`  - ${obj.property}: ${obj.old}`);
      output.push(`  + ${obj.property}: ${obj.new}`);
    }
  });
  output.push('}');
  return output.join('\n');
}
export default function genDiff(filepath1, filepath2) {
  const left = parseFile(filepath1);  
  const right = parseFile(filepath2);
  const innerStruct = makeInnerStruct(left, right);
  const output = formater(innerStruct);
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
//   {action: 'kept', property: 'foo', old: 'foo', new: 'foo'},
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
//     ]
//   },
// ]

// removed settings2 : 200
// + follow : false
//   foo : foo
// - baz : old bas new bars
