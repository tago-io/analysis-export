import { cloneDeep } from "lodash";
import { updateSideBarButtons, updateSigninButtons } from "./runButtonsExport";
import runInfo from "./mock/run.json";
import targetRunInfo from "./mock/targetRun.json";
import exportHolder from "./mock/exportHolder.json";

describe("Collect ID", () => {
  test("Update Signin Buttons", () => {
    const copyTargetRun = cloneDeep(targetRunInfo);
    expect(copyTargetRun.signin_buttons.length).toBe(0);
    updateSigninButtons(runInfo as any, copyTargetRun as any, exportHolder);

    expect(copyTargetRun.signin_buttons.length).toBe(1);
    expect(copyTargetRun.signin_buttons[0].url).toBe("admin.tago.io/public/dashboard/73656d1df7cb62001163c3de/7fc36ee6-b0c8-43a3-97f2-ff6b7326fb26");
  });

  test("Update Sidebar Buttons", () => {
    const copyTargetRun = cloneDeep(targetRunInfo);
    expect(copyTargetRun.sidebar_buttons.length).toBe(0);
    updateSideBarButtons(runInfo as any, copyTargetRun as any, exportHolder);

    expect(copyTargetRun.sidebar_buttons.length).toBe(2);
    expect(copyTargetRun.sidebar_buttons[0].value).toBe("7324b541bd887900183227b2");
    expect(copyTargetRun.sidebar_buttons[1].value).toBe("7324b554218476001907b74d");
  });
});
