const { describe, it, before, afterEach, beforeEach } = require('mocha');
const { expect } = require('chai');
const { createSandbox } = require('sinon')

const TodoService = require('../src/todoService');
const Todo = require('../src/todo');


const mockDatabase = [
    {
        name: 'test',
        age: 88,
        meta: {
            revision: 0, created: 1611185653507, version: 0
        },
        '$loki': 1
    }
]


describe('todoService', () => {

    let sandbox

    before(() => {
        sandbox = createSandbox()
    })

    describe('#list', () => {

        it('should return data on a specific format', () => {
            const result = todoService.list()
            const [{ meta, $loki, ...expected }] = mockDatabase

            expect(result).to.be.deep.equal([expected])
        })

        let todoService
        beforeEach(() => {
            const dependecies = {
                todoRepository: {
                    list: sandbox.stub().returns(mockDatabase)
                }
            }
            todoService = new TodoService(dependecies)
        })



    })

    describe('#create', () => {

        it('shouldt save todo item with invalid data', () => {
            const data = new Todo({
                text: '',
                when: ''
            })

            Reflect.deleteProperty(data, "id")

            const expected = {
                error: {
                    message: 'invalid data', data: data
                }
            }

            const result = todoService.create(data)
            expect(result).to.be.deep.equal(expected)

        })

        it('shouldnt save todo item with late status when the property is further than today', () => {
            const properties = {
                text: 'i must go to the gym',
                when: new Date('2020-12-22 12:00:00 GTM-0')
            }

            const expectedId = '000001'

            const uuid = require('uuid')
            const fakeUUID = sandbox.fake.returns(expectedId)
            sandbox.replace(uuid, uuid.v4.name, fakeUUID)

            const todo = new Todo(properties)

            const today = new Date('2021-01-22')
            sandbox.useFakeTimers(today.getTime())

            todoService.create(todo)

            const expectedCallWith = {
                ...todo,
                status: 'late'
            }

            expect(todoService.todoRepository.create.calledOnceWithExactly(expectedCallWith)).to.be.ok

        })

        it('should save todo item with pending status ', () => {

        })

        let todoService
        beforeEach(() => {
            const dependecies = {
                todoRepository: {
                    create: sandbox.stub().returns(true)
                }
            }
            todoService = new TodoService(dependecies)
        })



    })

})