const Boom =require('boom');

module.exports={
errorMessage: {
        eng: {
            emailExist        : Boom.conflict("Email Already exist"),
            phoneNumberExist  : Boom.conflict("phoneNumber Already exist"),
            jobExist          : Boom.conflict("Job Already exist"),
            jobNotExists      : Boom.conflict("Job Not exist of this user"),
            otpNotVerify      : Boom.conflict("OTP is not VERIFIED"),
            otpVerify         : Boom.conflict("OTP is Already VERIFIED"),
            otpNotValid       : Boom.conflict("OTP is not Valid"),
            passwordFailed    : Boom.expectationFailed("Password Not Matched."),
            invalidCredentials: Boom.unauthorized("Invalid Credentials"),
            invalidCredential : Boom.unauthorized("Invalid Token"),
            userNotFound      : Boom.notFound("User Not found"),
            bookingIdNotFound : Boom.notFound("booking_id Not found"),
            emailNotFound     : Boom.notFound("Email Not found"),
            cardNotFound      : Boom.notFound("Card Not found"),
            unauthorized      : Boom.unauthorized("unauthorized token "),
            userExists        : Boom.conflict("User Exists"),
            insufficientFund  : Boom.conflict("Insufficient Fund"),
            ShowErrorMessage  : Boom.expectationFailed("Some error occurred"),
       
        }
    }
  };
