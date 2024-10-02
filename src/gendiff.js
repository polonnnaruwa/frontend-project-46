import { readFileSync } from 'node:fs';
function removeDublicates(array) {
    return [...new Set(array)]
}

export default function parse(filepath1, filepath2) {
    const fileContent1 = readFileSync(filepath1, 'utf8');
    const object1 = JSON.parse(fileContent1);
    const fileContent2 = readFileSync(filepath2, 'utf8');
    const object2 = JSON.parse(fileContent2);


    const objectKeys1 = Object.keys(object1);
    const objectKeys2 = Object.keys(object2);

    const objectKeys = removeDublicates(objectKeys1.concat(objectKeys2));
    console.log("{");

    for (const objectKey of objectKeys.sort()) {
        if (object1.hasOwnProperty(objectKey) && !object2.hasOwnProperty(objectKey)) {
            console.log(`- ${objectKey} : ${object1[objectKey]}`);
        }
        if (!object1.hasOwnProperty(objectKey) && object2.hasOwnProperty(objectKey)) {
            console.log(`+ ${objectKey} : ${object2[objectKey]}`);
        }
        if (object1.hasOwnProperty(objectKey) && object2.hasOwnProperty(objectKey)) {
            if (object1[objectKey] === object2[objectKey]) {
                console.log(`  ${objectKey} : ${object1[objectKey]}`);
            } else {
                console.log(`- ${objectKey} : ${object1[objectKey]}`);
                console.log(`+ ${objectKey} : ${object2[objectKey]}`);
            }

        } 
    }
    console.log("}");
}

