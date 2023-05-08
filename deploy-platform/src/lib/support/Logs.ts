export function hideObjectKeys<Type>(object: Type, keysToHide: (keyof Type)[]): Type {
  const copy: Type = { ...object };

  return keysToHide.reduce((objectCopy, key) => {
    const objectKey = key as string;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (objectCopy[objectKey] !== undefined) {
      // Setting the value directly with the key in the object produces a type error: https://github.com/microsoft/TypeScript/issues/47357
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Reflect.set(objectCopy, key, "*****");
    }
    return objectCopy;
  }, copy);
}

export function logObject<Type>(object: Type, keysToHide: string[]): string {
  const copy = hideObjectKeys(object, keysToHide as (keyof Type)[]);
  return JSON.stringify(copy, null, 2);
}
