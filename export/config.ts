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
    token: "5c0aab39-27cf-4a51-8094-cc0555eaa50b", // X-Talia
  },
};

export default config;

//Dependent Actions

//export does not configure RUN EMAIL TEMPLATES

//RTLS

// [
//   {
//     "id": "5fdbc47fcf49a20028d2b554",
//     "origin": "5fc64986a0e14a0026084d9e",
//     "time": "2020-12-17T20:50:07.977Z",
//     "value": "5f5a8f3351d4db99c40deed1",
//     "variable": "list_devtype_id",
//     "metadata": {
//       "label": "Industrial GPS Asset Tracker"
//     }
//   },
//   {
//     "id": "5fdbc47fcf49a20028d2b555",
//     "origin": "5fc64986a0e14a0026084d9e",
//     "time": "2020-12-17T20:50:07.977Z",
//     "value": "5f5a8f3351d4db99c40deecf",
//     "variable": "list_devtype_id",
//     "metadata": {
//       "label": "BLE Asset Tracker"
//     }
//   }
// ]

//Leak detection & Freezer supervision

//send to settings_dev
// [
//   {
//     "variable": "category_list",
//     "value": "Residential"
//   },
//     {
//     "variable": "category_list",
//     "value": "Commercial"
//   },
// {
//   "value": "5ed7ccd5427104001cf00183,5f5a8f3351d4db99c40ded32",
//   "variable": "list_devicetype",
//   "metadata": {
//     "label": "Type A",
//     "meter_type": "leak",
//     "battery_alert": "bat_v",
//     "sensor_alert": "water_leak_status",
//     "sensor_value": 1,
//     "sensor_condition": "="
//   }
// },
// {
//   "value": "5f5a8f3351d4db99c40deea7,5bbe0e5aa90d60002f56fa37",
//   "variable": "list_devicetype",
//   "metadata": {
//     "label": "Type B",
//     "meter_type": "drain",
//     "battery_alert": "bat_v",
//     "sensor_alert": "water_leak_status",
//     "sensor_value": 1,
//     "sensor_condition": "="
//   }
// }
// ]

//Asset Optimization
