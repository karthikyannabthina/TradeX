jest.mock('../../src/modules/stocks/stock.model', () => ({
  find: jest.fn().mockResolvedValue([{ symbol: 'ABC', currentPrice: 100, previousClose: 95, dayOpen: 96, dayHigh: 101, dayLow: 95, volume: 1000 }]),
  insertMany: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../src/modules/market/market.repository', () => ({
  saveMarketState: jest.fn().mockResolvedValue(null),
}));

jest.mock('../../src/events/market.events', () => ({
  emitPriceUpdated: jest.fn(),
}));

const marketSimulatorPath = '../../src/modules/market/market.simulator';

describe('Market simulator tick behavior', () => {
  let savedIntervalCb;
  let originalSetInterval;
  let expectedStockCount;

  beforeEach(async () => {
    jest.resetModules();
    // capture setInterval callback
    originalSetInterval = global.setInterval;
    global.setInterval = (cb, ms) => { savedIntervalCb = cb; return 1; };

    // require module after mocking
    const marketSim = require(marketSimulatorPath);

    // initialize market to populate internal marketState
    await marketSim.initializeMarket();
    expectedStockCount = marketSim.getMarketState().length;

    // start simulator (will invoke our mocked setInterval and capture cb)
    marketSim.startMarketSimulator();

    // restore setInterval to avoid affecting other tests
    global.setInterval = originalSetInterval;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('saveMarketState is called only once per stock during a tick', async () => {
    const repo = require('../../src/modules/market/market.repository');
    const marketEvents = require('../../src/events/market.events');
    // Ensure callback exists
    expect(typeof savedIntervalCb).toBe('function');

    // Call the captured tick callback
    await savedIntervalCb();

    expect(repo.saveMarketState).toHaveBeenCalledTimes(expectedStockCount);
    expect(marketEvents.emitPriceUpdated).toHaveBeenCalledTimes(expectedStockCount);
    expect(marketEvents.emitPriceUpdated).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'ABC',
        price: expect.any(Number),
        previousPrice: 95,
        change: expect.any(Number),
        changePercent: expect.any(Number),
        timestamp: expect.any(String),
      })
    );
  });

  test('overlapping tick calls are prevented by guard', async () => {
    const repo = require('../../src/modules/market/market.repository');

    // Make saveMarketState take longer to simulate long-running tick
    let resolveSave;
    const savePromise = new Promise((resolve) => { resolveSave = resolve; });
    repo.saveMarketState.mockImplementation(() => savePromise);

    // Call first tick (it will start and await saveMarketState)
    const p1 = savedIntervalCb();

    // Immediately call second tick; guard should prevent overlap and return early
    const p2 = savedIntervalCb();

    // allow save to finish
    resolveSave();
    await Promise.all([p1, p2]);

    expect(repo.saveMarketState).toHaveBeenCalledTimes(expectedStockCount);
  });
});
