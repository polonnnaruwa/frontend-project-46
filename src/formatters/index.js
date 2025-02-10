import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatters = {
    stylish: stylish,
    plain: plain,
    json: json,
};

const getFormatter = (name) => {
    return formatters[name];
};

export default getFormatter;