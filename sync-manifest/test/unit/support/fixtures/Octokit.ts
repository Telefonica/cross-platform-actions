/* eslint-disable import/no-named-as-default-member */
// eslint-disable-next-line import/default
import sodium from "libsodium-wrappers";

export const GET_REPOSITORY_PUBLIC_KEY = "GET /repos/{owner}/{repo}/actions/secrets/public-key";
export const CREATE_OR_UPDATE_REPOSITORY_SECRET =
  "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}";

export async function getRepoPublicKey() {
  const keyPair = sodium.crypto_box_keypair();
  const key = sodium.to_base64(keyPair.publicKey, sodium.base64_variants.ORIGINAL);
  return {
    data: {
      key,
    },
  };
}

export async function createOrUpdateRepoSecret() {
  return {};
}
