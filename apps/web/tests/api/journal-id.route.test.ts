import { describe, expect, it, vi } from 'vitest';

const mockFns = vi.hoisted(() => ({
  auth: vi.fn(),
  requireApiUser: vi.fn(),
  getJournalById: vi.fn(),
  updateShareability: vi.fn(),
  verifyJournalDto: vi.fn(),
  getJournalChainVerification: vi.fn(),
}));

vi.mock('@/auth', () => ({ auth: mockFns.auth }));
vi.mock('@/lib/auth/route-guards', () => ({ requireApiUser: mockFns.requireApiUser }));
vi.mock('@/server/services/journal.service', () => ({
  getJournalById: mockFns.getJournalById,
  updateShareability: mockFns.updateShareability,
}));
vi.mock('@/server/services/verification.service', () => ({ verifyJournalDto: mockFns.verifyJournalDto }));
vi.mock('@/server/services/blockchain-proof.service', () => ({
  getJournalChainVerification: mockFns.getJournalChainVerification,
}));

import { GET, PATCH } from '@/app/api/journals/[id]/route';

describe('/api/journals/[id] route', () => {
  it('GET rejects invalid journal id', async () => {
    const res = await GET(new Request('http://localhost/api/journals/not-uuid'), {
      params: Promise.resolve({ id: 'not-uuid' }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe('VALIDATION_ERROR');
  });

  it('GET returns detail + verification fields', async () => {
    mockFns.auth.mockResolvedValue({ user: { id: 'user-1' } });
    mockFns.getJournalById.mockResolvedValue({ id: 'j1', anchor: null });
    mockFns.verifyJournalDto.mockReturnValue(false);
    mockFns.getJournalChainVerification.mockResolvedValue({ state: 'skipped_no_anchor' });

    const res = await GET(new Request('http://localhost/api/journals/1'), {
      params: Promise.resolve({ id: '7a88c46d-d93f-4e15-92d8-dd4d05212c8b' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ id: 'j1', localVerification: null });
  });

  it('PATCH enforces auth', async () => {
    mockFns.requireApiUser.mockResolvedValue({
      userId: null,
      response: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    });

    const req = new Request('http://localhost/api/journals/1', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ privacy: 'share' }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: '7a88c46d-d93f-4e15-92d8-dd4d05212c8b' }) });
    expect(res.status).toBe(401);
  });

  it('PATCH rejects malformed body', async () => {
    mockFns.requireApiUser.mockResolvedValue({ userId: 'user-1', response: null });

    const req = new Request('http://localhost/api/journals/1', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ privacy: 'invalid' }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: '7a88c46d-d93f-4e15-92d8-dd4d05212c8b' }) });
    expect(res.status).toBe(400);
  });

  it('PATCH updates shareability', async () => {
    mockFns.requireApiUser.mockResolvedValue({ userId: 'user-1', response: null });
    mockFns.updateShareability.mockResolvedValue({ id: 'j1', anchor: null, privacy: 'share' });
    mockFns.verifyJournalDto.mockReturnValue(false);
    mockFns.getJournalChainVerification.mockResolvedValue({ state: 'skipped_no_anchor' });

    const req = new Request('http://localhost/api/journals/1', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ privacy: 'share' }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: '7a88c46d-d93f-4e15-92d8-dd4d05212c8b' }) });
    expect(res.status).toBe(200);
    expect(mockFns.updateShareability).toHaveBeenCalledWith(
      '7a88c46d-d93f-4e15-92d8-dd4d05212c8b',
      'user-1',
      'share',
      undefined
    );
  });
});
