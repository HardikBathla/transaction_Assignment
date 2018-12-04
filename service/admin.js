const bcrypt=require('bcrypt');
let constantMsg=require('../Constants')
const jwt =require('jsonwebtoken');
let jwtDecode = require('jwt-decode');
global.P = require('bluebird');

 module.exports ={
   /****************************************** CREATE ADMIN IF NOT EXISTS****************************/
  createAdmin1: async ()=>{
    try{
  let myPassword = "123456";
  let saltRounds=10;
  let salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(myPassword, salt);

  let taskData ={
  username:"hardik",
  emailid: "hardik@gmail.com",
  password: hash,
  phoneNumber:"9671160360",
  address:"Chandigarh",
  createdAt:new Date(),
  modifiedAt:new Date(),
  role:"admin"
  };

   await new Promise(function(resolve, reject) {
 connection.query("INSERT INTO admin SET ?",taskData,function (err, rows, fields){
   if (err) {
               return reject(err);
           }
            resolve(rows);

       });
   });
}catch(err){
throw err;
}
},
/************************************************EMAIL CHECK EXISTS OR NOT****************************** */
emailCheck:async (email)=>{
  try{
   return new Promise(function(resolve, reject) {
    connection.query('SELECT * FROM admin WHERE emailid=?',email,function (err, rows,fields){
       if (err) {
                   return reject(err);
               }
               resolve(rows);
           });
       });
      }catch(err){
        throw err;
      }
   },

   /************************************************ROLE CHECK FOR AUTHORIZATION**********************************8 */
   roleCheck:async (token)=>{
     let body= jwtDecode(token);
      return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM admin WHERE role=? AND emailid=?',[body.role,body.emailid],function (err, rows,fields){
          if (err) {
                      return reject(err);
                  }
                  resolve(rows);
              });
          });
      },
     
     /************************************************ VERIFY TOKEN (CORRECT OR NOT) ***************************/   
   verifyToken : async function(token){
       await jwt.verify(token, 'NeverShareYourSecret',(err)=>{
        if(err){
          throw constantMsg.errorMessage.eng.invalidCredential;
        }
       }) ;
     },
   /******************************************* GENERAL FUNCTION FOR EXECUTING SQL QUERY IN ASYNC MANNNER ***************************/
    executeQuery:async function (sql, variables) {
            try {
              const result = await connection.queryAsync(sql, variables);
              return result;
            } catch (error) {
               console.log(sql,variables,' Execute error > ', error);
            }
          }
         
};
