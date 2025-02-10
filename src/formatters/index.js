import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
    stylish: stylish,
    plain: plain,
};

const getFormatter = (name) => {
    return formatters[name];
};

export default getFormatter;