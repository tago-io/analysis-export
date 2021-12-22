import { Account } from "@tago-io/sdk";
import config from "./config";
import { EntityType } from "./exportTypes";

const IMPORT_ORDER: EntityType = ["devices", "dictionaries", "accessManagement", "run_buttons", "analysis", "actions", "dictionaries"];

async function startImport() {
  const import_account = new Account({ token: config.import.token });

  const import_rule = IMPORT_ORDER.filter((entity) => config.entities.includes(entity));

  console.info("====Clean started====");
  for (const item of import_rule) {
    switch (item) {
      case "devices":
        console.info("Cleaning Devices");
        const device_list = await import_account.devices.list({ amount: 999, fields: ["id", "bucket"] });
        await Promise.all(device_list.map(({ id }) => import_account.devices.delete(id)));
        await Promise.all(device_list.map(({ bucket }) => import_account.buckets.delete(bucket)));
        break;
      case "dictionaries":
        console.info("Cleaning Dashboards");
        const dash_list = await import_account.dashboards.list({ amount: 999, fields: ["id"] });
        await Promise.all(dash_list.map(({ id }) => import_account.dashboards.delete(id)));
        break;
      case "accessManagement":
        console.info("Cleaning Access Rules");
        const access_list = await import_account.accessManagement.list({ amount: 999, fields: ["id"] });
        await Promise.all(access_list.map(({ id }) => import_account.accessManagement.delete(id)));
        break;
      case "analysis":
        console.info("Cleaning Analysis");
        const analysis = await import_account.analysis.list({ amount: 999, fields: ["id"] });
        await Promise.all(analysis.map(({ id }) => import_account.analysis.delete(id)));
        break;
      case "actions":
        console.info("Cleaning Actions");
        const actions = await import_account.actions.list({ amount: 999, fields: ["id"] });
        await Promise.all(actions.map(({ id }) => import_account.actions.delete(id)));
        break;
      case "dictionaries":
        console.info("Cleaning Dictionaries");
        const dictionary = await import_account.dictionaries.list({ amount: 999, fields: ["id"] });
        await Promise.all(dictionary.map(({ id }) => import_account.dictionaries.delete(id)));
        break;
      default:
        break;
    }
  }

  console.info("====Clean ended with success====");
}

(async () => {
  await startImport();
})();
