import { useToast } from "~/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { namedAction } from "remix-utils/named-action";
import { getValidatedFormData } from "remix-hook-form";
import { redirectWithError, redirectWithSuccess } from "remix-toast";
import {
  useFetcher,
  useParams,
  useRouteLoaderData,
} from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, json } from "@remix-run/node";

import { uploadImage } from "~/lib/server/upload.server";
import { getS3ImageUrl } from "~/lib/utils";
import { updateContact } from "~/lib/server/update.server";
import { type ContactFormData, schema } from "~/lib/schemas/contact";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import { Icon } from "~/components/icons";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Contact } from "~/components/types/contact";
import { NakedUser } from "~/components/types/user";
import { ContactForm } from "~/components/forms/contact";

type RouteLoaderData = {
  user: NakedUser;
  contacts: Contact[];
};

type ActionData = {
  message: string;
  error?: { base64Content?: string };
  success?: { url?: string; path?: string };
};

export default function EditContact() {
  const { id } = useParams();
  const { toast } = useToast();
  const fetcher = useFetcher<ActionData>();
  const inputRef = useRef<HTMLInputElement>(null);

  const routeLoaderData = useRouteLoaderData<RouteLoaderData>(
    "routes/_contacts+/frequent+/_layout"
  );
  if (!routeLoaderData)
    throw new Error("Route loader data is not available");

  const contact = routeLoaderData.contacts.find(
    (contact) => contact.id === id
  );

  const [base64Image, setBase64Image] = useState<string | null>(null);
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!allowedMimeTypes.includes(file.type)) {
        toast({
          title:
            "Unsupported file type. Please upload a JPEG, PNG, or GIF.",
        });
        event.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (base64Image) {
      fetcher.submit(
        { base64Image },
        { method: "post", action: "?/upload" }
      );
    }
  }, [base64Image]);

  useEffect(() => {
    if (fetcher.data?.error || fetcher.data?.success) {
      toast({
        title: fetcher.data.message,
      });
    }
  }, [fetcher.data]);

  let currentImageUrl = contact?.img_path
    ? getS3ImageUrl(contact.img_path)
    : "/profile.png";

  if (fetcher.data?.success?.path) {
    currentImageUrl = getS3ImageUrl(fetcher.data.success.path);
  }

  return (
    <div>
      <div className="flex items-end">
        <Avatar className="h-44 w-44">
          {fetcher.state !== "idle" ? (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
              <Icon name="Lucide/refreshCcw" className="h-5 w-5" />
              <span className="truncate ml-3">Loading..</span>
            </div>
          ) : (
            <AvatarImage src={currentImageUrl} alt="Uploaded" />
          )}

          <AvatarFallback>
            <Icon name="Lucide/refreshCcw" className="h-5 w-5" />
            <span className="truncate ml-3">Loading...</span>
          </AvatarFallback>
        </Avatar>
        <Input
          style={{ display: "none" }}
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
          accept="image/*"
        />
        <Button
          type="button"
          icon="Lucide/circlePlus"
          variant="constructive"
          onClick={() => inputRef.current?.click()}
          className="pr-1 mb-3"
        />
      </div>

      <ContactForm
        userId={routeLoaderData.user.id}
        contact={contact}
        imgPath={fetcher.data?.success?.path || contact?.img_path}
        imgUrl={fetcher.data?.success?.url || contact?.img_url}
      />
    </div>
  );
}

export const action = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  return namedAction(request, {
    async update() {
      const {
        errors,
        data,
        receivedValues: defaultValues,
      } = await getValidatedFormData<ContactFormData>(
        request,
        zodResolver(schema)
      );
      if (errors) return json({ errors, defaultValues });

      const response = await updateContact({
        id: params.id as string,
        imgPath: defaultValues.imgPath,
        imgUrl: defaultValues.imgUrl,
        data,
      });

      if (response.error) {
        return redirectWithError(
          `/frequent/${params.id}`,
          response.message
        );
      } else if (response.success) {
        return redirectWithSuccess("/frequent", response.message);
      } else {
        return json(
          { error: "There was an error updating the contact" },
          {
            status: 500,
          }
        );
      }
    },
    async upload() {
      const formData = await request.formData();
      const base64Image = formData.get("base64Image") as string;

      const response = await uploadImage(base64Image);

      return json(response);
    },
  });
};
