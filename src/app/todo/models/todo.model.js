export default class Todo {
    constructor(id, timestamp, isComplete, description) {
        this.id = id;
        this.timestamp = timestamp;
        this.isComplete = isComplete;
        this.description = description;
    }
}