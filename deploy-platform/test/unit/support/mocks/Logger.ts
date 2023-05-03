export function getLogger() {
  return {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    notice: jest.fn(),
    debug: jest.fn(),
  };
}
