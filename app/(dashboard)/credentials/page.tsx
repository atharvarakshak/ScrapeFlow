

import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreateCredentialDialog from "./_components/createCredentialDialog";
import { format } from "path";
import { formatDistanceToNow } from "date-fns";
import DeleteCredentialDialog from "./_components/DeleteCredentialDialog";

function CredentialsPage() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Manage Your Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialDialog />
      </div>
      <div className="h-full py-6 space-y-8 "> 
        <Alert>
          <ShieldIcon className="h-4 w-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Your credentials are encrypted and stored securely.
          </AlertDescription>
        </Alert>

        <Suspense fallback={
            <Skeleton className="h-[300px] w-full" />
        }>

        <UserCredentials/>
        </Suspense>
      </div>
    </div>
  );
}

export default CredentialsPage; 


async function UserCredentials() {  

    const credentials = await GetCredentialsForUser();

    if(!credentials) {
       return  <div>Something went wrong</div>
    }

    if(credentials.length === 0) {
        return <Card className="w-full p-4">
            <div className="flex flex-col items-center gap-4 justify-center">
                <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
                    <ShieldOffIcon size={40} className="stroke-primary" />
                </div>
                <div className="flex flex-col gap-1 text-center ">
                    <p className="text-bold ">No credentials created yet</p>
                    <p className="text-sm text-muted-foreground">Click the button to create you first credentials</p>
                </div>
                <CreateCredentialDialog triggerText="Create your first credential" />
            </div>
        </Card>
    }
    return <div className="flex gap-2 flex-wrap ">
        {credentials.map((credentials)=>{

            const createdAt = formatDistanceToNow(credentials.createdAt, { addSuffix: true });
            return (
                <Card key={credentials.id} className="w-full p-4 flex justify-between" >
                    <div className="flex gap-2 items-center">
                        

                    <div className="rounded-full bg-primary/10 w-8 h-8  flex items-center justify-center ">
                        <div><LockKeyholeIcon size={18} className="stroke-primary"/></div>
                    </div>
                    <div>
                        <p className="font-bold">{credentials.name}</p>
                        <p className="text-xs text-muted-foreground">{createdAt}</p>
                    </div>
                    </div>
                    <DeleteCredentialDialog name={credentials.name}  />
                </Card>
            );
        })
        }
    </div>
}


