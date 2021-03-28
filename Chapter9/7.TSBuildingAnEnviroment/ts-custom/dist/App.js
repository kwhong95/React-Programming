"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
<<<<<<< HEAD
var legacy_1 = require("./legacy");
function App(_a) {
    var name = _a.name, age = _a.age;
    var value = legacy_1.getValue();
    console.log(value.toFixed());
=======
function App(_a) {
    var name = _a.name, age = _a.age;
>>>>>>> 0107ee59d8c4fbebe86b53a66f3a372d60303023
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("p", null, name),
        react_1.default.createElement("p", null, age)));
}
exports.default = App;
