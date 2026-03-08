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
  const { place_id } = event.queryStringParameters || {};
  if (!place_id) return { statusCode: 400, body: JSON.stringify({ error: 'place_id obrigatorio' }) };
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(place_id)}&fields=name,formatted_phone_number,website,opening_hours&language=pt-BR&key=${API_KEY}`;
  try {
    const data = await fetchGoogle(url);
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
