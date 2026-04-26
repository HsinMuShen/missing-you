import { describe, expect, it, vi } from 'vitest';

const mockFns = vi.hoisted(() => ({
  requireApiUser: vi.fn(),
  prepareAnchor: vi.fn(),
  markAnchored: vi.fn(),
}));

vi.mock('@/lib/auth/route-guards', () => ({ requireApiUser: mockFns.requireApiUser }));
vi.mock('@/server/services/journal.service', () => ({
  prepareAnchor: mockFns.prepareAnchor,
  markAnchored: mockFns.markAnchored,
}));

import { POST as PREPARE_POST } from '@/app/api/journals/[id]/prepare-anchor/route';
import { POST as CONFIRM_POST } from '@/app/api/journals/[id]/confirm-anchor/route';

describe('anchor API routes', () => {
  it('prepare-anchor enforces auth', async () => {
    mockFns.requireApiUser.mockResolvedValue({
      userId: null,
      response: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    });

    const res = await PREPARE_POST(new Request('http://localhost') as any, {
      params: Promise.resolve({ id: '7a88c46d-d93f-4e15-92d8-dd4d05212c8b' }),
    });
    expect(res.status).toBe(401);
  });

  it('prepare-anchor validates id', async () => {
    mockFns.requireApiUser.mockResolvedValue({ userId: 'user-1', response: null });

    const res = await PREPARE_POST(new Request('http://localhost') as any, {
      params: Promise.resolve({ id: 'bad-id' }),
    });
    expect(res.status).toBe(400);
  });

  it('prepare-anchor returns payload', async () => {
    mockFns.requireApiUser.mockResolvedValue({ userId: 'user-1', response: null });
    mockFns.prepareAnchor.mockResolvedValue({ memoryId: 'm1', contentHash: '0x' + 'a'.repeat(64) });

    const res = await PREPARE_POST(new Request('http://localhost') as any, {
      params: Promise.resolve({ id: '7a88c46d-d93f-4e15-92d8-dd4d05212c8b' }),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ memoryId: 'm1' });
  });

  it('confirm-anchor rejects invalid body', async () => {
    mockFns.requireApiUser.mockResolvedValue({ userId: 'user-1', response: null });

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ txHash: 'bad' }),
    });

    const res = await CONFIRM_POST(req as any, {
      params: Promise.resolve({ id: '7a88c46d-d93f-4e15-92d8-dd4d05212c8b' }),
    });
    expect(res.status).toBe(400);
  });

  it('confirm-anchor calls service and returns result', async () => {
    mockFns.requireApiUser.mockResolvedValue({ userId: 'user-1', response: null });
    mockFns.markAnchored.mockResolvedValue({ id: 'j1', status: 'anchored' });

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        txHash: '0x' + 'b'.repeat(64),
        chainId: 80002,
        contractAddress: '0x1111111111111111111111111111111111111111',
      }),
    });

    const res = await CONFIRM_POST(req as any, {
      params: Promise.resolve({ id: '7a88c46d-d93f-4e15-92d8-dd4d05212c8b' }),
    });
    expect(res.status).toBe(200);
    expect(mockFns.markAnchored).toHaveBeenCalledWith(
      '7a88c46d-d93f-4e15-92d8-dd4d05212c8b',
      'user-1',
      {
        txHash: '0x' + 'b'.repeat(64),
        chainId: 80002,
        contractAddress: '0x1111111111111111111111111111111111111111',
      }
    );
  });
});
