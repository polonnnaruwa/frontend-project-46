const fileContent1 = readFileSync(filepath1, 'utf8');
  const fileContent2 = readFileSync(filepath2, 'utf8');
  let object1;
  let object2;
  if (filepath1.endsWith(".yml"))  {
    object1 = yaml.load(fileContent1);
  } else {
    object1 = JSON.parse(fileContent1);
  };
  if (filepath2.endsWith(".yml"))  {
    object2 = yaml.load(fileContent2);
  } else {
    object2 = JSON.parse(fileContent2);
  };