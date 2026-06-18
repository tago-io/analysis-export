import { Regions, Resources } from "@tago-io/sdk";

async function createSecret(token: string, region: Regions) {
  const resource = new Resources({ token, region });

  const [secretExists] = await resource.secrets.list({ filter: { key: "ACCOUNT_TOKEN" }, amount: 1 });
  if (secretExists) {
    return "Secret already exists";
  }

  await resource.secrets.create({ key: "ACCOUNT_TOKEN", value: token, tags: [{ key: "account_token", value: "true" }] });
  await resource.secrets.create({ key: "SENDGRID_API_KEY", value: "<SENDGRID_API_KEY>", tags: [{ key: "sendgrid_credentials", value: "true" }] });
  return "Secret created";
}

export { createSecret };
