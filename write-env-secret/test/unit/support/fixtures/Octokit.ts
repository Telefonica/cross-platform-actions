/* eslint-disable import/no-named-as-default-member */
// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

export async function getRepository() {
  return {
    data: {
      id: 1,
    },
  };
}

export async function getEnvironment() {
  return {
    data: {},
  };
}

export async function getEnvironmentPublicKey() {
  await sodium.ready;
  const keyPair = sodium.crypto_box_keypair();
  const key = sodium.to_base64(keyPair.publicKey, sodium.base64_variants.ORIGINAL);
  return {
    data: {
      key_id: "test",
      key,
    },
  };
}

export async function createOrUpdateEnvironmentSecret() {
  return {};
}
