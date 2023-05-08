import type { Config } from "../config/Config.types";
import type { DeployInputs } from "../Deploy.types";

export function hideObjectKeys<Type extends Config | DeployInputs>(
  object: Type,
  keysToHide: (keyof Type)[]
): Record<keyof Type, string> {
  const copy = { ...object } as Record<keyof Type, string>;

  return keysToHide.reduce((objectCopy, key) => {
    const objectKey = key as keyof Type;
    if (objectCopy[objectKey] !== undefined) {
      objectCopy[objectKey] = "*****";
    }
    return objectCopy;
  }, copy);
}

export function logObject<Type extends Config | DeployInputs>(
  object: Type,
  keysToHide: (keyof Type)[]
): string {
  const copy = hideObjectKeys(object, keysToHide as (keyof Type)[]);
  return JSON.stringify(copy, null, 2);
}
