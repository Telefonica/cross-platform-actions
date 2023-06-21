import * as sodium from "libsodium-wrappers";

declare global {
  // NOTE: This is a workaround for adding custom matchers to Jest.
  // eslint-disable-next-line no-shadow
  namespace jest {
    interface Expect {
      toHaveEncryptedValue(value: string, keyPair: sodium.KeyPair): CustomMatcherResult;
    }
    interface Matchers<R> {
      toHaveEncryptedValue(value: string, keyPair: sodium.KeyPair): R;
    }
  }
}

export {};
