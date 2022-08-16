export default class Stack<T> {
  constructor(public items: T[] = []) {}

  get empty() {
    return this.items.length < 1;
  }

  get top() {
    if (this.items.length) return this.items[this.items.length - 1];
    throw new Error("Stack is empty");
  }

  push(item: T) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  clear() {
    this.items.splice(0);
  }
}
