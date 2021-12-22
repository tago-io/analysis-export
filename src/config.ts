import { IExport } from "./exportTypes";

const config: IExport = {
  // Export tag with unique ID's. Without tag bellow, entity will not be copied or updated.
  export_tag: "export_id",

  // Entities that will be copied from the application.
  // entities: ["dictionaries"],
  entities: ["devices", "analysis", "dashboards", "accessManagement", "run_buttons", "actions", "dictionaries"],
  // entities: ["accessManagement"],
  // data: ["list_devtype_id"],

  // Account that entities will be copied from.
  export: {
    // token: "0912bcff-51f1-46a1-b56c-94fd63bf6eb4", // Development
    token: "", // Development
  },

  // Account where the entities will be pasted to.
  import: {
    // token: "683d440e-4bf4-4950-aa60-3be553964fd9", // Sales
    // token: "b8e6bd99-ca5d-48c3-90cc-7ec37608ea1b", // prod
    // token: "5c0aab39-27cf-4a51-8094-cc0555eaa50b", // X-Talia
    token: "7ec20119-e7e4-4605-a913-51c74dd78614", // X-Talia
  },
};

export default config;
