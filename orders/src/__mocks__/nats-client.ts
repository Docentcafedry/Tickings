export const client = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subscription: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
