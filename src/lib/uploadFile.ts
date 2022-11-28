import { Account } from "@tago-io/sdk";

async function uploadFile(account: Account, account_id: string, user_id: string, filename: string, file: string) {
  const body = { file, filename: `reports/${user_id}/${filename}` };

  await account.files.uploadBase64([{ ...body, public: true }]);
  return `https://api.tago.io/file/${account_id}/${body.filename}`;
}

export { uploadFile };
