export function hideObjectKeys<Type extends Record<string, unknown>>(
  object: Type,
  keysToHide: (keyof Type)[]
): Type {
  const copy: Type = { ...object };

  return keysToHide.reduce((objectCopy, key) => {
    const objectKey = key as string;
    if (objectCopy[objectKey] !== undefined) {
      // Setting the value directly with the key in the object produces a type error: https://github.com/microsoft/TypeScript/issues/47357
      Reflect.set(objectCopy, key, "*****");
    }
    return objectCopy;
  }, copy);
}

export function logObject<Type extends Record<string, unknown>>(
  object: Type,
  keysToHide: (keyof Type)[]
): string {
  const copy = hideObjectKeys(object, keysToHide);
  return JSON.stringify(copy, null, 2);
}
