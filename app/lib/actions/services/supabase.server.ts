import { UploadHandler } from "@remix-run/node";
import { createClient } from "@supabase/supabase-js";

// I use the ! to mark the env vars as defined but you should use some
// sort of validation to make sure they are!
// This creates our Supabase client, you can do many things with it!
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_TOKEN!
);
// This creates an utility for us to directly work with the bucket when needed
export const supabaseBucket = supabase.storage.from(
  process.env.SUPABASE_BUCKET!
);

export const supabaseUploadHandler =
  (path: string): UploadHandler =>
  async ({ data, filename }) => {
    const chunks = [];
    for await (const chunk of data) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    // If there's no filename, it's a text field and we can return the value directly
    if (!filename) {
      const textDecoder = new TextDecoder();
      return textDecoder.decode(buffer);
    }
    // Otherwise, it's an image and we'll save it to Supabase
    const { data: image, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(path, buffer, { upsert: true });
    if (error || !image) {
      // TODO Add error handling
      console.log(error);
      return null;
    }
    return image.path;
  };

// Used to retrieve the image public url from Supabase
export const getImageUrl = (path: string) => {
  return supabaseBucket.getPublicUrl(path).data.publicUrl;
};
