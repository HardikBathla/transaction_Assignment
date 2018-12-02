const Joi=require('joi');
const Control=require('../controller');
 module.exports=[
/******************** SIGNUP *************************/
{   method:'POST',
     path:'/booking/createBooking',
   config:{
     description: 'Post the details of booking',
     notes: 'post job details of booking',
     tags: ['api'],
   plugins:{
     //'hapiAuthorization': {role: 'ADMIN','USER'},
       'hapi-swagger':{
         payloadType:'form'
       }
     },
          validate: {
              headers:Joi.object({
              'token':Joi.string().required()
            }).unknown(),

            payload: {
              pickUp: Joi.string().alphanum().min(5).max(20).error(new Error('pickUp is not valid')).required(),
              dropAt:Joi.string().alphanum().max(20).error(new Error('dropAt is not valid')).required(),
              paymentType:Joi.number().required().description(' 1-WALLET 2-CARD'),   
            }
          }
      },
       handler:async function(req,res){
       const response =await Control.booking.createBooking(req);
       return response;
    }
},


/******************** DELETE JOB *************************/
{   method:'PUT',
    path:'/booking/cancelBooking',
     config:{
      description: 'Cancel the booking',
      notes: 'Cancel the booking by passing token',
      tags: ['api'],
    plugins:{
        'hapi-swagger':{
          headers:'form',
          payloadType:'form'
        }
      },
           validate: {
               headers:Joi.object({
               'token':Joi.string().required()
             }).unknown(),
             payload: {
                 booking_id: Joi.string().alphanum().min(1).max(10).error(new Error('booking_id is not valid')).required()
               }
           }
         },
    handler:async function(req,res){
    const response = await Control.booking.cancelBooking(req);
    return response;
  }
},

{   method:'POST',
    path:'/Stripe/createCustomerOnStripe',
     config:{
      description: 'create token',
      notes: 'generate token',
      tags: ['api'],
    plugins:{
        'hapi-swagger':{
          headers:'form',
          payloadType:'form'
        }
      },
           validate: {
               headers:Joi.object({
               'token':Joi.string().required()
             }).unknown(),
             payload: {
              // cardNumber: Joi.string().alphanum().min(16).max(16).error(new Error('card number is not valid')).required(),
              // cvc:Joi.string().alphanum().max(3).error(new Error('cvc is not valid')).required(),
              // exp_year:Joi.string().required().description(' Expiration Year').error(new Error('exp_year is not valid')), 
              // exp_month:Joi.string().min(1).max(2).required().description(' Expiration Month').error(new Error('exp_month is not valid')),
            }
           }
         },
    handler:async function(req,res){
    const response = await Control.booking.create_token(req);
   // console.log("Response",response)
    return response;
  }
}


];
