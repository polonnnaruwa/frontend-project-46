const stylish = (innerStruct, parents = []) => {
    const output = [];
    let prefix = '';
    for (let i = 0; i < parents.length; i++) {
        prefix += '    ';
    }

    
    if (parents.length > 0) {
    } else {
        output.push(`{`);
    }

    innerStruct.forEach((obj) => {
        if (obj.action === 'added') {
            if (Array.isArray(obj.new)) {
                output.push(`${prefix}  + ${obj.property}: {`);
                output.push(stylish(obj.new, parents.concat(obj.property)));
            } else {
                output.push(`${prefix}  + ${obj.property}: ${obj.new}`);
            }

        } else if (obj.action === 'removed') {
            if (Array.isArray(obj.old)) {
                output.push(`${prefix}  - ${obj.property}: {`);
                output.push(stylish(obj.old, parents.concat(obj.property)));
            } else {
                output.push(`${prefix}  - ${obj.property}: ${obj.old}`);
            }
        } else if (obj.action === 'kept') {
            if (Array.isArray(obj.old)) {
                output.push(`${prefix}    ${obj.property}: {`);
                output.push(stylish(obj.old, parents.concat(obj.property)));
            } else {
                output.push(`${prefix}    ${obj.property}: ${obj.old}`);
            }
        } else if (obj.action === 'changed') {
            if (Array.isArray(obj.old)) {
                output.push(`${prefix}  - ${obj.property}: {`);
                output.push(stylish(obj.old, parents.concat(obj.property)));
            } else {
                output.push(`${prefix}  - ${obj.property}: ${obj.old}`);
            }
            if (Array.isArray(obj.new)) {
                output.push(`${prefix}  + ${obj.property}: {`);
                output.push(stylish(obj.new, parents.concat(obj.property)));
            } else {
                output.push(`${prefix}  + ${obj.property}: ${obj.new}`);
            }
        }
    });

    output.push(`${prefix}}`);

    return output.join('\n');
};
export default stylish;
