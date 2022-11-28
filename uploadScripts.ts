import { execSync } from "child_process";
import { promises as fs } from "fs";
import { Account } from "@tago-io/sdk";

// Edit bellow to add your analysis. Default analysis route is "src/"
const scriptList: { [key: string]: string } = {
  analysisHandler: "Analysis ID",
};

(async () => {
  // Add account-token
  const account = new Account({ token: "" });

  for (const script_name in scriptList) {
    console.log(`\nBuilding ${script_name}.ts`);
    execSync(`analysis-builder src/${script_name}.ts ./build/${script_name}.tago.js`, { stdio: "inherit" });
    const script = await fs.readFile(`build\\${script_name}.tago.js`, { encoding: "base64" });

    await account.analysis
      .uploadScript(scriptList[script_name], {
        content: script,
        language: "node",
        name: `${script_name}.tago.js`,
      })
      .then(() => console.log(`\n> Script ${script_name}.ts successfully uploaded to TagoIO!`), console.log);
  }
})();
