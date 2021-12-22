import { Account } from "@tago-io/sdk";
import { IExportHolder } from "../exportTypes";
import replaceObj from "../lib/replaceObj";

async function accessExport(account: Account, import_account: Account, export_holder: IExportHolder) {
  console.info("Exporting access rules: started");

  const list = await account.accessManagement.list({ amount: 99, fields: ["id", "name", "tags"], filter: { tags: [{ key: "export_id" }] } });
  const import_list = await import_account.accessManagement.list({ amount: 99, fields: ["id", "tags"], filter: { tags: [{ key: "export_id" }] } });

  for (const { id: access_id, tags: access_tags, name } of list) {
    console.info(`Exporting access rule ${name}`);
    const access = await account.accessManagement.info(access_id);
    const export_id = access.tags.find((tag) => tag.key === "export_id")?.value;

    let { id: target_id } = import_list.find((access) => access.tags.find((tag) => tag.key === "export_id" && tag.value == export_id)) || { id: null };

    const new_access = replaceObj(access, { ...export_holder.devices, ...export_holder.dashboards });
    if (!target_id) {
      ({ am_id: target_id } = await import_account.accessManagement.create(new_access));
    } else {
      await import_account.accessManagement.edit(target_id, new_access);
    }
  }

  console.info("Exporting access rules: finished");
  return export_holder;
}

export default accessExport;
