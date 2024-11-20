import Joi from 'joi'

const Schema = Joi.object({
  id: Joi.string().uuid().required(),
})

const getUserValidator = (params: any) => {
  const { value, error } = Schema.validate(params, {
    abortEarly: false,
  })

  if (error) {
    console.log({
      message: 'Validation error',
      error,
    })

    throw new Error('Validation error on get user')
  }

  return value
}

export default getUserValidator
