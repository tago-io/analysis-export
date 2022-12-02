import { Account } from "@tago-io/sdk";
import { RunInfo } from "@tago-io/sdk/out/modules/Account/run.types";
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

function updateSigninButtons(runInfo: RunInfo, targetRunInfo: RunInfo, exportHolder: IExportHolder) {
  const signin_buttons: ISigninButton[] = (runInfo as any).signin_buttons || [];
  for (const btn of signin_buttons) {
    btn.url = replaceObj(btn.url, exportHolder.dashboards);
  }

  (targetRunInfo as any).signin_buttons = signin_buttons;
}

function updateSideBarButtons(runInfo: RunInfo, targetRunInfo: RunInfo, exportHolder: IExportHolder) {
  const sidebar_buttons: ISidebarButton[] = runInfo.sidebar_buttons;
  for (const btn of sidebar_buttons) {
    if (btn.type !== "dashboard") {
      continue;
    }

    btn.value = exportHolder.dashboards[btn.value as string];
  }

  targetRunInfo.sidebar_buttons = sidebar_buttons;
}

async function runButtonsExport(account: Account, import_account: Account, export_holder: IExportHolder) {
  console.info("Run Buttons: started");

  const runInfo = await account.run.info();
  const targetRunInfo = await import_account.run.info();

  updateSideBarButtons(runInfo, targetRunInfo, export_holder);
  updateSigninButtons(runInfo, targetRunInfo, export_holder);

  // Email Templates
  for (const template_name of Object.keys(runInfo.email_templates)) {
    const email_obj = runInfo.email_templates[template_name];
    targetRunInfo.email_templates[template_name] = email_obj;
  }

  await import_account.run.edit(targetRunInfo).then(console.log);

  console.info("Run Buttons: finished");
  return export_holder;
}

export default runButtonsExport;
export { updateSideBarButtons, updateSigninButtons };
