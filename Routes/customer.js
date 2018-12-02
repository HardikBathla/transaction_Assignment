const Joi=require('joi');
const Control=require('../controller');
 module.exports=[
/******************** SIGNUP *************************/
{   method:'POST',
     path:'/user/signup',

    config:{

       description: 'Post the details of user',
       notes: 'Post the details',
       tags: ['api'],
       plugins:{
         'hapi-swagger':{
           payloadType:'form'
         }
       },

          validate: {
              payload: {
                  username: Joi.string().min(5).max(20).error(new Error('username is not valid')).required(),
                  emailid: Joi.string().email().min(5).max(20).error(new Error('Email is not valid')).required(),
                  password: Joi.string().min(5).max(20).error(new Error('password is not valid')).required(),
                  countryCode:Joi.string().min(2).max(10).error(new Error('countryCode is not valid')).required(),
                  phoneNumber:Joi.string().min(10).max(20).error(new Error('phoneNumber is not valid')).required(),
                  address: Joi.string().min(5).max(100).error(new Error('address is not valid')).required()

        }
      }
          },

      handler:async function(req,res){
      const response =await Control.customer.pushData(req);
      return response;
    }
  },
/******************** LOGIN *************************/
{   method:'POST',
     path:'/user/login',
   config:{
             description: 'Post the details of user',
             notes: 'Post the details.',
             tags: ['api'],
           plugins:{
               'hapi-swagger':{
                 payloadType:'form'
               }
             },
           validate: {
               payload: {
                   emailid: Joi.string().email().min(5).max(20).error(new Error('email is not valid')).required(),
                   password: Joi.string().min(5).max(20).error(new Error('password is not valid')).required()
              }
          },
     handler:async function(req,res){
      const response =await Control.customer.checkData(req.payload);
      return response;
    }
}
},

  /******************** MYPROFILE *************************/
  {   method:'GET',
     path:'/user/myProfile',
     config:{
       description: 'Get the details of user',
       notes: 'Get my profile by passing token',
       tags: ['api'],
     plugins:{
         'hapi-swagger':{
           headers:'form'
         }
       },
            validate: {
                headers:Joi.object({
                'token':Joi.string().required()
              }).unknown()
                }
            },

      handler:async function(req,res){
      const response = await Control.customer.getData(req.headers.token);
      return response;
    }
  },
/******************** OTP VERIFY *************************/
{   method:'POST',
   path:'/user/OTPVerify',
   config:{
     description: 'Verify the account',
     notes: 'Get my profile by passing token',
     tags: ['api'],
   plugins:{
       'hapi-swagger':{
         headers:'form',
         payloadType:'form'
       }
     },
        validate:{
          payload:{
            emailid: Joi.string().email().min(5).max(20).error(new Error('email is not valid')).required(),
              otp: Joi.string().min(5).error(new Error('otp is not valid')).required()
                  }
          }
        },

    handler:async function(req,res){

    const response = await Control.customer.otpVerify(req);
    return response;
  }
},
/******************** OTP GENERATOR *************************/
{   method:'POST',
   path:'/user/OTPGenerator',
   config:{
     description: 'Generate OTP',
     notes: 'Get my profile by passing token',
     tags: ['api'],
   plugins:{
       'hapi-swagger':{
         headers:'form',
         payloadType:'form'
        }
     },
        validate:{
          payload:{
          emailid: Joi.string().email().min(5).max(20).error(new Error('email is not valid')).required()
                  }
          }
        },

    handler:async function(req,res){
    const response = await Control.customer.OTPGenerator(req);
    return response;
  }
},
/******************** ADD MONEY TO WALLET *************************/
{   method:'POST',
     path:'/user/addMoneyToWallet',
   config:{
             description: 'Post the details of user',
             notes: 'Post the details.',
             tags: ['api'],
           plugins:{
               'hapi-swagger':{
                 payloadType:'form'
               }
             },
           validate: {
               payload: {
                   amount: Joi.number().error(new Error('amount is number')).required(),
              },
              headers:Joi.object({
                'token':Joi.string().required()
              }).unknown()
          },
     handler:async function(req,res){
      const response =await Control.booking.addMoneyToWallet(req);
      return response;
    }
}
}



  ]
