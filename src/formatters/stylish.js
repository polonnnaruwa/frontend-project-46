const stylish = (innerStruct, parents = []) => {
    const output = [];
    let prefix = '';
    for (let i = 0; i < parents.length; i++) {
        prefix += '    ';
    }
  
    if (!parents.length) {
        output.push(`{`);
    }

    innerStruct.forEach((obj) => {
        const propertyAdded = `${prefix}  + ${obj.property}`;
        const propertyRemoved = `${prefix}  - ${obj.property}`;
        const propertyKept = `${prefix}    ${obj.property}`;

        if (obj.action === 'added') {
            if (Array.isArray(obj.new)) {
                output.push(`${propertyAdded}: {`);
                output.push(stylish(obj.new, parents.concat(obj.property)));
            } else {
                output.push(`${propertyAdded}: ${obj.new}`);
            }

        } else if (obj.action === 'removed') {
            if (Array.isArray(obj.old)) {
                output.push(`${propertyRemoved}: {`);
                output.push(stylish(obj.old, parents.concat(obj.property)));
            } else {
                output.push(`${propertyRemoved}: ${obj.old}`);
            }
        } else if (obj.action === 'kept') {
            if (Array.isArray(obj.old)) {
                output.push(`${propertyKept}: {`);
                output.push(stylish(obj.old, parents.concat(obj.property)));
            } else {
                output.push(`${propertyKept}: ${obj.old}`);
            }
        } else if (obj.action === 'changed') {
            if (Array.isArray(obj.old)) {
                output.push(`${propertyRemoved}: {`);
                output.push(stylish(obj.old, parents.concat(obj.property)));
            } else {
                output.push(`${propertyRemoved}: ${obj.old}`);
            }
            if (Array.isArray(obj.new)) {
                output.push(`${propertyAdded}: {`);
                output.push(stylish(obj.new, parents.concat(obj.property)));
            } else {
                output.push(`${propertyAdded}: ${obj.new}`);
            }
        }
    });

    output.push(`${prefix}}`);

    return output.join('\n');
};
export default stylish;
