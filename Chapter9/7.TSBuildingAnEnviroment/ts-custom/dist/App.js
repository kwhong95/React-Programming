"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function App(_a) {
    var name = _a.name, age = _a.age;
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("p", null, name),
        react_1.default.createElement("p", null, age)));
}
exports.default = App;
