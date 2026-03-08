const https = require('https');

const API_KEY = 'AIzaSyChMvYy67xyCHxygI--M6GuehqDLdjASDI';

function fetchGoogle(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

exports.handler = async (event) => {
  const { query, pagetoken } = event.queryStringParameters || {};

  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?language=pt-BR&region=br&key=${API_KEY}`;
  if (pagetoken) url += `&pagetoken=${encodeURIComponent(pagetoken)}`;
  else if (query) url += `&query=${encodeURIComponent(query)}`;
  else return { statusCode: 400, body: JSON.stringify({ error: 'query obrigatório' }) };

  try {
    const data = await fetchGoogle(url);
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
