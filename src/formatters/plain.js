const formatValue = (value) => {
    if (typeof value === 'string') {
        return `'${value}'`;
    }
    if (Array.isArray(value)) {
        return '[complex value]';
    }
    return String(value);
}

const plain = (innerStruct, parents = []) => {
    const output = [];
    const prefix = (parents.length === 0) ? '' : parents.join('.') + '.';


    innerStruct.forEach((obj) => {
        if (obj.action === 'added') {
            output.push(`Property '${prefix}${obj.property}' was added with value: ${formatValue(obj.new)}`);
        } else if (obj.action === 'removed') {
            output.push(`Property '${prefix}${obj.property}' was removed`)
        } else if (obj.action === 'kept') {
            if (Array.isArray(obj.old)) {
                output.push(plain(obj.old, parents.concat(obj.property)));
            }
        } else if (obj.action === 'changed') {
            output.push(`Property '${prefix}${obj.property}' was updated. From ${formatValue(obj.old)} to ${formatValue(obj.new)}`);
        }
    });
    return output.join('\n');
};

export default plain;