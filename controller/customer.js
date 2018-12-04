let service=require('../service');
let constantMsg=require('../Constants')
let responseSend=require('../Boom')
let jwtDecode = require('jwt-decode');
const jwt =require('jsonwebtoken');
const bcrypt=require('bcrypt');

module.exports={
  /************************************ Create Customer ************************************/
   pushData: async function(req){
try{
      let data = await service.customer.emailCheck(req.payload.emailid);
    if(!data.length){
      let check = await service.customer.phoneCheck(req);
    if(!check.length){
      let create = await service.customer.createCustomer(req);
      return create;
    }else{
     throw constantMsg.errorMessage.eng.phoneNumberExist;
     }
    } else{
     throw constantMsg.errorMessage.eng.emailExist;
      }
  }catch(err){
   console.log(err)
   throw err;
 }


},
/**************************************OTP VERIFY******************************** */
otpVerify: async function(req){
  try{
  let data = await service.customer.emailCheck(req.payload.emailid);
  if(data.length){
   if(data[0].status =='pending'){
    if(data[0].otp == req.payload.otp){
       await service.customer.changeStatus(req.payload.emailid);
      return responseSend.sendSuccess(null,"OTP VERIFIED");
    }
    else{
     return constantMsg.errorMessage.eng.otpNotValid;
    }
  }
 else{
   return constantMsg.errorMessage.eng.otpVerify;
 }
}
else{
  throw constantMsg.errorMessage.eng.emailNotFound;
}
}catch(err){
  throw err;
}
},

/********************************************OTP GENERATOR*********************************8 */
OTPGenerator: async function(req){
try{
  let data= await service.customer.emailCheck(req.payload.emailid);
  if(data.length){
    if(data[0].status=='pending'){
   let send = await service.customer.insertOTP(req);
  let otpData={
    OTP:send
  }
  return responseSend.sendSuccess(null,otpData);
}else{
  return constantMsg.errorMessage.eng.otpVerify;
}
}
else{
  throw constantMsg.errorMessage.eng.emailNotFound;
}
}catch(err){
  throw err;
}
},
/*********************************************************CHECK DATA FOR LOGIN******************************888 */
checkDataForUser: async (payload)=>{
 try{
       let userData = await service.customer.emailCheck(payload.emailid);
       if(userData.length){
         let myPassword=payload.password;
             let hash=userData[0].password;
            let check = await bcrypt.compareSync(myPassword,hash);
            if(check){
             if((userData[0].status=="verified")){
             const privateKey = 'NeverShareYourSecret';
              const token = jwt.sign({ emailid: payload.emailid,role:userData[0].role,customer_id:userData[0].customer_id }, privateKey, { algorithm: 'HS256'} );
              let result={
                username:userData[0].username,
                emailid:userData[0].emailid,
                token:token
              }
              return responseSend.sendSuccess(null,result)
            }
            else{
              return constantMsg.errorMessage.eng.otpNotVerify;
            }
          }
            else{
              throw constantMsg.errorMessage.eng.passwordFailed;
              }
     }
       else{
         throw constantMsg.errorMessage.eng.userNotFound;
       }
}catch(err){
  throw err;
}
},
/********************************************* GET DATA OF CUSTOMER********************************* */
getData: async (token)=>{
  try{
      await service.customer.verifyToken(token);
         let body= jwtDecode(token);
     let user= await service.customer.roleCheck(token);
     if(user.length){
       let check= await service.customer.emailCheck(body.emailid);
       if(check.length){
     const fetch=await service.customer.getCustomer(body.emailid);
     console.log("result",fetch);
      return responseSend.sendSuccess(null,fetch);
    }
    else{
      throw constantMsg.errorMessage.eng.userNotFound;
    }
  }
  else{
    throw constantMsg.errorMessage.eng.unauthorized;
  }
}catch(error){
         return responseSend.sendError(error);
}
}
};
