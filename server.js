const Hapi= require('hapi');
const ResponseSend = require('./Boom')
const Route=require('./Routes');
let control = require("./controller")
const dbscript =  require('./database')
var port = process.env.port || 3000;
const server = new Hapi.Server({port:port,host: 'localhost' });
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');



async function start(){

  try{

        const swaggerOptions = {
            info: {

                    title: 'Project API'
                },

            };

        await server.register([
          Inert,
          Vision,
          {
                plugin: HapiSwagger,
                options: swaggerOptions
            }

        ]);
  server.route(Route);
  await dbscript.sql.handleDisconnect();
  await server.start();
}catch(error){
   throw ResponseSend.sendError(error);
 }
console.log(`Server running at: ${server.info.uri}`);
};
start();
