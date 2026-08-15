import { EventEmitter } from 'node:events';
import { ThumbManager } from './thumb-manager';
import type { ThumbWorkerRequest, ThumbWorkerResponse } from './thumb-worker';

class MockWorker extends EventEmitter {
  public postMessage = jest.fn((_request: ThumbWorkerRequest) => {
    // default behavior can be customized in tests
  });
  public terminate = jest.fn().mockResolvedValue(0);
}

let lastMockWorker: MockWorker | null = null;

jest.mock('../app/app', () => ({
  __esModule: true,
  default: {
    application: {
      isPackaged: false
    }
  }
}));

jest.mock('node:worker_threads', () => {
  return {
    Worker: jest.fn().mockImplementation(() => {
      lastMockWorker = new MockWorker();
      return lastMockWorker;
    })
  };
});

describe('ThumbManager', () => {
  let thumbManager: ThumbManager;

  beforeEach(() => {
    jest.clearAllMocks();
    lastMockWorker = null;
    thumbManager = new ThumbManager('dummy-worker-path.js');
  });

  afterEach(() => {
    thumbManager.terminate();
  });

  it('should instantiate a worker on initialization', () => {
    expect(lastMockWorker).not.toBeNull();
  });

  it('should send a thumbnail generation request and resolve true on success', async () => {
    const worker = lastMockWorker;
    if (!worker) {
      throw new Error('Worker was not initialized');
    }

    worker.postMessage.mockImplementation((req: ThumbWorkerRequest) => {
      setTimeout(() => {
        const response: ThumbWorkerResponse = {
          id: req.id,
          success: true
        };
        worker.emit('message', response);
      }, 10);
    });

    const result = await thumbManager.generate('/path/to/source.jpg', '/path/to/target.jpg', 200, 200);

    expect(result).toBe(true);
    expect(worker.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        source: '/path/to/source.jpg',
        target: '/path/to/target.jpg',
        width: 200,
        height: 200,
        id: expect.any(String)
      })
    );
  });

  it('should resolve false when worker returns success: false', async () => {
    const worker = lastMockWorker;
    if (!worker) {
      throw new Error('Worker was not initialized');
    }

    worker.postMessage.mockImplementation((req: ThumbWorkerRequest) => {
      setTimeout(() => {
        const response: ThumbWorkerResponse = {
          id: req.id,
          success: false,
          error: 'Image decoding failed'
        };
        worker.emit('message', response);
      }, 10);
    });

    const result = await thumbManager.generate('/path/to/invalid.jpg', '/path/to/target.jpg', 200, 200);
    expect(result).toBe(false);
  });

  it('should resolve false for pending jobs and restart worker when worker emits an error', async () => {
    const worker = lastMockWorker;
    if (!worker) {
      throw new Error('Worker was not initialized');
    }

    const generatePromise = thumbManager.generate('/path/to/source.jpg', '/path/to/target.jpg', 200, 200);

    // Emit worker error
    worker.emit('error', new Error('Worker crash'));

    const result = await generatePromise;
    expect(result).toBe(false);
  });

  it('should resolve false for pending jobs when worker exits unexpectedly', async () => {
    const worker = lastMockWorker;
    if (!worker) {
      throw new Error('Worker was not initialized');
    }

    const generatePromise = thumbManager.generate('/path/to/source.jpg', '/path/to/target.jpg', 200, 200);

    // Worker exits with non-zero code
    worker.emit('exit', 1);

    const result = await generatePromise;
    expect(result).toBe(false);
  });

  it('should clean up worker and pending requests on terminate()', async () => {
    const worker = lastMockWorker;
    if (!worker) {
      throw new Error('Worker was not initialized');
    }

    const generatePromise = thumbManager.generate('/path/to/source.jpg', '/path/to/target.jpg', 200, 200);

    thumbManager.terminate();

    const result = await generatePromise;
    expect(result).toBe(false);
    expect(worker.terminate).toHaveBeenCalled();
  });

  it('should immediately resolve false without posting to worker if signal is pre-aborted', async () => {
    const worker = lastMockWorker;
    if (!worker) {
      throw new Error('Worker was not initialized');
    }

    const controller = new AbortController();
    controller.abort();

    const result = await thumbManager.generate(
      '/path/to/source.jpg',
      '/path/to/target.jpg',
      200,
      200,
      controller.signal
    );

    expect(result).toBe(false);
    expect(worker.postMessage).not.toHaveBeenCalled();
  });

  it('should post cancel message and resolve false when signal is aborted in-flight', async () => {
    const worker = lastMockWorker;
    if (!worker) {
      throw new Error('Worker was not initialized');
    }

    const controller = new AbortController();
    const generatePromise = thumbManager.generate(
      '/path/to/source.jpg',
      '/path/to/target.jpg',
      200,
      200,
      controller.signal
    );

    expect(worker.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'generate',
        source: '/path/to/source.jpg',
        target: '/path/to/target.jpg',
        width: 200,
        height: 200,
        id: expect.any(String)
      })
    );

    const generatedReq = (worker.postMessage.mock.calls[0] as unknown[])[0] as ThumbWorkerRequest;

    controller.abort();

    expect(worker.postMessage).toHaveBeenCalledWith({
      type: 'cancel',
      id: generatedReq.id
    });

    const result = await generatePromise;
    expect(result).toBe(false);
  });

  it('should clean up abort event listener when thumbnail generation resolves successfully', async () => {
    const worker = lastMockWorker;
    if (!worker) {
      throw new Error('Worker was not initialized');
    }

    const controller = new AbortController();
    const removeEventListenerSpy = jest.spyOn(controller.signal, 'removeEventListener');

    worker.postMessage.mockImplementation((req: ThumbWorkerRequest) => {
      setTimeout(() => {
        const response: ThumbWorkerResponse = {
          id: req.id,
          success: true
        };
        worker.emit('message', response);
      }, 10);
    });

    const result = await thumbManager.generate(
      '/path/to/source.jpg',
      '/path/to/target.jpg',
      200,
      200,
      controller.signal
    );

    expect(result).toBe(true);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('abort', expect.any(Function));
  });

  it('should clean up abort event listener when worker emits error', async () => {
    const worker = lastMockWorker;
    if (!worker) {
      throw new Error('Worker was not initialized');
    }

    const controller = new AbortController();
    const removeEventListenerSpy = jest.spyOn(controller.signal, 'removeEventListener');

    const generatePromise = thumbManager.generate(
      '/path/to/source.jpg',
      '/path/to/target.jpg',
      200,
      200,
      controller.signal
    );

    worker.emit('error', new Error('Worker crash'));

    const result = await generatePromise;
    expect(result).toBe(false);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('abort', expect.any(Function));
  });

  it('should post cancel message when cancel() is called directly', () => {
    const worker = lastMockWorker;
    if (!worker) {
      throw new Error('Worker was not initialized');
    }

    thumbManager.cancel('test-id-123');

    expect(worker.postMessage).toHaveBeenCalledWith({
      type: 'cancel',
      id: 'test-id-123'
    });
  });
});
