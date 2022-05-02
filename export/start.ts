import { Account } from "@tago-io/sdk";
import config from "./config";
import { EntityType, IExportHolder } from "./exportTypes";
import accessExport from "./services/accessExport";
import actionsExport from "./services/actionsExport";
import analysisExport from "./services/analysisExport";
import collectIDs from "./services/collectIDs";
import dashboardExport from "./services/dashboardsExport";
import deviceExport from "./services/devicesExport";
import dictionaryExport from "./services/dictionaryExport";
import runButtonsExport from "./services/runButtonsExport";

const IMPORT_ORDER: EntityType = ["devices", "analysis", "dashboards", "accessManagement", "run_buttons", "actions", "dictionaries"];

async function startImport() {
  const account = new Account({ token: config.export.token });
  const import_account = new Account({ token: config.import.token });

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
    if (!run || !run.name) throw "Exported account doesn't have RUN enabled. Not possible to import RUN Buttons.";
  }

  const idCollection: EntityType = [];
  for (const entity of import_rule) {
    switch (entity) {
      case "devices":
        export_holder = await deviceExport(account, import_account, export_holder);
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
  console.info("====Exporting ended with success====");
}

(async () => {
  await startImport().catch(console.error);
})();
