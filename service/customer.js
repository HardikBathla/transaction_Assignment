const bcrypt=require('bcrypt');
let constantMsg=require('../Constants')
let responseSend=require('../Boom')
let randomize = require('randomatic');
const jwt =require('jsonwebtoken');
let jwtDecode = require('jwt-decode');

 module.exports ={
  createCustomer: async (req)=>{
  let myPassword = req.payload.password;
  let saltRounds=10;
  let salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(myPassword, salt);
  global.code=randomize('0',5);
  let taskData ={
  username: req.payload.username,
  emailid: req.payload.emailid,
  otp:code,
  password: hash,
  status:"pending",
  phoneNumber:req.payload.phoneNumber,
  address:req.payload.address,
  role:"customer",
  createdAt:new Date(),
  modifiedAt:new Date(),
  wallet:0
  };

  await new Promise(function(resolve, reject) {
 connection.query("INSERT INTO customer SET ?",taskData,function (err, rows, fields){
   if (err) {
               return reject(err);
           }
            resolve(rows);

       });
   });
   delete taskData.password;
   return responseSend.sendSuccess(null,taskData);
},

emailCheck:(email,res)=>{
   return new Promise(function(resolve, reject) {
     connection.query('SELECT * FROM customer WHERE emailid=?',email,function (err, rows,fields){
       if (err) {
                   return reject(err);
               }
               resolve(rows);
           });
       });
   },

      insertOTP:async (req)=>{
        global.otp=randomize('0',5);
        let date=new Date();
      await new Promise(function(resolve, reject) {
           connection.query("UPDATE customer SET otp=?, modifiedAt=? WHERE emailid=?",[otp,date,req.payload.emailid],function (err, rows,fields){
             if (err) {
               return reject(err);
                     }
                resolve(rows);
                 });
             });
             return otp;
         },

   phoneCheck:(req,res)=>{
      return new Promise(function(resolve, reject) {
     let phoneNumber= req.payload.phoneNumber;
        connection.query('SELECT * FROM customer WHERE phoneNumber=?',phoneNumber,function (err, rows,fields){
          if (err) {
                      return reject(err);
                  }
                  resolve(rows);
              });
          });
      },
      roleCheck:async (token)=>{
        let body= jwtDecode(token);
        console.log("body",body);
         return new Promise(function(resolve, reject) {
           connection.query('SELECT * FROM customer WHERE role=? AND emailid=?',[body.role,body.emailid],function (err, rows,fields){
             if (err) {
                         return reject(err);
                     }
                     resolve(rows);
                 });
             });
         },

         verifyToken : async function(token){
               await jwt.verify(token, 'NeverShareYourSecret',(err)=>{
                 if(err){
                   throw constantMsg.errorMessage.eng.invalidCredential;
                 }
               }) ;
             },

          
    changeStatus : function(email){
      return new Promise(function(resolve, reject) {
        let date=new Date();
        connection.query("UPDATE customer SET status=?, modifiedAt=? WHERE emailid=?",["verified",date,email],function (err, rows,fields){
          if (err) {
            return reject(err);
                  }
                  console.log(rows);
                  resolve(rows);
              });
          });
      },

        getCustomer:async function(emailid){

          return new Promise(function(resolve, reject) {
            connection.query('SELECT * FROM customer WHERE emailid=?',emailid,function (err, rows,fields){
              if (err) {
                          return reject(err);
                      }
                      resolve(rows);
                  });
              });
          },

};
