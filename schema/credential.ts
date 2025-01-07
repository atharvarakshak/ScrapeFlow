import {z} from "zod";

export const creatCredentialSchema = z.object({
    name:z.string().max(30),
    value:z.string().max(500),
    

})

export type creatCredentialSchemaType = z.infer<typeof creatCredentialSchema>