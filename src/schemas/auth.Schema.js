import {z} from 'zod'

export const registerSchema= z.object({
   email: z.string({
      required_error:'Email es requerido'
   }),
   password: z.string({
      required_error:'Password es requerido',
   })
   .min(7,{
      message:'El password debe tener al menos 7 caracteres'
   })
})

export const loginSchema= z.object({
   email: z.string({
      required_error:'Email es requerido',
   }).email({
      message:'Email invalido',
   }),
   password: z.string({
      required_error:'Password es requerido',
   })
   .min(7,{
      message:'El password debe tener al menos 7 caracteres'
   })
})
