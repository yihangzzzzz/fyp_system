const PORT = 3500;
const sql = require('mssql');
const { ConnectionPool } = require('mssql')
// const server = 'DESKTOP-VN9PRPU\\SQLEXPRESS';
const server = 'YIHANG\\SQLEXPRESS';
// const server = 'MDPADMIN\\SQLEXPRESS';
// const mongodbURL = 
//     'mongodb+srv://fypinventorysystem:Blackpink12%40@fyp-inventory-system.4oowh.mongodb.net/inventory_management?retryWrites=true&w=majority&appName=fyp-inventory-system';
// const mssqlURL = 
//     'Server=localhost\\SQLEXPRESS;Database=master;Trusted_Connection=True';
const sqlConfigSW = {
    user: 'testuser',
    password: '1234',
    server: server,
    database: 'software_inventory',
    driver: 'msnodesqlv8',
    options: { trustedConnection: false, encrypt: false },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
  };
  
  const sqlConfigHW = {
    user: 'testuser',
    password: '1234',
    server: server,
    database: 'hardware_inventory',
    driver: 'msnodesqlv8',
    options: { trustedConnection: false, encrypt: false },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
  };
  
  // Create connection pools for each
  const poolSWPromise = new sql.ConnectionPool(sqlConfigSW).connect().then(pool => {
    console.log('Connected to Software Inventory DB');
    return pool;
  });
  
  const poolHWPromise = new sql.ConnectionPool(sqlConfigHW).connect().then(pool => {
    console.log('Connected to Hardware Inventory DB');
    return pool;
  });
  
module.exports = {
    PORT,
    poolHWPromise,
    poolSWPromise
    // mongodbURL,
    // mssqlURL
};