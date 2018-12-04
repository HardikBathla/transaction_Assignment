const Joi=require('joi');
const Control=require('../controller');
module.exports=[
  /***************************************** ADMIN LOGIN*****************************/
{   method:'POST',
     path:'/admin/login',
   config:{
             description: 'Post the details of Admin',
             notes: 'Post the details.',
             tags: ['api'],
           plugins:{
               'hapi-swagger':{
                 payloadType:'form'
               }
             },
           validate: {
               payload: {
                   emailid: Joi.string().email().min(6).max(30).error(new Error('email is not valid')).required(),
                   password: Joi.string().min(5).max(20).error(new Error('password is not valid')).required()
              }
          },
     handler:async function(req,res){
      const response =await Control.admin.checkDataForLogin(req);
      return response;
    }
}
},

  /******************** MYPROFILE *************************/
  {   method:'GET',
     path:'/admin/myProfile',
     config:{
       description: 'Get the details of Admin',
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
      const response = await Control.admin.getDataOfAdmin(req.headers.token);
      return response;
    }
  },

  
];
