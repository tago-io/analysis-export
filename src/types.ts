// ? ==================================== (c) TagoIO ====================================
// ? What is this file?
// * This file is global types, it's used to remove "implicitly has an 'any' type" errors.
// ? ====================================================================================

import { Device, Account } from "@tago-io/sdk";
import { Data } from "@tago-io/sdk/out/common/common.types";
import { DeviceCreateResponse } from "@tago-io/sdk/out/modules/Account/devices.types";
import { AnalysisEnvironment } from "@tago-io/sdk/out/modules/Analysis/analysis.types";

type Token = string;
type AnalysisID = string;

interface TagoContext {
  token: Token;
  analysis_id: AnalysisID;
  environment: AnalysisEnvironment[];
  log: (...args: any[]) => void;
}
interface ServicesIndexAnalysis {
  checkType: (scope: Data[] | InputData[], environment: AnalysisEnvironment) => void;
  controller: (params: ServiceParams) => void;
}

interface InputData extends Data {
  input_form_button_id?: string;
}

interface ServiceParams {
  context: TagoContext;
  account: Account; // ! We need migrate SDK to better hightlight
  config_dev: Device; // ! We need migrate SDK to better hightlight
  notification: any; // ! We need migrate SDK to better hightlight
  scope: Data[] | InputData[];
  environment: AnalysisEnvironment;
}

interface DeviceCreated extends DeviceCreateResponse {
  device: Device;
}

export { ServicesIndexAnalysis, ServiceParams, TagoContext, InputData, DeviceCreated };
