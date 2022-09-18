const dotenv = require('dotenv');
var fs = require('fs');

const values = dotenv.config();
const envs = JSON.stringify(values.parsed)


fs.writeFile('secrets.js', `export default ${envs}`, function (err) {
  if (err) throw err;
  console.log('secrets generated');
});
