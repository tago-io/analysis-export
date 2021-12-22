import { Account, Device } from "@tago-io/sdk";
import { parseTagoObject } from "./data.logic";

export default function auditLogSetup(account: Account, device: Device, log_variable?: string) {
  if (!log_variable) {
    log_variable = "auditlog";
  }

  return async function _(description: string) {
    if (!description) {
      throw "Missing description";
    }

    device.sendData(
      parseTagoObject(
        {
          [log_variable]: { value: description },
        },
        String(new Date().getTime())
      )
    );
    return description;
  };
}
