import {z} from 'zod'

export const registerSchema= z.object({
   username: z.string({
      required_error: "El nombre es requerido",
    }),
   email: z.string({
      required_error:'El email es requerido',
   }).email({
      message:'Ingresa un email valido',
   }),
   password: z.string({
      required_error:'El password es requerido',
   })
   .min(7,{
      message:'El password debe tener al menos 7 caracteres'
   })
})

export const loginSchema= z.object({
   email: z.string({
      required_error:'El email es requerido',
   }).email({
      message:'Ingresa un email valido',
   }),
   password: z.string({
      required_error:'El password es requerido',
   })
   .min(7,{
      message:'El password debe tener al menos 7 caracteres'
   })
})
