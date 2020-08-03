import { getItemImageUrl } from './getItemImageUrl';

describe('getItemImageUrl', () => {
  it('returns valid image urls', () => {
    const bp = getItemImageUrl('321', 'Test Blueprint');
    expect(bp).toEqual('https://images.evetech.net/types/321/bp');

    const bpc = getItemImageUrl('123', 'Test Blueprint', true);
    expect(bpc).toEqual('https://images.evetech.net/types/123/bpc');

    const regular = getItemImageUrl('321', 'Caracal', true);
    expect(regular).toEqual('https://images.evetech.net/types/321/icon');
  });
});
