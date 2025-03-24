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

//main sorting function for the user input , converts user input to lowercase and calls relevant function
function waitForUserInput() {
    rl.question('Enter a command: ', (command) => {
        const input = command.toLowerCase();
        switch(input) {
            case 'yeet':
                console.log('Goodbye!');
                rl.close();
                break;
            case 'list':
                listCommands();
                waitForUserInput();
                break;
            default:
                console.log(`Unknown command: ${command}`);
                waitForUserInput();
        }
    });
}

// Catch potential errors
rl.on("error", (err) => {
    console.error("Error:", err);
});

function listCommands() {
    console.log('Available commands:');
    console.log('list - List all available commands');
    console.log('yeet - Exit the CLI');
}