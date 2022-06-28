const isFunctionCalled = (functionName: string): boolean => {
  return !process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === functionName;
};

const exportIfNeeded = (functionName: string, fileName: string, exports: any): void => {
  if (isFunctionCalled(functionName)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    exports[functionName] = require(`../wrappers/${fileName}`).default;
  }
};

export default exportIfNeeded;
