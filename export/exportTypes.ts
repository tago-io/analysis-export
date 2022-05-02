// ? ==================================== (c) TagoIO ====================================
// ? What is this file?
// * This file is global types, it's used to remove "implicitly has an 'any' type" errors.
// ? ====================================================================================

interface IExportHolder {
  dashboards: { [key: string]: string };
  devices: { [key: string]: string };
  analysis: { [key: string]: string };
  tokens: { [key: string]: string };
}

type Entity = "dashboards" | "devices" | "analysis";
type EntityType = Array<"dashboards" | "devices" | "run_buttons" | "analysis" | "actions" | "dictionaries" | "accessManagement">;
interface IExport {
  entities: EntityType;
  dictionary?: string[];
  export: {
    token: string;
  };
  import: {
    token: string;
  };
}

export { EntityType, Entity, IExport, IExportHolder };
