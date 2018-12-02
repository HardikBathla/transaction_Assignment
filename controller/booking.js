const service=require('../service');
const ConstantMsg = require('../Constants');
const ResponseSend = require('../Boom');
const jwtDecode = require('jwt-decode');
 const stripe = require("stripe")('sk_test_yzle9vRHc8IgcQBhonZB68re');
 const stripePublicKey = require("stripe")('pk_test_vYQRJHg0qpwGLwXLZ6jRuzIt');

module.exports={

  createBooking: async (req)=>{
    try{
        const totalAmount = 1; // Booking Amount
        req.payload.amount = totalAmount;
         await service.customer.verifyToken(req.headers.token);
         let body= jwtDecode(req.headers.token);
          if(req.payload.paymentType == 2){
            var sql = "SELECT `user_id`,`customer_id` FROM `tb_user_credit_card` WHERE `user_id`=? LIMIT 1";
            let tb_user_credit_card_result = await service.admin.executeQuery(sql, [body.customer_id])
                if (!tb_user_credit_card_result && !tb_user_credit_card_result.length) {
                    return ConstantMsg.errorMessage.eng.cardNotFound;
                  }else{
                      /*****************************CARD PAYMENT****************** */
                    let bookingData = await service.booking.createBookingViaStripe(req);
                        return bookingData;
                  }
        }
        else{
            var sql = "SELECT `wallet`,`customer_id` FROM `customer` WHERE `customer_id`=? LIMIT 1";
            let walletData = await service.admin.executeQuery(sql, [body.customer_id])
                if(totalAmount>walletData[0].wallet){
                    return ConstantMsg.errorMessage.eng.insufficientFund;
                }
                else{
                     /***********************************WAllet PAyment *********************************/
                     req.payload.walletAmount = walletData[0].wallet;
                    let bookingData = await service.booking.createBookingViaWallet(req);
                    return bookingData;
                    
                }
    }
}catch(error){
         return ResponseSend.sendError(error);
}
},
 create_token : async function (req, res) {
    try{
    let token = await stripePublicKey.tokens.create({
        card: {
            "number": '4242424242424242',
            "exp_month": '12',
            "exp_year": '2019',
            "cvc": '123'
            // "number": req.payload.cardNumber,
            // "exp_month": req.payload.exp_month,
            // "exp_year": req.payload.exp_year,
            // "cvc": req.payload.cvc
        }
    }) 
    
    let result = await addCreditCard(req.headers.token,token.id)
    return result;
    }catch(error){
        console.log("ERROR",error)
        return error;
}
},
addMoneyToWallet : async function (req, res) {
    try{
    await service.customer.verifyToken(req.headers.token);
    let result = await service.booking.addMoneyToWallet(req)
    return result;
    }catch(error){
        console.log("ERROR",error)
        return error;
}
}
};

 var addCreditCard= async (token,sourced,res)=>{
    let source = sourced;
    await service.customer.verifyToken(token);
    let body= jwtDecode(token);
    var sql = "SELECT `user_id`,`customer_id` FROM `tb_user_credit_card` WHERE `user_id`=?";
       var tb_user_credit_card_result = await service.admin.executeQuery(sql,[body.customer_id]);
        if (tb_user_credit_card_result && !tb_user_credit_card_result.length) {
             result = await createCustomerStripe(source, body.emailid) 
             if(result){
                var sql = "INSERT INTO `tb_user_credit_card`(`user_id`, `card_token`,`customer_id`) VALUES (?,?,?)";
                        await service.admin.executeQuery(sql,[body.customer_id, result.sources.data[0].id, result.id]);
                        return result;
                        }
                    }  
   return "Card Already Added";
 
}
function createCustomerStripe(source,email) {
      return new Promise(function(resolve,reject){
    stripe.customers.create({
        source:source,
        email:email,
        description: "Customer create Hardik"
    }, function (err, result) {
        if (err) {
            result = err;
            result.success = false
            return reject(err);
        } else {
            result.customer = {};
            result.customer.id = result.id;
            result.customer.creditCards = result.sources.data;
            result.success = true;
            return resolve(result);
        }
    });
  })
  }