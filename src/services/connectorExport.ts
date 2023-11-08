import { Account } from "@tago-io/sdk";
import { IExportHolder } from "../exportTypes";
import replaceObj from "../lib/replaceObj";

interface ISidebarButton {
  color: string;
  href: string;
  iconUrl: string;
  text: string;
  type: string;
  value?: string;
}

interface ISigninButton {
  label: string;
  type: "link";
  url: string;
}

async function runButtonsExport(account: Account, import_account: Account, export_holder: IExportHolder) {
  console.info("Network/Connectors: started");

  const networks = await account.integration.networks.list({ page: 1, amount: 99, filter: { profile: "" } as any });
  const importNetworks = await account.integration.networks.list({ page: 1, amount: 99, filter: { profile: "" } as any });

  // // Sidebar Buttons
  // const sidebar_buttons: ISidebarButton[] = run_info.sidebar_buttons;
  // for (const btn of sidebar_buttons) {
  //   if (btn.type !== "dashboard") {
  //     continue;
  //   }

  //   btn.value = export_holder.dashboards[btn.value as string];
  // }

  const connectors = await account.integration.connectors.list({ page: 1, amount: 99, filter: { profile: "" } as any });
  const importConnectors = await account.integration.connectors.list({ page: 1, amount: 99, filter: { profile: "" } as any });

  console.info("Run Buttons: finished");
  return export_holder;
}

export default runButtonsExport;
