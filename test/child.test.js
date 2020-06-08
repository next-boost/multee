const demoWorker = require('./demo-child')

describe('child_process', () => {
  let demo

  beforeAll(() => {
    demo = demoWorker()
  })

  it('simple string', async () => {
    const rv = await demo.test('me')
    expect(rv).toEqual('hello me')
  })

  it('echo object', async () => {
    const input = {
      age: 33,
      name: 'John',
      child: {
        name: 'Tom',
        age: 12,
      },
    }
    const rv = await demo.echo(input)
    expect(rv).toEqual(input)
  })

  it('echo with buffer', async () => {
    const input = {
      age: 33,
      name: Buffer.from('John'),
    }
    const rv = await demo.echo(input)
    expect(Buffer.from(rv.name)).toEqual(input.name)
    expect(rv.age).toEqual(input.age)
  })

  it('async', async () => {
    const rv = await demo.async()
    expect(rv).toEqual(1)
  })

  afterAll(() => {
    demo.close()
  })
})
