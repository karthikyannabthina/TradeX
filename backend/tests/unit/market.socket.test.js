const mockHandlers = {};
const mockSocket = {
  id: "socket-1",
  on: jest.fn((event, handler) => {
    mockHandlers[event] = handler;
  }),
  emit: jest.fn(),
};

const mockIo = {
  on: jest.fn((event, handler) => {
    if (event === "connection") {
      mockHandlers.connection = handler;
    }
  }),
};

jest.mock("socket.io", () => ({
  Server: jest.fn(() => mockIo),
}));

jest.mock("../../src/socket/socket.events", () => ({
  initializeSocketEvents: jest.fn(),
}));

jest.mock("../../src/modules/market/market.simulator", () => ({
  getMarketState: jest.fn(() => [{ symbol: "RELIANCE", price: 2948.6 }]),
}));

describe("market socket subscription", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockHandlers).forEach((key) => delete mockHandlers[key]);
  });

  test("returns the current market snapshot to a full-market subscriber", () => {
    const { initializeSocket } = require("../../src/socket/socket.server");

    initializeSocket({});
    mockHandlers.connection(mockSocket);
    mockHandlers["market:subscribeAll"]();

    expect(mockSocket.emit).toHaveBeenCalledWith("market:snapshot", [
      { symbol: "RELIANCE", price: 2948.6 },
    ]);
  });
});
