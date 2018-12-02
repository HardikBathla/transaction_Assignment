let jwtDecode = require('jwt-decode');
const stripe = require("stripe")('sk_test_yzle9vRHc8IgcQBhonZB68re');
 
 module.exports ={
  createBookingViaWallet: async (req)=>{
    try{
  let body= jwtDecode(req.headers.token);
   let taskData ={
  customer_id:body.customer_id,
  pickUp:req.payload.pickUp,
  dropAt:req.payload.dropAt,
  payment_type:req.payload.paymentType,
  amount:req.payload.amount,
  payment_status:"pending",
  createdAt:new Date(),
  modifiedAt:new Date()
  };
  connection.beginTransaction(async function(err) {
    if (err) { throw err; }
  await new Promise(function(resolve, reject) {
    connection.query("INSERT INTO booking SET ?",taskData,function (err, rows, fields){
   if (err) {
    return connection.rollback(function() {
               return reject(err);
           })
          }

            resolve(rows);

       });
   });
   let walletLeftAmount = req.payload.walletAmount - req.payload.amount ;
   await new Promise(function(resolve, reject) {
    connection.query("UPDATE customer SET `WALLET` = ? WHERE `customer_id` = ?",[walletLeftAmount,body.customer_id],function (err, rows, fields){
      if (err) {
        return connection.rollback(function() {
                   return reject(err);
               })
              }
    
                resolve(rows);
     
            });
        });
        await new Promise(function(resolve, reject) {
          connection.query("UPDATE booking SET `payment_status` = ? WHERE `customer_id` = ?",["paid",body.customer_id],function (err, rows, fields){
            if (err) {
              return connection.rollback(function() {
                         return reject(err);
                     })
                    }
          
                      resolve(rows);
           
                  });
              });

        connection.commit(function(err) {
          if (err) {
            return connection.rollback(function() {
              throw err;
            });
          }
        })
})
return "Booking Created";
  }catch(err){
  throw err;
}
},
createBookingViaStripe: async (req)=>{
  try{
let body= jwtDecode(req.headers.token);
 let taskData ={
customer_id:body.customer_id,
pickUp:req.payload.pickUp,
dropAt:req.payload.dropAt,
payment_type:req.payload.paymentType,
amount:req.payload.amount,
payment_status:"pending",
createdAt:new Date(),
modifiedAt:new Date()
};
connection.beginTransaction(async function(err) {
  if (err) { throw err; }
await new Promise(function(resolve, reject) {
  connection.query("INSERT INTO booking SET ?",taskData,function (err, rows, fields){
 if (err) {
  return connection.rollback(function() {
             return reject(err);
         })
        }

          resolve(rows);

     });
 });
 await new Promise(function(resolve, reject) {
  connection.query(" SELECT * FROM tb_user_credit_card WHERE user_id=?",body.customer_id,function (err, rows, fields){
 if (err) {
  return connection.rollback(function() {
             return reject(err);
         })
        }
        resolve(rows);
          stripe.charges.create({
            amount: req.payload.amount,
            currency: 'usd',
            description: 'pay for booking hardik',
            customer: rows[0].customer_id,
            card:rows[0].card_token ,
          }, (err, charge)=>{
          if(err)
          {
            return connection.rollback(function() {
              return reject(err);
          })
         }
         else{
           console.log("Payment Success..............",charge)
         }
          })
     });
 });

      await new Promise(function(resolve, reject) {
        connection.query("UPDATE booking SET `payment_status` = ? WHERE `customer_id` = ?",["paid",body.customer_id],function (err, rows, fields){
          if (err) {
            return connection.rollback(function() {
                       return reject(err);
                   })
                  }
        
                    resolve(rows);
         
                });
            });

      connection.commit(function(err) {
        if (err) {
          return connection.rollback(function() {
            throw err;
          });
        }
      })
})
return "Booking Created";
}catch(err){
throw err;
}
},
addMoneyToWallet: async (req)=>{
  try{
let body= jwtDecode(req.headers.token);
connection.beginTransaction(async function(err) {
  if (err) { throw err; }
 await new Promise(function(resolve, reject) {
  connection.query(" SELECT * FROM tb_user_credit_card WHERE user_id=?",body.customer_id,function (err, rows, fields){
 if (err) {
  return connection.rollback(function() {
             return reject(err);
         })
        }
        resolve(rows);
          stripe.charges.create({
            amount: req.payload.amount,
            currency: 'usd',
            description: 'add money to wallet hardik',
            customer: rows[0].customer_id,
            card:rows[0].card_token ,
          }, (err, charge)=>{
          if(err)
          {
            return connection.rollback(function() {
              return reject(err);
          })
         }
         else{
           console.log("Payment Success..............",charge)
         }
          })
     });
 });
 
 await new Promise(function(resolve, reject) {
  connection.query("SELECT * FROM customer WHERE `customer_id` = ?",[body.customer_id],function (err, rows, fields){
    if (err) {
      return connection.rollback(function() {
                 return reject(err);
             })
            }
            req.payload.walletAmount = rows[0].wallet;
              resolve(rows);

   
          });
      });

      await new Promise(function(resolve, reject) {
        totalWalletAmount = req.payload.walletAmount + req.payload.amount;
        connection.query("UPDATE customer SET `wallet` = ? WHERE `customer_id` = ?",[totalWalletAmount,body.customer_id],function (err, rows, fields){
          if (err) {
            return connection.rollback(function() {
                       return reject(err);
                   })
                  }
        
                    resolve(rows);
         
                });
            });

      connection.commit(function(err) {
        if (err) {
          return connection.rollback(function() {
            throw err;
          });
        }
      })
})
return "Money added to wallet";
}catch(err){
throw err;
}
}
};
