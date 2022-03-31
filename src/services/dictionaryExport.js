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
function dictionaryExport(account, import_account, export_holder) {
    return __awaiter(this, void 0, void 0, function () {
        var list, import_list, _loop_1, _i, list_1, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.info("Exporting dictionaries: started");
                    return [4 /*yield*/, account.dictionaries.list({ amount: 99, fields: ["id", "slug", "languages", "name", "fallback"] })];
                case 1:
                    list = _a.sent();
                    return [4 /*yield*/, import_account.dictionaries.list({ amount: 99, fields: ["id", "slug", "languages", "name", "fallback"] })];
                case 2:
                    import_list = _a.sent();
                    _loop_1 = function (item) {
                        var target_id, new_item, _b, _c, lang, dictionary;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    console.info("Exporting dictionary " + item.name);
                                    target_id = (import_list.find(function (dict) { return dict.slug === item.slug; }) || { id: null }).id;
                                    if (!!target_id) return [3 /*break*/, 2];
                                    return [4 /*yield*/, import_account.dictionaries.create(item)];
                                case 1:
                                    (target_id = (_d.sent()).dictionary);
                                    return [3 /*break*/, 4];
                                case 2:
                                    new_item = __assign({}, item);
                                    delete new_item.id;
                                    return [4 /*yield*/, import_account.dictionaries.edit(target_id, new_item)];
                                case 3:
                                    _d.sent();
                                    _d.label = 4;
                                case 4:
                                    _b = 0, _c = item.languages;
                                    _d.label = 5;
                                case 5:
                                    if (!(_b < _c.length)) return [3 /*break*/, 8];
                                    lang = _c[_b];
                                    return [4 /*yield*/, account.dictionaries.languageInfo(item.id, lang.code)];
                                case 6:
                                    dictionary = _d.sent();
                                    import_account.dictionaries.languageEdit(target_id, lang.code, { dictionary: dictionary, active: true });
                                    _d.label = 7;
                                case 7:
                                    _b++;
                                    return [3 /*break*/, 5];
                                case 8: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, list_1 = list;
                    _a.label = 3;
                case 3:
                    if (!(_i < list_1.length)) return [3 /*break*/, 6];
                    item = list_1[_i];
                    return [5 /*yield**/, _loop_1(item)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.info("Exporting dictionaries: finished");
                    return [2 /*return*/, export_holder];
            }
        });
    });
}
exports["default"] = dictionaryExport;
