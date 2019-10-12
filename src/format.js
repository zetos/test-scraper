const isNumber = n => /^-?[\d.]+(?:e-?\d+)?$/.test(n);

const getDate = str => str.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g)[0];

const extractParams = str =>
  str
    .match(/\(([^)]+)\)/)[1]
    .replace(/'/g, '')
    .split(',');

const fixSpace = str => str.replace(/&nbsp;/g, ' ').trim();

module.exports = { isNumber, getDate, extractParams, fixSpace };
