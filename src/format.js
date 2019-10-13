const isNumber = n => /^-?[\d.]+(?:e-?\d+)?$/.test(n);

const getDate = str => str.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g)[0];

const checkIfDate = str =>
  /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i.test(str);

const extractParams = str =>
  str
    .match(/\(([^)]+)\)/)[1]
    .replace(/'/g, '')
    .split(',');

const fixSpace = str => str.replace(/&nbsp;/g, ' ').trim();

module.exports = { isNumber, getDate, checkIfDate, extractParams, fixSpace };
