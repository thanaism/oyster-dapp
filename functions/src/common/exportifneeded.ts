const isFunctionCalled = (functionName: string): boolean =>
  !process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === functionName;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const exportIfNeeded = (functionName: string, fileName: string, exports: any): void => {
  if (isFunctionCalled(functionName)) {
    // eslint-disable-next-line
    exports[functionName] = require(`../wrappers/${fileName}`).default;
  }
};

export default exportIfNeeded;
