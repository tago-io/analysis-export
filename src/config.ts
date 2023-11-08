import { IExport } from "./exportTypes";

const config: IExport = {
  // Export tag with unique ID's. Without tag bellow, entity will not be copied or updated.
  export_tag: "export_id",

  // Entities that will be copied from the application.
  entities: ["dashboards", "dictionaries"],
  // entities: ["devices", "analysis", "dashboards", "accessManagement", "run_buttons", "actions", "dictionaries"],
  // entities: ["accessManagement"],
  // data: ["list_devtype_id"],

  // Account that entities will be copied from.
  export: {
    token: "1a5b22bd-30c6-47f3-ab76-939952dec310", // TEST
  },

  // Account where the entities will be pasted to.
  import: {
    token: "04051baf-4bce-4e49-a78c-e4527f3c7324", // PROD
  },
};

export default config;
