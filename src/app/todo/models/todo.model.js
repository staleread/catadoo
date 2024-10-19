export default class Todo {
    constructor(id, timestamp, isCompleted, description) {
        this.id = id;
        this.timestamp = timestamp;
        this.isCompleted = isCompleted;
        this.description = description;
    }
}