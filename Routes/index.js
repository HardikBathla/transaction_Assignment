
const booking = require('./booking.js');
const customer=require('./customer.js');
const admin=require('./admin.js');
 let route = []
 const allRoutes = route.concat(admin,customer,booking);

module.exports= allRoutes;
