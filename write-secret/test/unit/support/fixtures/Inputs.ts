export function buildGetInputs(inputs: Record<string, string>) {
  return function (name: string, options?: { required?: boolean; trimWhitespace?: boolean }) {
    if (options?.required === true && !inputs[name]) {
      throw new Error(`Input required and not supplied: ${name}`);
    }
    const value = inputs[name] || "";
    if (options?.trimWhitespace === false) {
      return value;
    }
    return value.trim();
  };
}
