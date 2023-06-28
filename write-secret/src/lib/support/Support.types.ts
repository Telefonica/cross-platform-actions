export interface PublicKeyInterface {
  /** Public key id */
  key_id: string;
  /** Public key Base64 value*/
  key: string;
}

export interface Repository {
  /** Repository owner */
  owner: string;
  /** Repository repo */
  repo: string;
}
