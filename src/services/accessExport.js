"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var replaceObj_1 = require("../lib/replaceObj");
function accessExport(account, import_account, export_holder) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var list, import_list, _loop_1, _i, list_1, _b, access_id, access_tags, name_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.info("Exporting access rules: started");
                    return [4 /*yield*/, account.accessManagement.list({ amount: 99, fields: ["id", "name", "tags"], filter: { tags: [{ key: "export_id" }] } })];
                case 1:
                    list = _c.sent();
                    return [4 /*yield*/, import_account.accessManagement.list({ amount: 99, fields: ["id", "tags"], filter: { tags: [{ key: "export_id" }] } })];
                case 2:
                    import_list = _c.sent();
                    _loop_1 = function (access_id, access_tags, name_1) {
                        var access, export_id, target_id, new_access;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    console.info("Exporting access rule " + name_1);
                                    return [4 /*yield*/, account.accessManagement.info(access_id)];
                                case 1:
                                    access = _d.sent();
                                    export_id = (_a = access.tags.find(function (tag) { return tag.key === "export_id"; })) === null || _a === void 0 ? void 0 : _a.value;
                                    target_id = (import_list.find(function (access) { return access.tags.find(function (tag) { return tag.key === "export_id" && tag.value == export_id; }); }) || { id: null }).id;
                                    new_access = (0, replaceObj_1["default"])(access, __assign(__assign({}, export_holder.devices), export_holder.dashboards));
                                    if (!!target_id) return [3 /*break*/, 3];
                                    return [4 /*yield*/, import_account.accessManagement.create(new_access)];
                                case 2:
                                    (target_id = (_d.sent()).am_id);
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, import_account.accessManagement.edit(target_id, new_access)];
                                case 4:
                                    _d.sent();
                                    _d.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, list_1 = list;
                    _c.label = 3;
                case 3:
                    if (!(_i < list_1.length)) return [3 /*break*/, 6];
                    _b = list_1[_i], access_id = _b.id, access_tags = _b.tags, name_1 = _b.name;
                    return [5 /*yield**/, _loop_1(access_id, access_tags, name_1)];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.info("Exporting access rules: finished");
                    return [2 /*return*/, export_holder];
            }
        });
    });
}
exports["default"] = accessExport;
