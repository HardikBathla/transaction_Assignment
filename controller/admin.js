let service=require('../service');
let constantMsg=require('../Constants');
let responseSend=require('../Boom')
let jwtDecode = require('jwt-decode');
const jwt =require('jsonwebtoken');
const bcrypt=require('bcrypt');


module.exports={
  /****************************INSERT ADMIN WHEN SERVER STARTS ********************/
                      // CHECK ADMIN EXISTS THEN SKIP OTHERWISE INSERT
   pushDataAdmin: async function(){
   try{
      let emailId = "hardik@gmail.com"
      let data    = await service.admin.emailCheck(emailId);
      if(!data.length){
       await service.admin.createAdmin1();
      return "Created Admin1"
       }
}catch(err){
   throw err;
 }
},
/***************************Check Data(email,password) for login ********************/
                          // Generate token using jwt
  
checkDataForLogin: async (req)=>{
       let userData = await service.admin.emailCheck(req.payload.emailid);
       if(userData.length){
         let myPassword = req.payload.password;
             let hash   = userData[0].password;
            let check   = await bcrypt.compareSync(myPassword,hash);
            if(check){
              const privateKey = 'NeverShareYourSecret';
              const token      = jwt.sign({ emailid: req.payload.emailid,role:userData[0].role,customer_id:userData[0].customer_id }, privateKey, { algorithm: 'HS256'} );
              let result       = {
                username:userData[0].username,
                emailid :userData[0].emailid,
                token   :token
              }
              return responseSend.sendSuccess(null,result)
            }
            else{
              throw constantMsg.errorMessage.eng.passwordFailed;
              }
     }
       else{
         throw constantMsg.errorMessage.eng.userNotFound;
       }
 },
/***************************Get data of admin by passing token ********************/
                          // decode token using jwtdecode

getDataOfAdmin: async (token)=>{
  try{
     await service.admin.verifyToken(token);
     let body  = jwtDecode(token);
     let user  = await service.admin.emailCheck(body.emailid);
     if(user.length){
       let check = await service.admin.roleCheck(token);
       if(check.length){
     delete check[0].password;
     delete check[0].createdAt;
     delete check[0].modifiedAt;
     delete check[0].role;
      return responseSend.sendSuccess(null,check);
}else{
  return constantMsg.errorMessage.eng.unauthorized;
}
  }
  else{
    throw constantMsg.errorMessage.eng.userNotFound;
  }
}catch(error){
         return responseSend.sendError(error);
}
},
};
