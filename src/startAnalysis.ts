import axios from "axios";

import { Account, Analysis, Utils } from "@tago-io/sdk";
import { Data } from "@tago-io/sdk/out/common/common.types";
import { TagoContext } from "@tago-io/sdk/out/modules/Analysis/analysis.types";

import { EntityType, IExport, IExportHolder } from "./exportTypes";
import auditLogSetup from "./lib/auditLogSetup";
import { initializeValidation } from "./lib/validation";
import { accessExport } from "./services/accessExport";
import actionsExport from "./services/actionsExport";
import { analysisExport } from "./services/analysisExport";
import collectIDs from "./services/collectIDs";
import dashboardExport from "./services/dashboardsExport";
import { deviceExport } from "./services/devicesExport";
import dictionaryExport from "./services/dictionaryExport";
import { runButtonsExport } from "./services/runButtonsExport";

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

const IMPORT_ORDER: EntityType = ["devices", "analysis", "dashboards", "accessManagement", "run_buttons", "actions", "dictionaries"];

async function sendNotification(token: string, message: string) {
  axios({
    method: "POST",
    url: "https://api.tago.io/notification",
    data: {
      title: "Importing application",
      message,
    },
    headers: { Authorization: config.import.token },
  });
}

async function startImport(context: TagoContext, scope: Data[]): Promise<void> {
  console.log(scope);
  const environment = Utils.envToJson(context.environment);
  if (!environment) {
    return;
  }

  if (!environment.account_token) {
    throw "Missing account_token environment var";
  }

  const main_account = new Account({ token: environment.account_token });

  const config_dev = await Utils.getDevice(main_account, scope[0].device);
  const validate = initializeValidation("export_validation", config_dev);

  const export_token = scope.find((x) => x.variable === "export_token");
  const target_token = scope.find((x) => x.variable === "target_token");
  const entities = scope.find((x) => x.variable === "entities" && x.metadata?.sentValues);
  const data_list = scope.find((x) => x.variable === "data_list");
  const export_tag = scope.find((x) => x.variable === "export_tag");

  config.export.token = export_token.value as string;
  config.import.token = target_token.value as string;

  if (!config.export.token) {
    return Promise.reject(await validate("Missing account application token field", "danger"));
  } else if (config.export.token.length !== 36) {
    return Promise.reject(await validate('Invalid "account application token".', "danger"));
  }

  if (!config.import.token) {
    return Promise.reject(await validate("Missing account token field", "danger"));
  } else if (config.import.token.length !== 36) {
    return Promise.reject(await validate('Invalid "account token".', "danger"));
  }

  const account = new Account({ token: config.export.token });
  const import_account = new Account({ token: config.import.token });

  if (entities?.metadata?.sentValues) {
    const values = entities.metadata.sentValues.map((x) => x.value);
    config.entities = values as any;
  }

  if (data_list?.value && typeof data_list.value === "string") {
    const data = (data_list.value as string).replace(/ /g, "").split(",");
    config.data = data as any;
  }

  if (export_tag?.value) {
    config.export_tag = (export_tag?.value as string) || "export_id";
  }

  const import_rule = IMPORT_ORDER.filter((entity) => config.entities.includes(entity));
  let export_holder: IExportHolder = {
    devices: {},
    analysis: {},
    dashboards: {},
    tokens: { [config.export.token]: config.import.token },
  };

  console.info("====Exporting started====");

  console.log(import_rule);

  if (import_rule.includes("run_buttons")) {
    const run = await import_account.run.info();
    if (!run || !run.name) {
      return Promise.reject(await validate("The account doesn't have RUN enabled. Not possible to import RUN Buttons.", "danger"));
    }
  }

  const import_acc_info = await import_account.info();
  if (import_acc_info.plan === "free") {
    return Promise.reject(await validate("The account is free, can't import the application.", "danger"));
  }

  const auditlog = auditLogSetup(account, config_dev, "export_log");
  auditlog(`Starting export to: ${import_acc_info.name}`);
  sendNotification(config.import.token, "Starting the import proccess. Please await, it can take up to 5 minutes.");

  try {
    validate("Exporting the application, this proccess can take several minutes...", "warning");

    const idCollection: EntityType = [];
    for (const entity of import_rule) {
      switch (entity) {
        case "devices":
          export_holder = await deviceExport(account, import_account, export_holder, config);
          idCollection.push("devices");
          break;
        case "dashboards":
          if (!idCollection.includes("analysis")) {
            idCollection.push("analysis");
            export_holder = await collectIDs(account, import_account, "analysis", export_holder);
          }
          if (!idCollection.includes("devices")) {
            idCollection.push("devices");
            export_holder = await collectIDs(account, import_account, "devices", export_holder);
          }
          export_holder = await dashboardExport(account, import_account, export_holder);
          idCollection.push("dashboards");
          break;
        case "accessManagement":
          if (!idCollection.includes("devices")) {
            idCollection.push("devices");
            export_holder = await collectIDs(account, import_account, "devices", export_holder);
          }
          if (!idCollection.includes("dashboards")) {
            idCollection.push("dashboards");
            export_holder = await collectIDs(account, import_account, "dashboards", export_holder);
          }
          export_holder = await accessExport(account, import_account, export_holder);
          break;
        case "analysis":
          if (!idCollection.includes("devices")) {
            idCollection.push("devices");
            export_holder = await collectIDs(account, import_account, "devices", export_holder);
          }
          export_holder = await analysisExport(account, import_account, export_holder);
          idCollection.push("analysis");
          break;
        case "actions":
          if (!idCollection.includes("devices")) {
            idCollection.push("devices");
            export_holder = await collectIDs(account, import_account, "devices", export_holder);
          }
          export_holder = await actionsExport(account, import_account, export_holder);
          idCollection.push("actions");
          break;
        case "dictionaries":
          export_holder = await dictionaryExport(account, import_account, export_holder);
          break;
        case "run_buttons":
          if (!idCollection.includes("dashboards")) {
            idCollection.push("dashboards");
            export_holder = await collectIDs(account, import_account, "dashboards", export_holder);
          }
          export_holder = await runButtonsExport(account, import_account, export_holder);
          idCollection.push("run_buttons");
          break;
        default:
          break;
      }
    }
  } catch (e) {
    auditlog(`Error while exporting: ${e}`);
    return Promise.reject(await validate(e, "danger"));
  }

  sendNotification(config.import.token, "The application was succesfully imported.");

  auditlog(`Export finished with success for: ${import_acc_info.name}`);
  validate("Application succesfully exported!", "success");
  console.info("====Exporting ended with success====");
}

Analysis.use(startImport, { token: process.env.T_ANALYSIS_TOKEN });
