'use client';
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Layers2Icon, Loader2, ShieldEllipsis } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { createWorkflowSchema } from "@/schema/workflow";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createWorkflowSchemaType } from "@/schema/workflow";
import { createWorkflow } from "@/actions/workflows/createWorkflow";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { creatCredentialSchema, creatCredentialSchemaType } from "@/schema/credential";
import { CreateCredential } from "@/actions/credentials/createCredential";
import { set } from "date-fns";

function CreateCredentialDialog({ triggerText }: { triggerText?: string }) {
  const [open, setOpen] = useState(false);
  const form = useForm<creatCredentialSchemaType>({
    resolver: zodResolver(creatCredentialSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredential,
    onSuccess: () => {
      toast.success("Credential created.", { id: "create-credential" }); 
      form.reset();
      setOpen(false); 
    },
    onError: () => {
      toast.error("failed to create credential", { id: "create-credential" });
    },
  });
  const onSubmit = useCallback(
    (values: creatCredentialSchemaType) => {
      toast.loading("Creating credential...", { id: "create-credential" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={ShieldEllipsis}
          title="Create credential"
          subTitle="Start building your workflow"
        />
        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a descriptive and unique name for credential.
                      This name will be used to identify the credential.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Value
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the value assosiated with this credential.
                      <br /> This value will be encrypted and stored securely.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "SAVE"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default CreateCredentialDialog;
