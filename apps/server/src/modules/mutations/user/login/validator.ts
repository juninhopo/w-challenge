import Joi from 'joi'

const Schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const loginUserValidator = (params: any) => {
  const { value, error } = Schema.validate(params, {
    abortEarly: false,
  })

  if (error) {
    console.log({
      message: 'Validation error',
      error,
    })

    throw new Error('Validation error on login user')
  }

  return value
}

export default loginUserValidator
