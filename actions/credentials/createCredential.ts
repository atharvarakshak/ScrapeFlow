"use server";

import { encrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  creatCredentialSchema,
  creatCredentialSchemaType,
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function CreateCredential(form: creatCredentialSchemaType) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const { success, data } = creatCredentialSchema.safeParse(form);

  if (!success) {
    throw new Error("invalid form data");
  }

//   encrypt value

  const encryptedValue = encrypt(data.value);


  const result = await prisma.credential.create({

        data:{
            userId,
            name:data.name,
            value:encryptedValue
        }
  })

  if(!result){
      throw new Error("failed to create credential");
  }

  revalidatePath("/credentials");
}
