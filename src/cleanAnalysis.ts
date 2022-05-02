import { Account, Analysis, Utils } from "@tago-io/sdk";
import { Data } from "@tago-io/sdk/out/common/common.types";
import { TagoContext } from "@tago-io/sdk/out/modules/Analysis/analysis.types";
import { EntityType, IExport } from "./exportTypes";
import auditLogSetup from "./lib/auditLogSetup";
import validation from "./lib/validation";

const IMPORT_ORDER: EntityType = ["devices", "dictionaries", "accessManagement", "run_buttons", "analysis", "actions", "dictionaries", "dashboards"];

const config: IExport = {
  // Export tag with unique ID's. Without tag bellow, entity will not be copied or updated.
  export_tag: "export_id",

  // Entities that will be copied from the application.
  // entities: ["dictionaries"],
  entities: ["devices", "analysis", "dashboards", "accessManagement", "run_buttons", "actions", "dictionaries"],
  data: ["list_devtype_id"],

  // Account that entities will be copied from.
  export: {
    token: "", // Development
  },

  // Account where the entities will be pasted to.
  import: {
    // token: "683d440e-4bf4-4950-aa60-3be553964fd9", // Sales
    // token: "b8e6bd99-ca5d-48c3-90cc-7ec37608ea1b", // prod
    token: "", // X-Talia
  },
};

async function startCleaner(context: TagoContext, scope: Data[]) {
  const environment = Utils.envToJson(context.environment);
  if (!environment) {
    return;
  }

  if (!environment.account_token) {
    throw "Missing account_token environment var";
  }
  const main_account = new Account({ token: environment.account_token });
  const config_dev = await Utils.getDevice(main_account, scope[0].device);
  const validate = validation("cleaner_validation", config_dev);

  const target_token = scope.find((x) => x.variable === "cleaner_target_token");
  const entities = scope.find((x) => x.variable === "cleaner_entity_list" && x.metadata?.sentValues);
  const export_tag = scope.find((x) => x.variable === "cleaner_export_tag");

  config.import.token = target_token.value as string;

  if (!config.import.token) {
    throw validate("Missing account application token field", "danger");
  } else if (config.import.token.length !== 36) {
    throw validate('Invalid "account application token".', "danger");
  }

  if (entities?.metadata?.sentValues) {
    const values = entities.metadata.sentValues.map((x) => (x.value as string).toLowerCase());
    config.entities = values as any;
  }
  const import_account = new Account({ token: config.import.token });
  const import_rule = IMPORT_ORDER.filter((entity) => config.entities.includes(entity));

  if (export_tag?.value) {
    config.export_tag = export_tag?.value as string;
  }
  const auditlog = auditLogSetup(main_account, config_dev, "cleaner_log");
  console.log(config.entities, import_rule);
  auditlog(`Starting cleaning profile`);
  console.info("====Clean started====");
  for (const item of import_rule) {
    switch (item) {
      case "devices":
        console.info("Cleaning Devices");
        const device_list = await import_account.devices.list({ amount: 999, fields: ["id", "bucket"], filter: { tags: [{ key: config.export_tag }] } });
        auditlog(`Cleaning Devices: ${device_list.length} found.`);
        await Promise.all(device_list.map(({ id }) => import_account.devices.delete(id)));
        await Promise.all(device_list.map(({ bucket }) => import_account.buckets.delete(bucket)));
        break;
      case "dashboards":
        console.info("Cleaning Dashboards");
        const dash_list = await import_account.dashboards.list({ amount: 999, fields: ["id"], filter: { tags: [{ key: config.export_tag }] } });
        auditlog(`Cleaning Dashboards: ${dash_list.length} found.`);
        await Promise.all(dash_list.map(({ id }) => import_account.dashboards.delete(id)));
        break;
      case "accessManagement":
        console.info("Cleaning Access Rules");
        const access_list = await import_account.accessManagement.list({ amount: 999, fields: ["id"], filter: { tags: [{ key: config.export_tag }] } });
        auditlog(`Cleaning Access Rules: ${dash_list.length} found.`);
        await Promise.all(access_list.map(({ id }) => import_account.accessManagement.delete(id)));
        break;
      case "analysis":
        console.info("Cleaning Analysis");
        const analysis = await import_account.analysis.list({ amount: 999, fields: ["id"], filter: { tags: [{ key: config.export_tag }] } });
        auditlog(`Cleaning Analysis: ${analysis.length} found.`);
        await Promise.all(analysis.map(({ id }) => import_account.analysis.delete(id)));
        break;
      case "actions":
        console.info("Cleaning Actions");
        const actions = await import_account.actions.list({ amount: 999, fields: ["id"], filter: { tags: [{ key: config.export_tag }] } });
        auditlog(`Cleaning Actions: ${actions.length} found.`);
        await Promise.all(actions.map(({ id }) => import_account.actions.delete(id)));
        break;
      case "dictionaries":
        console.info("Cleaning Dictionaries");
        const dictionary = await import_account.dictionaries.list({ amount: 999, fields: ["id"] });
        auditlog(`Cleaning Dictionaries: ${dictionary.length} found.`);
        await Promise.all(dictionary.map(({ id }) => import_account.dictionaries.delete(id)));
        break;
      default:
        break;
    }
  }

  auditlog(`Cleaning finished with success.`);
  validate("Account succesfully cleaned!", "success");
  console.info("====Clean ended with success====");
}

export default new Analysis(startCleaner, {
  token: "46dd313d-ffb9-48a8-8677-0cdf65910480",
});
