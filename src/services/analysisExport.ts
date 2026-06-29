import zlib from "zlib";
import { Account } from "@tago-io/sdk";

import { IExportHolder } from "../exportTypes";
import replaceObj from "../lib/replaceObj";

// The SDK still types runtime/language as the legacy "node" | "python", but the API accepts the
// full set below. We propagate the source runtime as-is so a "deno-rt2025" analysis is not
// recreated as legacy "node".
type AnalysisRuntime = "node-legacy" | "python-legacy" | "node-rt2025" | "python-rt2025" | "deno-rt2025" | "node" | "python" | "other";

async function analysisExport(account: Account, import_account: Account, export_holder: IExportHolder) {
  console.info("Exporting analysis: started");

  const list = await account.analysis.list({ amount: 99, fields: ["id", "name", "tags"], filter: { tags: [{ key: "export_id" }] } }).then((r) => r.reverse());
  const import_list = await import_account.analysis.list({ amount: 99, fields: ["id", "tags"], filter: { tags: [{ key: "export_id" }] } });

  // Pass 1: create/find every target analysis first so export_holder.analysis holds the full old->new ID
  // map before any variables are written. This makes ID remapping order-independent, so env vars that
  // reference another analysis ID (e.g. CRUD Alerts' alert_dispatcher_id) resolve to the new analysis.
  const exportAnalysisList = [];
  for (const { id: analysis_id, name } of list) {
    console.info(`Creating analysis ${name}...`);
    const analysis = await account.analysis.info(analysis_id);
    const export_id = analysis.tags?.find((tag) => tag.key === "export_id")?.value;
    const runtime: AnalysisRuntime = (analysis as any).runtime ?? "node";

    let { id: target_id } = import_list.find((item) => item.tags?.find((tag) => tag.key === "export_id" && tag.value == export_id)) || { id: null };
    if (!target_id) {
      ({ id: target_id } = await import_account.analysis.create({ name: analysis.name, tags: analysis.tags, runtime } as any));
    }

    export_holder.analysis[analysis_id] = target_id;
    exportAnalysisList.push({ analysis_id, analysis, target_id, runtime });
  }

  // Pass 2: with the complete ID map, remap references inside each analysis (devices, tokens, analysis IDs),
  // then write its variables and upload its script.
  for (const { analysis_id, analysis, target_id, runtime } of exportAnalysisList) {
    console.info(`Exporting analysis ${analysis.name}...`);
    const new_analysis = replaceObj(analysis, { ...export_holder.devices, ...export_holder.tokens, ...export_holder.analysis });

    await import_account.analysis.edit(target_id, {
      name: new_analysis.name,
      tags: new_analysis.tags,
      active: new_analysis.active,
      variables: new_analysis.variables,
      description: new_analysis.description,
      run_on: new_analysis.run_on,
      interval: new_analysis.interval,
      runtime,
    } as any);

    const script = await account.analysis.downloadScript(analysis_id);
    const response = await fetch(script.url);
    const arrayBuffer = await response.arrayBuffer();
    const script_base64 = zlib.gunzipSync(Buffer.from(arrayBuffer)).toString("base64");

    await import_account.analysis.uploadScript(target_id, { content: script_base64, language: runtime, name: "script.js" } as any);
  }

  console.info("Exporting analysis: finished");
  return export_holder;
}

export { analysisExport };
