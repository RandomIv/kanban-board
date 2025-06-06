// 🔄 Спочатку оголошуємо мок
const mockSetBoardState = jest.fn();

// 🧪 Потім — мокаємо store, бо він імпортується всередині card.ts
jest.mock('@/store/boardStore', () => ({
  useBoardStore: {
    getState: () => ({
      setBoardState: mockSetBoardState,
    }),
  },
}));

// 🟢 Тільки потім імпортуємо card API, бо воно одразу використовує useBoardStore
import { createCard, deleteCard } from '../api/card';

global.fetch = jest.fn();

const mockToken = 'mock-token';

beforeEach(() => {
  global.localStorage = {
    getItem: jest.fn(() => mockToken),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  } as unknown as Storage;

  (fetch as jest.Mock).mockClear();
  mockSetBoardState.mockClear();
});

describe('API Card functions', () => {
  it('should create a card successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'card1', title: 'Test Card' }),
    });

    const result = await createCard('Test Card', 'list123');

    expect(mockSetBoardState).toHaveBeenCalledWith('fetching');
    expect(mockSetBoardState).toHaveBeenCalledWith('up-to-date');
    expect(result).toHaveProperty('title', 'Test Card');
  });

  it('should fail to create a card without token', async () => {
    (global.localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

    await expect(createCard('NoTokenCard', 'list123')).rejects.toThrow(
      'No auth token',
    );
  });

  it('should fail to create a card if fetch fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(createCard('BadCard', 'list123')).rejects.toThrow(
      'Failed to create card',
    );
    expect(mockSetBoardState).toHaveBeenCalledWith('error');
  });

  it('should delete a card successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const result = await deleteCard('card123');

    expect(mockSetBoardState).toHaveBeenCalledWith('fetching');
    expect(mockSetBoardState).toHaveBeenCalledWith('up-to-date');
    expect(result).toEqual({ status: 'ok' });
  });

  it('should fail to delete a card if fetch fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(deleteCard('card123')).rejects.toThrow(
      'Failed to delete card',
    );
    expect(mockSetBoardState).toHaveBeenCalledWith('error');
  });
});
