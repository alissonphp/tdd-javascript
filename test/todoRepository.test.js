const { describe, it, before, afterEach } = require('mocha');
const { expect } = require('chai');
const { createSandbox } = require('sinon')

const TodoRepository = require('../src/todoRepository');

const mockDatabase = [
    {
        name: 'test',
        age: 88,
        meta: {
            revision: 0, created: 1611185653507, version: 0
        },
        '$loki': 1
    },
    {
        name: 'test-new',
        age: 68,
        meta: {
            revision: 0, created: 1611185653507, version: 0
        },
        '$loki': 2
    }
]

describe('todoRepository', () => {
    let todoRepository
    let sandbox
    before(() => {
        todoRepository = new TodoRepository()
        sandbox = createSandbox()
    })
    afterEach(() => {
        sandbox.restore()
    })
    describe('methods signature', () => {
        it('should call find from lokijs', () => {
            
            const functionName = 'find'
            const expectedReturn = mockDatabase

            sandbox.stub(
                todoRepository.schedule,
                functionName
            ).returns(expectedReturn)

            const result = todoRepository.list()
            expect(result).to.be.deep.equal(expectedReturn)
            expect(todoRepository.schedule[functionName].calledOnce).to.be.ok

        })
        it('should call insertOne from lokijs', () => {

            const functionName = 'insertOne'
            const expectedReturn = true

            const data = { key: 'value' }

            sandbox.stub(
                todoRepository.schedule,
                functionName
            ).returns(expectedReturn)

            const result = todoRepository.create(data)
            expect(result).to.be.ok
            expect(todoRepository.schedule[functionName].calledOnceWithExactly(data)).to.be.ok

        })
    })
})