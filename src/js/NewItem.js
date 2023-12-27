class Item {
  constructor(name, calories) {
    this.id = Date.now();
    this.name = name;
    this.calories = calories;
  }
}
export default Item