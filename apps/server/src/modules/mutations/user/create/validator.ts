import Joi from 'joi'

const Schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
})

const createUserValidator = (params: any) => {
  const { value, error } = Schema.validate(params, {
    abortEarly: false,
  })

  if (error) {
    console.log({
      message: 'Validation error',
      error,
    })

    throw new Error('Validation error on create user')
  }

  return value
}

export default createUserValidator
