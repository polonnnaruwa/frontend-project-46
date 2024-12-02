#!/usr/bin/env node
import { program } from 'commander';
import genDiff from '../src/gendiff.js';

program
  .option('-V, --version', 'output the version number')
  .option('-h, --help', 'output usage information')
  .option('-f, --formatter <formatter>', 'output formatter', 'stylish')
  .description('Compares two configuration files and shows a difference.')
  .argument('<filepath1>', 'file path 1')
  .argument('<filepath2>', 'file path 2')
  .action((filepath1, filepath2, options) => {
    const text = genDiff(filepath1, filepath2, options.formatter);
    console.log(text);
  });

program.parse();
