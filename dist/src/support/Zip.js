"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJsonFromZip = void 0;
const jszip_1 = __importDefault(require("jszip"));
async function getJsonFromZip(zipFile) {
    const zip = new jszip_1.default();
    const unzipped = await zip.loadAsync(zipFile);
    return Object.values(unzipped.files)[0].async("string");
}
exports.getJsonFromZip = getJsonFromZip;
