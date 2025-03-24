const readline = require('readline');
const fs = require('fs');
const path = './tasks.json';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if (!fs.existsSync(path)) {
    rl.question('The tasks.json file does not exist. Would you like to create it? (yes/no): ', (answer) => {
        if (answer.toLowerCase() === 'yes') {
            fs.writeFileSync(path, JSON.stringify([]));
            console.log('tasks.json file has been created.');
        } else {
            console.log('tasks.json file was not created.');
        }
        rl.close();
    });
} else {
    console.log('Welcome to Kistunes CLI tracker!');
    console.log('For a list of all available commands, type "list". To exit, type "yeet".');
    waitForUserInput();
}

//handles user input with case sensitivity
function waitForUserInput() {
    rl.question('Enter a command: ', (command) => {
        if (command.toLowerCase() === 'yeet') {
            console.log('Goodbye!');
            rl.close();
        } else {
            console.log(`You entered: ${command}`);
            waitForUserInput(); // Wait for the next command
        }
    });
}

// Catch potential errors
rl.on("error", (err) => {
    console.error("Error:", err);
});
