import { Resources } from "@tago-io/sdk";

async function createSecret(token: string) {
  const resource = new Resources({ token });

  const [secretExists] = await resource.secrets.list({ filter: { key: "ACCOUNT_TOKEN" }, amount: 1 });
  if (secretExists) {
    return "Secret already exists";
  }

  await resource.secrets.create({ key: "ACCOUNT_TOKEN", value: token, tags: [{ key: "account_token", value: "true" }] });
  return "Secret created";
}

export { createSecret };
