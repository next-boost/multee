const { expect } = require('chai')
const demoWorker = require('./demo-child')

describe('child_process', () => {
  let demo

  before(() => {
    demo = demoWorker()
  })

  it('simple string', async () => {
    const rv = await demo.test('me')
    expect(rv).eq('hello me')
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
    expect(rv).to.deep.eq(input)
  })

  it('echo with buffer', async () => {
    const input = {
      age: 33,
      name: Buffer.from('John'),
    }
    const rv = await demo.echo(input)
    expect(Buffer.from(rv.name)).to.deep.eq(input.name)
    expect(rv.age).to.eq(input.age)
  })

  it('async', async () => {
    const rv = await demo.async()
    expect(rv).to.eq(1)
  })

  after(() => {
    demo.close()
  })
})
