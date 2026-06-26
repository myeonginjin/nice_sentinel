export const mockDelay = <T>(data: T, ms = 600) =>
  new Promise<T>((res) => setTimeout(() => res(structuredClone(data)), ms));
