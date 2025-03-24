const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Typet o get a welcome message: ', (answer) => {
    console.log('You typed:', answer);
    rl.close();
});

// Catch potential errors
rl.on("error", (err) => {
    console.error("Error:", err);
});
