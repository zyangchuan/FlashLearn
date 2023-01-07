export class cardStack {
  constructor(cards) {
    this.stack = cards;
  }
  //methods
  push (card) {
    this.stack.push(card);
  }
  pop() {
    if (this.isEmpty()) {
      return "stack is empty";
    }
    else {
      return this.stack.pop();
    }
  }
  peek() {
    return this.stack[this.stack.length - 1]
  }
  insert (card, noOfCardsAfter) {
    if (this.stack.length == 1) {
      this.stack.splice(0, 0, card)
    }
    else if (this.stack.length == 0) {
      this.push(card)
    }
    else {
      this.stack.splice(this.stack.length - noOfCardsAfter, 0, card)
    }
    
  }
  isEmpty() {
    return this.stack.length === 0
  }
  cardCount() {
    return this.stack.length
  }
}