// validate middleware for validation
export const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);

    next();
  } catch (error) {
    const allMassage = "FIll the input properly";
   
    console.log("sdfsfd",error.errors.map((err) => err));
    
    const extraDetails = error.errors.map((err) => err.message);
    const status = 422;
    console.log("validate ERROR ", allMassage);
    console.log("validate ERROR ", extraDetails);
    // console.log(req.body);

    const err = {
      statusCode: status,
      message: allMassage,
      extraDetails,
    };
    next(err);
  }
};

