import {
  createNewBoard,
  fetchBoardData,
  fetchUserBoards,
  deleteBoard,
  changeBoard,
} from '../api/board';
import { apiUrl } from '@/utils/api';

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
});

describe('API Board functions', () => {
  it('should create a new board', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '123', title: 'Test board' }),
    });

    const result = await createNewBoard('Test board');
    expect(fetch).toHaveBeenCalledWith(
      apiUrl('/boards'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
        }),
      }),
    );
    expect(result).toHaveProperty('title', 'Test board');
  });

  it('should fail to create board without token', async () => {
    (global.localStorage.getItem as jest.Mock).mockReturnValueOnce(null);
    await expect(createNewBoard('Test')).rejects.toThrow('No auth token');
  });

  it('should handle board fetch failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    await expect(fetchBoardData('nonexistent')).rejects.toThrow(
      'Board not found',
    );
  });

  it('should delete a board', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    const res = await deleteBoard('abc123');
    expect(res).toEqual({ status: 'ok' });
  });

  it('should update a board title', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'id', title: 'Updated Title' }),
    });
    const res = await changeBoard('abc123', 'Updated Title');
    expect(res).toHaveProperty('title', 'Updated Title');
  });

  it('should fetch user boards', async () => {
    const mockBoards = [
      { id: '1', title: 'Board One' },
      { id: '2', title: 'Board Two' },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockBoards,
    });

    const result = await fetchUserBoards();

    expect(fetch).toHaveBeenCalledWith(
      apiUrl('/boards'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
        }),
      }),
    );

    expect(result).toEqual(mockBoards);
  });
});
