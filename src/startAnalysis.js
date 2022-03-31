"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var sdk_1 = require("@tago-io/sdk");
var axios_1 = require("axios");
var auditLogSetup_1 = require("./lib/auditLogSetup");
var validation_1 = require("./lib/validation");
var accessExport_1 = require("./services/accessExport");
var actionsExport_1 = require("./services/actionsExport");
var analysisExport_1 = require("./services/analysisExport");
var collectIDs_1 = require("./services/collectIDs");
var dashboardsExport_1 = require("./services/dashboardsExport");
var devicesExport_1 = require("./services/devicesExport");
var dictionaryExport_1 = require("./services/dictionaryExport");
var runButtonsExport_1 = require("./services/runButtonsExport");
var config = {
    // Export tag with unique ID's. Without tag bellow, entity will not be copied or updated.
    export_tag: "export_id",
    // Entities that will be copied from the application.
    // entities: ["dictionaries"],
    entities: ["devices", "analysis", "dashboards", "accessManagement", "run_buttons", "actions", "dictionaries"],
    data: ["list_devtype_id"],
    // Account that entities will be copied from.
    "export": {
        token: ""
    },
    // Account where the entities will be pasted to.
    "import": {
        // token: "683d440e-4bf4-4950-aa60-3be553964fd9", // Sales
        // token: "b8e6bd99-ca5d-48c3-90cc-7ec37608ea1b", // prod
        token: ""
    }
};
var IMPORT_ORDER = ["devices", "analysis", "dashboards", "accessManagement", "run_buttons", "actions", "dictionaries"];
function sendNotification(token, message) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            (0, axios_1["default"])({
                method: "POST",
                url: "https://api.tago.io/notification",
                data: {
                    title: "Importing application",
                    message: message
                },
                headers: { Authorization: config["import"].token }
            });
            return [2 /*return*/];
        });
    });
}
function startImport(context, scope) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var environment, main_account, config_dev, validate, export_token, target_token, entities, data_list, export_tag, account, import_account, values, data, import_rule, export_holder, run, import_acc_info, auditlog, idCollection, _i, import_rule_1, entity, _b, e_1;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    environment = sdk_1.Utils.envToJson(context.environment);
                    if (!environment) {
                        return [2 /*return*/];
                    }
                    if (!environment.account_token) {
                        throw "Missing account_token environment var";
                    }
                    main_account = new sdk_1.Account({ token: environment.account_token });
                    return [4 /*yield*/, sdk_1.Utils.getDevice(main_account, scope[0].origin)];
                case 1:
                    config_dev = _d.sent();
                    validate = (0, validation_1["default"])("export_validation", config_dev);
                    export_token = scope.find(function (x) { return x.variable === "export_token"; });
                    target_token = scope.find(function (x) { return x.variable === "target_token"; });
                    entities = scope.find(function (x) { var _a; return x.variable === "entity_list" && ((_a = x.metadata) === null || _a === void 0 ? void 0 : _a.sentValues); });
                    data_list = scope.find(function (x) { return x.variable === "data_list"; });
                    export_tag = scope.find(function (x) { return x.variable === "export_tag"; });
                    config["export"].token = export_token.value;
                    config["import"].token = target_token.value;
                    if (!config["export"].token) {
                        throw validate("Missing account application token field", "danger");
                    }
                    else if (config["export"].token.length !== 36) {
                        throw validate('Invalid "account application token".', "danger");
                    }
                    if (!config["import"].token) {
                        throw validate("Missing account token field", "danger");
                    }
                    else if (config["import"].token.length !== 36) {
                        throw validate('Invalid "account token".', "danger");
                    }
                    account = new sdk_1.Account({ token: config["export"].token });
                    import_account = new sdk_1.Account({ token: config["import"].token });
                    if ((_a = entities === null || entities === void 0 ? void 0 : entities.metadata) === null || _a === void 0 ? void 0 : _a.sentValues) {
                        values = entities.metadata.sentValues.map(function (x) { return x.value; });
                        config.entities = values;
                    }
                    if (data_list === null || data_list === void 0 ? void 0 : data_list.value) {
                        data = data_list.value.replace(/ /g, "").split(",");
                        config.data = data;
                    }
                    if (export_tag === null || export_tag === void 0 ? void 0 : export_tag.value) {
                        config.export_tag = export_tag === null || export_tag === void 0 ? void 0 : export_tag.value;
                    }
                    import_rule = IMPORT_ORDER.filter(function (entity) { return config.entities.includes(entity); });
                    export_holder = {
                        devices: {},
                        analysis: {},
                        dashboards: {},
                        tokens: (_c = {}, _c[config["export"].token] = config["import"].token, _c)
                    };
                    console.info("====Exporting started====");
                    console.log(import_rule);
                    if (!import_rule.includes("run_buttons")) return [3 /*break*/, 3];
                    return [4 /*yield*/, import_account.run.info()];
                case 2:
                    run = _d.sent();
                    if (!run || !run.name) {
                        throw validate("The account doesn't have RUN enabled. Not possible to import RUN Buttons.", "danger");
                    }
                    _d.label = 3;
                case 3: return [4 /*yield*/, import_account.info()];
                case 4:
                    import_acc_info = _d.sent();
                    if (import_acc_info.plan === "free") {
                        throw validate("The account is free, can't import the application.", "danger");
                    }
                    auditlog = (0, auditLogSetup_1["default"])(account, config_dev, "export_log");
                    auditlog("Starting export to: " + import_acc_info.name);
                    sendNotification(config["import"].token, "Starting the import proccess. Please await, it can take up to 5 minutes.");
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 38, , 39]);
                    validate("Exporting the application, this proccess can take several minutes...", "warning");
                    idCollection = [];
                    _i = 0, import_rule_1 = import_rule;
                    _d.label = 6;
                case 6:
                    if (!(_i < import_rule_1.length)) return [3 /*break*/, 37];
                    entity = import_rule_1[_i];
                    _b = entity;
                    switch (_b) {
                        case "devices": return [3 /*break*/, 7];
                        case "dashboards": return [3 /*break*/, 9];
                        case "accessManagement": return [3 /*break*/, 15];
                        case "analysis": return [3 /*break*/, 21];
                        case "actions": return [3 /*break*/, 25];
                        case "dictionaries": return [3 /*break*/, 29];
                        case "run_buttons": return [3 /*break*/, 31];
                    }
                    return [3 /*break*/, 35];
                case 7: return [4 /*yield*/, (0, devicesExport_1["default"])(account, import_account, export_holder)];
                case 8:
                    export_holder = _d.sent();
                    idCollection.push("devices");
                    return [3 /*break*/, 36];
                case 9:
                    if (!!idCollection.includes("analysis")) return [3 /*break*/, 11];
                    idCollection.push("analysis");
                    return [4 /*yield*/, (0, collectIDs_1["default"])(account, import_account, "analysis", export_holder)];
                case 10:
                    export_holder = _d.sent();
                    _d.label = 11;
                case 11:
                    if (!!idCollection.includes("devices")) return [3 /*break*/, 13];
                    idCollection.push("devices");
                    return [4 /*yield*/, (0, collectIDs_1["default"])(account, import_account, "devices", export_holder)];
                case 12:
                    export_holder = _d.sent();
                    _d.label = 13;
                case 13: return [4 /*yield*/, (0, dashboardsExport_1["default"])(account, import_account, export_holder)];
                case 14:
                    export_holder = _d.sent();
                    idCollection.push("dashboards");
                    return [3 /*break*/, 36];
                case 15:
                    if (!!idCollection.includes("devices")) return [3 /*break*/, 17];
                    idCollection.push("devices");
                    return [4 /*yield*/, (0, collectIDs_1["default"])(account, import_account, "devices", export_holder)];
                case 16:
                    export_holder = _d.sent();
                    _d.label = 17;
                case 17:
                    if (!!idCollection.includes("dashboards")) return [3 /*break*/, 19];
                    idCollection.push("dashboards");
                    return [4 /*yield*/, (0, collectIDs_1["default"])(account, import_account, "dashboards", export_holder)];
                case 18:
                    export_holder = _d.sent();
                    _d.label = 19;
                case 19: return [4 /*yield*/, (0, accessExport_1["default"])(account, import_account, export_holder)];
                case 20:
                    export_holder = _d.sent();
                    return [3 /*break*/, 36];
                case 21:
                    if (!!idCollection.includes("devices")) return [3 /*break*/, 23];
                    idCollection.push("devices");
                    return [4 /*yield*/, (0, collectIDs_1["default"])(account, import_account, "devices", export_holder)];
                case 22:
                    export_holder = _d.sent();
                    _d.label = 23;
                case 23: return [4 /*yield*/, (0, analysisExport_1["default"])(account, import_account, export_holder)];
                case 24:
                    export_holder = _d.sent();
                    idCollection.push("analysis");
                    return [3 /*break*/, 36];
                case 25:
                    if (!!idCollection.includes("devices")) return [3 /*break*/, 27];
                    idCollection.push("devices");
                    return [4 /*yield*/, (0, collectIDs_1["default"])(account, import_account, "devices", export_holder)];
                case 26:
                    export_holder = _d.sent();
                    _d.label = 27;
                case 27: return [4 /*yield*/, (0, actionsExport_1["default"])(account, import_account, export_holder)];
                case 28:
                    export_holder = _d.sent();
                    idCollection.push("actions");
                    return [3 /*break*/, 36];
                case 29: return [4 /*yield*/, (0, dictionaryExport_1["default"])(account, import_account, export_holder)];
                case 30:
                    export_holder = _d.sent();
                    return [3 /*break*/, 36];
                case 31:
                    if (!!idCollection.includes("dashboards")) return [3 /*break*/, 33];
                    idCollection.push("dashboards");
                    return [4 /*yield*/, (0, collectIDs_1["default"])(account, import_account, "dashboards", export_holder)];
                case 32:
                    export_holder = _d.sent();
                    _d.label = 33;
                case 33: return [4 /*yield*/, (0, runButtonsExport_1["default"])(account, import_account, export_holder)];
                case 34:
                    export_holder = _d.sent();
                    idCollection.push("run_buttons");
                    return [3 /*break*/, 36];
                case 35: return [3 /*break*/, 36];
                case 36:
                    _i++;
                    return [3 /*break*/, 6];
                case 37: return [3 /*break*/, 39];
                case 38:
                    e_1 = _d.sent();
                    auditlog("Error while exporting: " + e_1);
                    throw validate(e_1, "danger");
                case 39:
                    sendNotification(config["import"].token, "The application was succesfully imported.");
                    auditlog("Export finished with success for: " + import_acc_info.name);
                    validate("Application succesfully exported!", "success");
                    console.info("====Exporting ended with success====");
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = new sdk_1.Analysis(startImport, {
    token: "9a37a7d2-964e-4806-b8dd-06822c0f335c"
});
