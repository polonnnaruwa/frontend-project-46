test('1 ne ravno 2', () => {

    const text = parse(filepath1, filepath2);
    expect(text).toBe('bad text');

    gemfdghfmjgdiff('fixtures/1.json', 'fixtures/2.json')
    expect(1).toBe(2);
});