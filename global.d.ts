declare global {
  interface Window {
    ENV: {
      S3_ENDPOINT: string;
      S3_BUCKET_NAME: string;
    };
  }
}

export {};
