import axios from "axios";

import { Account, Analysis, Utils } from "@tago-io/sdk";
import { Data, TagoContext } from "@tago-io/sdk/lib/types";

import { EntityType, IExport, IExportHolder } from "./exportTypes";
import auditLogSetup from "./lib/auditLogSetup";
import { initializeValidation } from "./lib/validation";
import { accessExport } from "./services/accessExport";
import actionsExport from "./services/actionsExport";
import { analysisExport } from "./services/analysisExport";
import collectIDs from "./services/collectIDs";
import { createSecret } from "./services/createSecret";
import dashboardExport from "./services/dashboardsExport";
import { deviceExport } from "./services/devicesExport";
import dictionaryExport from "./services/dictionaryExport";
import { runButtonsExport } from "./services/runButtonsExport";

const applications = {
  default: "19c43a65-dd50-49a7-9535-09038c2934d8",
  rtls: "2a4889a4-7c89-4278-b2b9-6fcd30eabd6d",
};

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

async function sendNotification(account: Account, message: string) {
  try {
    await account.notifications.create({
      title: "Importing application",
      message,
    });
  } catch (e) {
    throw new Error(`Error in sendNotification: ${e}`);
  }
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
  const validate = initializeValidation("export_validation", config_dev, { show_markdown: true });

  const export_token = scope.find((x) => x.variable === "export_token");
  const target_token = scope.find((x) => x.variable === "target_token");
  const entities = scope.find((x) => x.variable === "entities" && x.metadata?.sentValues);
  const data_list = scope.find((x) => x.variable === "data_list");
  const export_tag = scope.find((x) => x.variable === "export_tag");
  const region = scope.find((x) => x.variable === "target_region");

  config.export.token = applications[export_token.value as string];
  config.import.token = target_token.value as string;

  if (!config.export.token) {
    return Promise.reject(await validate("Missing account application token field", "danger"));
  } else if (config.export.token.length !== 36) {
    return Promise.reject(await validate('Invalid "account application token".', "danger"));
  }

  if (!config.import.token) {
    return Promise.reject(await validate("Missing profile-token field", "danger"));
  } else if (config.import.token.length !== 36) {
    return Promise.reject(await validate("Profile token invalid. Please check your token and try again.", "danger"));
  }

  if (!region?.value) {
    return Promise.reject(await validate("Missing target region field", "danger"));
  } else if (region.value !== "us-e1" && region.value !== "eu-w1") {
    return Promise.reject(await validate("Invalid target region field", "danger"));
  }

  const account = new Account({ token: config.export.token });
  const import_account = new Account({ token: config.import.token, region: region?.value });

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

  const import_rule = IMPORT_ORDER.filter((entity) => config.entities.indexOf(entity) !== -1);
  let export_holder: IExportHolder = {
    devices: {},
    analysis: {},
    dashboards: {},
    tokens: { [config.export.token]: config.import.token },
  };

  console.info("====Exporting started====");

  console.log(import_rule);

  const run = await import_account.run.info();
  if (!run || !run.name) {
    return Promise.reject(
      await validate(
        `Your profile needs to have TagoRUN enabled. Visit this [link](https://tago.${region?.value}.io/run), click on \`Start Now\` and then save the change to enable your TagoRUN.`,
        "danger"
      )
    );
  }

  const import_acc_info = await import_account.info();
  if (import_acc_info.plan === "free") {
    return Promise.reject(await validate("This application requires a paid plan. Upgrade your account to import these resources.", "danger"));
  }

  const auditlog = auditLogSetup(account, config_dev, "export_log");
  auditlog(`Starting export to: ${import_acc_info.name}`);
  sendNotification(import_account, "Starting import process. This typically takes 3-5 minutes.");

  try {
    validate("Importing selected resources... Please wait while we set up your application.", "warning");

    try {
      await createSecret(config.import.token, region?.value);
    } catch (e) {
      throw new Error(`Error in createSecret: ${e}`);
    }

    const idCollection: EntityType = [];
    for (const entity of import_rule) {
      try {
        switch (entity) {
          case "devices":
            export_holder = await deviceExport(account, import_account, export_holder, config);
            idCollection.push("devices");
            break;
          case "dashboards":
            if (!idCollection.includes("analysis")) {
              idCollection.push("analysis");
              try {
                export_holder = await collectIDs(account, import_account, "analysis", export_holder);
              } catch (e) {
                throw new Error(`Error in collectIDs (analysis for dashboards): ${e}`);
              }
            }
            if (!idCollection.includes("devices")) {
              idCollection.push("devices");
              try {
                export_holder = await collectIDs(account, import_account, "devices", export_holder);
              } catch (e) {
                throw new Error(`Error in collectIDs (devices for dashboards): ${e}`);
              }
            }
            export_holder = await dashboardExport(account, import_account, export_holder);
            idCollection.push("dashboards");
            break;
          case "analysis":
            if (!idCollection.includes("devices")) {
              idCollection.push("devices");
              try {
                export_holder = await collectIDs(account, import_account, "devices", export_holder);
              } catch (e) {
                throw new Error(`Error in collectIDs (devices for analysis): ${e}`);
              }
            }
            export_holder = await analysisExport(account, import_account, export_holder);
            idCollection.push("analysis");
            break;
          case "actions":
            if (!idCollection.includes("devices")) {
              idCollection.push("devices");
              try {
                export_holder = await collectIDs(account, import_account, "devices", export_holder);
              } catch (e) {
                throw new Error(`Error in collectIDs (devices for actions): ${e}`);
              }
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
              try {
                export_holder = await collectIDs(account, import_account, "dashboards", export_holder);
              } catch (e) {
                throw new Error(`Error in collectIDs (dashboards for run_buttons): ${e}`);
              }
            }
            export_holder = await runButtonsExport(account, import_account, export_holder);
            idCollection.push("run_buttons");
            break;
          case "accessManagement":
            if (!idCollection.includes("devices")) {
              idCollection.push("devices");
              try {
                export_holder = await collectIDs(account, import_account, "devices", export_holder);
              } catch (e) {
                throw new Error(`Error in collectIDs (devices for accessManagement): ${e}`);
              }
            }
            if (!idCollection.includes("dashboards")) {
              idCollection.push("dashboards");
              try {
                export_holder = await collectIDs(account, import_account, "dashboards", export_holder);
              } catch (e) {
                throw new Error(`Error in collectIDs (dashboards for accessManagement): ${e}`);
              }
            }
            if (!idCollection.includes("analysis")) {
              idCollection.push("analysis");
              try {
                export_holder = await collectIDs(account, import_account, "analysis", export_holder);
              } catch (e) {
                throw new Error(`Error in collectIDs (analysis for accessManagement): ${e}`);
              }
            }
            export_holder = await accessExport(account, import_account, export_holder);
            break;
          default:
            break;
        }
      } catch (e) {
        throw new Error(`Error while processing entity "${entity}": ${e}`);
      }
    }
  } catch (e) {
    auditlog(`Error while exporting: ${e}`);
    sendNotification(import_account, "Import failed. Please check your profile token and try again.");
    return Promise.reject(await validate(e.message || "Unknown error", "danger"));
  }

  sendNotification(import_account, "Import successful! Your Kickstarter application is ready to use.");

  auditlog(`Export finished with success for: ${import_acc_info.name}`);
  validate("The application was succesfully imported!", "success");
  console.info("====Exporting ended with success====");
}

Analysis.use(startImport, { token: process.env.T_ANALYSIS_TOKEN });
