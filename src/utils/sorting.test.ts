import { alphaSort } from './sorting';

describe('sorting', () => {
  it('alphaSort sorts alphabetically', () => {
    interface Item {
      id: number;
      nested: {
        name: string;
      };
    }

    const items: Item[] = [
      { id: 231, nested: { name: 'test item a1' } },
      { id: 123, nested: { name: 'X test item a1' } },
      { id: 312, nested: { name: 'x test item a1' } },
      { id: 333, nested: { name: '021 test item a1' } },
      { id: 233, nested: { name: '111 test item a1' } },
      { id: 121, nested: { name: 'test item a2' } },
    ];

    const sorted = items.sort(alphaSort<Item>(item => item.nested.name));
    expect(sorted).toEqual([
      { id: 333, nested: { name: '021 test item a1' } },
      { id: 233, nested: { name: '111 test item a1' } },
      { id: 231, nested: { name: 'test item a1' } },
      { id: 121, nested: { name: 'test item a2' } },
      { id: 312, nested: { name: 'x test item a1' } },
      { id: 123, nested: { name: 'X test item a1' } },
    ]);
  });
});
