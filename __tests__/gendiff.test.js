import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import genDiff from '../src/gendiff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('genDiff json', () => {
    const file1path = getFixturePath('file1.json');
    const file2path = getFixturePath('file2.json');
    const expectedResult = readFile('result');

    const actualResult = genDiff(file1path, file2path);
    expect(actualResult).toBe(expectedResult);
});

test('genDiff yaml', () => {
    const file1path = getFixturePath('file1.yml');
    const file2path = getFixturePath('file2.yml');
    const expectedResult = readFile('result');

    const actualResult = genDiff(file1path, file2path);
    expect(actualResult).toBe(expectedResult);
});

test('genDiff plain', () => {
    const file1path = getFixturePath('file1.json');
    const file2path = getFixturePath('file2.json');
    const expectedResult = readFile('plain-result.txt');

    const actualResult = genDiff(file1path, file2path, 'plain');
    expect(actualResult).toBe(expectedResult);
})