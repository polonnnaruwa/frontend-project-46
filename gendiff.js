const { program } = require('commander');

program
  .option('-V, --version', 'output the version number')
  .option('-h, --help', 'output usage information')
  .description('Compares two configuration files and shows a difference.')
 

program.parse();


const options = program.opts();
console.log(options);

