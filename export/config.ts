import { IExport } from "./exportTypes";

//to run: ts-node export/start.ts

const config: IExport = {
  // Entities that will be copied from the application.
  entities: ["devices", "dashboards", "analysis", "accessManagement", "actions", "run_buttons", "dictionaries"],
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
    token: "5e22b8ec-e65c-474f-bc7f-d6d1a0f307b6", // X-Talia
  },
};

export default config;
