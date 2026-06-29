import { Device } from "@tago-io/sdk";

import { applications } from "../applications";

/**
 * Default global-inactivity alert seeded into a fresh settings device, so the
 * Default Kickstarter ships with a working alert.
 */
const SETTINGS_SEED = [
  {
    variable: "alert_management_devices",
    value: "all_sensors",
    group: "global-inactivity",
    metadata: { label: "All Sensors", sentValues: [{ label: "All Sensors", value: "all_sensors" }] },
  },
  {
    variable: "global_alert_type",
    value: "inactivity",
    group: "global-inactivity",
    metadata: { label: "Inactivity" },
  },
  {
    variable: "global_alert_condition",
    value: "checkin",
    group: "global-inactivity",
    metadata: { label: "Check-in" },
  },
  {
    variable: "global_alert_value",
    value: 1,
    unit: "hour",
    group: "global-inactivity",
    metadata: { label: "1 hour" },
  },
  {
    variable: "global_alert_scope",
    value: "all",
    group: "global-inactivity",
    metadata: { label: "All organization users", sentValues: [{ label: "All organization users", value: "all" }] },
  },
  {
    variable: "global_alert_message",
    value: "A sensor stopped sending data for more than 1 hour.",
    group: "global-inactivity",
  },
];

const isDefaultApp = (export_token: string) => export_token === applications.default;

const isSettingsDevice = (tags: { key: string; value: string }[]) => tags.some((tag) => tag.key === "device_type" && tag.value === "settings");

async function seedSettingsDevice(token: string, region: string) {
  const device = new Device({ token, region } as any);
  await device.sendData(SETTINGS_SEED);
}

export { isDefaultApp, isSettingsDevice, seedSettingsDevice };
