import parseConfig from '.'

test('parses simple config', () => {
  expect(
    parseConfig(`
  / /something/else/ 200!
  /foo/*   /:something/else/\t 200!

  # this is a comment

  /baz /something/else/ 301
  `),
  ).toMatchInlineSnapshot(`
Array [
  Object {
    "code": 200,
    "from": Array [],
    "to": Array [
      "something",
      "else",
    ],
  },
  Object {
    "code": 200,
    "from": Array [
      "foo",
      "*",
    ],
    "to": Array [
      ":something",
      "else",
    ],
  },
  Object {
    "code": 301,
    "from": Array [
      "baz",
    ],
    "to": Array [
      "something",
      "else",
    ],
  },
]
`)
})
