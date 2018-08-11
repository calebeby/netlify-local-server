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
    "queryParams": Object {},
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
    "queryParams": Object {},
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
    "queryParams": Object {},
    "to": Array [
      "something",
      "else",
    ],
  },
]
`)
})

test('parses query params', () => {
  expect(
    parseConfig(`
/store id=:id  /blog/:id
/articles id=:id tag=:tag /posts/:tag/:id 301
`),
  ).toMatchInlineSnapshot(`
Array [
  Object {
    "code": 301,
    "from": Array [
      "store",
    ],
    "queryParams": Object {
      "id": ":id",
    },
    "to": Array [
      "blog",
      ":id",
    ],
  },
  Object {
    "code": 301,
    "from": Array [
      "articles",
    ],
    "queryParams": Object {
      "id": ":id",
      "tag": ":tag",
    },
    "to": Array [
      "posts",
      ":tag",
      ":id",
    ],
  },
]
`)
})
