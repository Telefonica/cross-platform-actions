"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubSecret = void 0;
/* eslint-disable import/no-named-as-default-member */
// eslint-disable-next-line import/default
const libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
/**
 * Create a new GitHub secret.
 *
 * @param {string} name - The name of the secret.
 * @param {string} value - The value of the secret.
 *
 * @see {@link https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository|Creating encrypted secrets for a repository}
 */
const GitHubSecret = class GitHubSecret {
    _name;
    _value;
    constructor(name, value) {
        this._name = name;
        this._value = value;
    }
    get name() {
        return this._name;
    }
    /**
     * Get the encrypted value of the secret.
     *
     * @param {ContextInterface} context - The context of the current run.
     * @param {string} publicKey - The base64 public key to encrypt the secret with.
     * @returns {string} The encrypted value of the secret.
     *
     * @see {@link https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository|Creating encrypted secrets for a repository}
     */
    async encryptedValue(context, publicKey) {
        context.logger?.debug(`Encrypting secret ${this._name}`);
        await libsodium_wrappers_1.default.ready;
        const binKey = libsodium_wrappers_1.default.from_base64(publicKey, libsodium_wrappers_1.default.base64_variants.ORIGINAL);
        const binSec = libsodium_wrappers_1.default.from_string(this._value);
        const encBytes = libsodium_wrappers_1.default.crypto_box_seal(binSec, binKey);
        const encryptedValue = libsodium_wrappers_1.default.to_base64(encBytes, libsodium_wrappers_1.default.base64_variants.ORIGINAL);
        context.logger?.debug(`Secret ${this._name} encrypted`);
        return encryptedValue;
    }
};
exports.GitHubSecret = GitHubSecret;
