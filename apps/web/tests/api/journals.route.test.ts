import { describe, expect, it, vi } from 'vitest';

const mockFns = vi.hoisted(() => ({
  requireApiUser: vi.fn(),
  listJournalsForUser: vi.fn(),
  createJournal: vi.fn(),
}));

vi.mock('@/lib/auth/route-guards', () => ({
  requireApiUser: mockFns.requireApiUser,
}));

vi.mock('@/server/services/journal.service', () => ({
  listJournalsForUser: mockFns.listJournalsForUser,
  createJournal: mockFns.createJournal,
}));

import { GET, POST } from '@/app/api/journals/route';

describe('/api/journals route', () => {
  it('GET requires auth', async () => {
    mockFns.requireApiUser.mockResolvedValue({
      userId: null,
      response: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    });

    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('GET returns journals for authenticated user', async () => {
    mockFns.requireApiUser.mockResolvedValue({ userId: 'user-1', response: null });
    mockFns.listJournalsForUser.mockResolvedValue([{ id: 'j1' }]);

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ id: 'j1' }]);
  });

  it('POST validates through service and returns 201', async () => {
    mockFns.requireApiUser.mockResolvedValue({ userId: 'user-1', response: null });
    mockFns.createJournal.mockResolvedValue({ id: 'j1', status: 'draft' });

    const req = new Request('http://localhost/api/journals', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content: 'hello', privacy: 'private' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(mockFns.createJournal).toHaveBeenCalledWith(
      { content: 'hello', privacy: 'private' },
      'user-1'
    );
  });
});
