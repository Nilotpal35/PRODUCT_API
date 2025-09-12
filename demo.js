const inventory = [
  { name: "Nilotpal", age: 26, color: "white" },
  { name: "Priyanka", age: 27, color: "Medium" },
  { name: "Moumita", age: 27, color: "white" },
  { name: "Tushar", age: 25, color: "Medium" },
  { name: "Ankit", age: 26, color: "Black" },
  { name: "Satyam", age: 28, color: "Medium" },
];

const finalResult = Array.prototype.group(inventory, ({ age }) =>
  age > 26 ? "adult" : "child"
);


console.log('final value', finalResult);