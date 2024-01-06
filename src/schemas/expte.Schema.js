import {z} from "zod"

export const createExpteSchema= z.object({
   // cliente: z.string({
   //    required_error: "El cliente es requerido"
   // }), 
   nroexpte: z.string({
      required_error: "El nro de expediente es requerido"
   })
})