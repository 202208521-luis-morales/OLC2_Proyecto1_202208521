let originalArray = [1, 2, 3];
let copiedArray = [...originalArray];

// Cambiar el nuevo array no afecta al original
copiedArray[0] = 10;

console.log(originalArray); // [1, 2, 3]
console.log(copiedArray);   // [10, 2, 3]
