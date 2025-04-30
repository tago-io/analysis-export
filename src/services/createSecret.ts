import { Resources } from "@tago-io/sdk";
import { Regions } from "@tago-io/sdk/lib/regions";

async function createSecret(token: string, region: Regions) {
  const resource = new Resources({ token, region });

  const [secretExists] = await resource.secrets.list({ filter: { key: "ACCOUNT_TOKEN" }, amount: 1 });
  if (secretExists) {
    return "Secret already exists";
  }

  await resource.secrets.create({ key: "ACCOUNT_TOKEN", value: token, tags: [{ key: "account_token", value: "true" }] });
  return "Secret created";
}

export { createSecret };
