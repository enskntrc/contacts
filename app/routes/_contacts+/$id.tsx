import { useState, useCallback } from "react";
import { namedAction } from "remix-utils/named-action";
import { getValidatedFormData } from "remix-hook-form";
import { FileWithPath, useDropzone } from "react-dropzone";

import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { useParams, useRouteLoaderData } from "@remix-run/react";
import { redirectWithError, redirectWithSuccess } from "remix-toast";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import { Contact } from "~/components/types/contact";
import { NakedUser } from "~/components/types/user";
import { ContactForm } from "~/components/forms/contact";
import { ImageCropper } from "~/components/custom/image-cropper";

import { createContactWithImage } from "~/lib/server/create.server";
import { updateContactWithImage } from "~/lib/server/update.server";
import { type ContactFormData, schema } from "~/lib/schemas/contact";

type RouteLoaderData = {
  user: NakedUser;
  contacts: Contact[];
};

export type FileWithPreview = FileWithPath & {
  preview: string;
};

const accept = {
  "image/*": [],
};

export default function EditContact() {
  const { id } = useParams();

  const routeLoaderData = useRouteLoaderData<RouteLoaderData>(
    "routes/_contacts+/_layout"
  );
  if (!routeLoaderData)
    throw new Error("Route loader data is not available");

  const contact = routeLoaderData.contacts.find(
    (contact) => contact.id === id
  );

  const [selectedFile, setSelectedFile] =
    useState<FileWithPreview | null>(null);
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        alert("Selected image is too large!");
        return;
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setSelectedFile(fileWithPreview);
      setDialogOpen(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <div>
      <div className="relative ">
        {selectedFile ? (
          <ImageCropper
            dialogOpen={isDialogOpen}
            setDialogOpen={setDialogOpen}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            croppedImage={croppedImage}
            setCroppedImage={setCroppedImage}
          />
        ) : (
          <Avatar
            {...getRootProps()}
            className="size-36 cursor-pointer ring-offset-2 ring-2 ring-slate-200"
          >
            <input {...getInputProps()} />
            <AvatarImage
              src={contact?.img_url ?? `profile.png`}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
      </div>

      <ContactForm
        userId={routeLoaderData.user.id}
        contact={contact}
        base64Image={croppedImage}
      />
    </div>
  );
}

export const action = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  return namedAction(request, {
    async create() {
      const {
        errors,
        data,
        receivedValues: defaultValues,
      } = await getValidatedFormData<ContactFormData>(
        request,
        zodResolver(schema)
      );
      if (errors) return json({ errors, defaultValues });

      const response = await createContactWithImage({
        userId: defaultValues.userId,
        data,
        base64Image: defaultValues.base64Image,
      });

      if (response.error) {
        return redirectWithError("/new", response.message);
      } else if (response.success) {
        return redirectWithSuccess("/", response.message);
      } else {
        return json(
          { error: "There was an error creating the contact" },
          {
            status: 500,
          }
        );
      }
    },
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

      const response = await updateContactWithImage({
        id: params.id as string,
        data,
        base64Image: defaultValues.base64Image,
      });

      if (response.error) {
        return redirectWithError(`/${params.id}`, response.message);
      } else if (response.success) {
        return redirectWithSuccess("/", response.message);
      } else {
        return json(
          { error: "There was an error updating the contact" },
          {
            status: 500,
          }
        );
      }
    },
  });
};
