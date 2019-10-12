const axios = require('axios');
const cheerio = require('cheerio');
const { parseTable } = require('@joshuaavalon/cheerio-table-parser');
const querystring = require('querystring');
require('dotenv').config();

const { isNumber, getDate, extractParams, fixSpace } = require('./format');

const uri = process.env.MONGO_URI;

const mongoConnect = uri => {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
    .catch(error => console.error('Mongoose connect error:', error.message));

  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
  });
};

const getUrlData = async url => {
  const { data } = await axios({
    method: 'GET',
    url: url,
    responseType: 'arraybuffer'
  });

  return data.toString('latin1');
};

const postUrlData = async keyword => {
  const form = {
    ID: 20,
    dsVerbete: keyword,
    dsTexto: keyword,
    inEOU: 0,
    Navegar: 'Pesquisar'
  };

  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: querystring.stringify(form),
    url: 'http://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoTramite',
    responseType: 'arraybuffer'
  };
  const { data } = await axios(options);

  return data.toString('latin1');
};

const loadHtml = html =>
  cheerio.load(html, { _useHtmlParser2: true, decodeEntities: false });

// const hasKeyword = (str, keyword) =>
//   str.search(keyword) !== -1 ? true : false;

const WinProjetoTXT = (
  argID,
  argINEspecie,
  argNRProjeto,
  argAAProjeto,
  argVerbete,
  argINObjetoAnexo,
  argNREmenda,
  argNRSubemenda
) => {
  let param = '';
  if (argVerbete) {
    param = '&dsVerbete=' + argVerbete;
  }
  if (argINObjetoAnexo) {
    param += '&inObjetoAnexo=' + argINObjetoAnexo;
  }
  if (argNREmenda) {
    param += '&nrEmenda=' + argNREmenda;
  }
  if (argNRSubemenda) {
    param += '&nrSubemenda=' + argNRSubemenda;
  }
  return (
    'LegisladorWEB.ASP?WCI=ProjetoTexto&ID=' +
    argID +
    '&INEspecie=' +
    argINEspecie +
    '&nrProjeto=' +
    argNRProjeto +
    '&aaProjeto=' +
    argAAProjeto +
    param
  );
};

const searchForKeyWord = async keyword => {
  const body = await postUrlData(keyword);
  const $ = loadHtml(body);

  const divCard = $('div.card');

  Object.keys(divCard).forEach(key => {
    if (!isNumber(key)) {
      return false;
    }
    const divCardValue = divCard[key];
    const titleElement = $(divCardValue).find('h5.card-title');
    const linkElement = $(divCardValue).find('a.btn');

    const title = titleElement.text();
    if (title) {
      const linkAttr = linkElement.attr('onclick');
      const linkParams = extractParams(linkAttr);

      const projectInfo = getProjectInfo(
        `http://www.legislador.com.br/${WinProjetoTXT(...linkParams)}`
      );
    }
  });
};

const getAuthor = (html, $) => {
  if ($(html).find('br').length) {
    $(html)
      .find('br')
      .replaceWith(' ');
    return html.text();
  }

  return html.text();
};

const findEmenta = (html, $) => {
  const test = $(html)
    .find('div.card-header')
    .children('h5.card-title');

  let ementaFound;

  Object.keys(test).forEach(key => {
    const currentTitle = $(test[key]);
    if (currentTitle.text() === 'Ementa') {
      const ementa = currentTitle
        .parent()
        .next()
        .children()
        .first()
        .text();

      ementaFound = fixSpace(ementa);
    }
  });

  return ementaFound;
};

// TODO: clean strings & check cases where name value is: 'Emenda' || 'Emenda : 1'
const getProcedure = html => {
  const table = parseTable(html.first());
  table.shift(); // remove th elements

  const projecObj = table.reduce((acc, current, index) => {
    acc[index] = {
      name: [current[0]][0],
      entry: [current[1]][0],
      deadline: [current[2]][0],
      devolution: [current[3]][0]
    };

    return acc;
  }, {});
  // console.log('projecObj:', projecObj);

  return projecObj;
};

const getProjectInfo = async url => {
  const body = await getUrlData(url);
  const $ = loadHtml(body);

  // - Título principal (ex: Projeto de Lei Ordinária (L) 103/2019)
  // - Data
  // - Situação
  // - Assunto
  // - Autor
  // - Ementa
  // - Trâmite do Projeto (Projeto, Entrada, Prazo, Devolução)

  const divCard = $('div.card');
  const titleE = $(divCard).find('h5.card-title');
  const projectTitle = $(Object.values(titleE)[0]).text();

  const date = getDate(
    $(divCard)
      .find('h6.card-subtitle')
      .text()
  );

  const row = $(divCard).find('dd.col-sm-9');
  const situation = fixSpace($(Object.values(row)[0]).text());
  const subject = $(Object.values(row)[2]).text();
  const author = getAuthor($(Object.values(row)[4]), $);
  const ementa = findEmenta($(divCard), $);
  const procedure = getProcedure($(divCard).find('table.table'), $);

  // console.log('date:', date);
  // console.log('title:', projectTitle);
  // console.log('situation:', situation);
  // console.log('subject:', subject);
  // console.log('author:', author);
  // console.log('ementa:', ementa);
  console.log('procedure:', procedure);
  console.log('=-=-=-=-=-=-=-=-=-=-=-=-= \n');
};

searchForKeyWord('transporte');
