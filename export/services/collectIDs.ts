import { Account, Utils } from "@tago-io/sdk";
import { Entity, EntityType, IExportHolder } from "../exportTypes";

async function collectIDs(account: Account, import_account: Account, entity: Entity, export_holder: IExportHolder) {
  const list = await account[entity].list({ page: 1, amount: 99, fields: ["id", "tags"] as any, filter: { tags: [{ key: "export_id" }] } });
  const import_list = await import_account[entity].list({ page: 1, amount: 99, fields: ["id", "tags"] as any, filter: { tags: [{ key: "export_id" }] } });

  for (const item of list) {
    const export_id = item.tags.find((tag) => tag.key === "export_id")?.value;
    if (!export_id) continue;

    const { id: target_id } = (import_list as any).find((a: any) => a.tags.find((tag: any) => tag.key === "export_id" && tag.value == export_id)) || {
      id: null,
    };

    if (!target_id) continue;

    if (entity === "devices") {
      const token = await Utils.getTokenByName(account, item.id);
      const target_token = await Utils.getTokenByName(import_account, target_id);

      if (token && target_token) {
        export_holder.tokens[token] = target_token;
      }
    }

    export_holder[entity][item.id] = target_id;
  }

  return export_holder;
}

export default collectIDs;
