import Todo from "../models/todo.model.js";
import {TodoSortOptions} from "../models/todo-sort-options.model.js";

export class TodoService {
    #TODO_LIST_ID = 'todo_items';
    #todos = [];

    async get(id) {
        await this.#fetchItems()

        const todo = this.#todos.find(p => p.id === id)

        if (!todo) {
            throw new Error('Not found')
        }
        return todo
    }

    async getAll(sortInfo) {
        await this.#fetchItems();

        let todos = this.#todos;

        switch (sortInfo.sortOption) {
            case TodoSortOptions.TIMESTAMP:
                sortInfo.isAsc
                    ? todos.sort((a, b) => a.timestamp - b.timestamp)
                    : todos.sort((a, b) => b.timestamp - a.timestamp);
                break;
            case TodoSortOptions.DESCRIPTION:
                sortInfo.isAsc
                    ? todos.sort((a, b) => a.description.localeCompare(b.description))
                    : todos.sort((a, b) => b.description.localeCompare(a.description));
                break;
            case TodoSortOptions.IS_COMPLETED:
                sortInfo.isAsc
                    ? todos.sort((a, b) => +a.isComplete - +b.isComplete)
                    : todos.sort((a, b) => +b.isComplete - +a.isComplete);
                break;
        }

        return todos;
    }


    // description
    async add(dto) {
        if (!dto.description || dto.description.match(/^ *$/)) {
            throw new Error('Please enter valid task description');
        }

        await this.#fetchItems();

        let todo = new Todo(crypto.randomUUID(), Date.now(), false, dto.description);
        this.#todos.push(todo);

        await this.#saveChanges();
    }

    // id, isComplete, Description
    async update(dto) {
        if (!dto.description || dto.description(/^ *$/)) {
            throw new Error('Please enter valid task description');
        }

        if (!dto.isComplete) {
            throw new Error('Invalid completion state');
        }

        let todo = await this.get(dto.id);

        todo.description = dto.description;
        todo.isComplete = dto.isComplete;

        await this.#saveChanges()
    }

    async delete(id) {
        await this.#fetchItems();

        const index = this.#todos.findIndex(p => p.id === id);
        this.#todos.splice(index, 1);

        await this.#saveChanges();
    }

    async #fetchItems() {
        await new Promise((resolve) => {
            setTimeout(() => {
                let todosStr = localStorage.getItem(this.#TODO_LIST_ID);

                this.#todos = todosStr
                    ? JSON.parse(todosStr)
                    : [];

                resolve();
            }, 1000);
        });
    }

    async #saveChanges() {
        await new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem(this.#TODO_LIST_ID, JSON.stringify(this.#todos))
                resolve();
            }, 1000);
        });
    }
}