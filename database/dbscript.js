
let control = require("../controller")
var sql=require('mysql');
const dbConfig = {
  host: 'localhost',
    user: 'root',
    password:'qwerty',
    database:'transaction'
};
function handleDisconnect() {
  const pool = sql.createPool(dbConfig);
  pool.getConnection((err, connection) => { 
    if (err) {
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("MYSQL CONNECTED")
      global.connection = P.promisifyAll(connection);
      control.admin.pushDataAdmin();
    } 
  });  pool.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect(); 
    } else { 
      throw err;
    }
  });
}

module.exports={
  handleDisconnect: handleDisconnect
  };

