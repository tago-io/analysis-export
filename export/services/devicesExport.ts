import { Account, Utils } from "@tago-io/sdk";
import { IExportHolder } from "../exportTypes";
import filterExport from "../lib/filterExport";
import replaceObj from "../lib/replaceObj";

async function deviceExport(account: Account, import_account: Account, export_holder: IExportHolder) {
  console.info("Exporting devices: started");

  const list = await account.devices.list({ amount: 99, fields: ["id", "name", "tags"], filter: { tags: [{ key: "export_id" }] } });
  const import_list = await import_account.devices.list({ amount: 99, fields: ["id", "tags"], filter: { tags: [{ key: "export_id" }] } });

  for (const { id: device_id, tags: device_tags, name } of list) {
    console.info(`Exporting devices ${name}`);
    const device = await account.devices.info(device_id);
    // delete device.bucket;

    const export_id = device.tags.find((tag) => tag.key === "export_id")?.value;

    const token = await Utils.getTokenByName(account, device_id);

    let { id: target_id } = import_list.find((device) => device.tags.find((tag) => tag.key === "export_id" && tag.value == export_id)) || { id: null };

    let new_token: string;

    const new_device = replaceObj(device, export_holder.devices);

    new_device.last_output = undefined;
    new_device.last_input = undefined;

    if (!target_id) {
      ({ device_id: target_id, token: new_token } = await import_account.devices.create(new_device));
    } else {
      await import_account.devices.edit(target_id, new_device);
      new_token = await Utils.getTokenByName(import_account, target_id);
    }

    export_holder.devices[device_id] = target_id;
    export_holder.tokens[token] = new_token;
  }

  console.info("Exporting devices: finished");
  return export_holder;
}

export default deviceExport;