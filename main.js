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
            case 'add task':
                addTask();
                waitForUserInput();
                break;
            case 'edit task':
                editTask();
                waitForUserInput();
                break;
            default:
                console.log(`Unknown command: ${command}`);
                waitForUserInput();
        }
    });
}

function addTask() {
    rl.question('Enter task description: ', (description) => {
        const tasks = JSON.parse(fs.readFileSync(path));
        const newTask = {
            id: tasks.length + 1,
            description: description,
            completed: false,
            dateCreated: new Date().toISOString()
        };
        tasks.push(newTask);
        fs.writeFileSync(path, JSON.stringify(tasks, null, 2));
        console.log('Task added successfully!');
        waitForUserInput();
    });
}

function editTask() {
    const tasks = JSON.parse(fs.readFileSync(path));
    if (tasks.length === 0) {
        console.log('No tasks to edit.');
        waitForUserInput();
        return;
    }

    console.log('\nCurrent Tasks:');
    tasks.forEach(task => {
        console.log(`[${task.id}] ${task.description} (${task.completed ? 'Completed' : 'Pending'})`);
    });

    rl.question('\nEnter the task ID you want to edit: ', (taskId) => {
        const task = tasks.find(t => t.id === parseInt(taskId));
        if (!task) {
            console.log('Task not found.');
            waitForUserInput();
            return;
        }

        rl.question('Would you like to mark this task as complete? (yes/no): ', (answer) => {
            if (answer.toLowerCase() === 'yes') {
                task.completed = true;
                fs.writeFileSync(path, JSON.stringify(tasks, null, 2));
                console.log('Task marked as complete!');
            } else {
                console.log('Task status unchanged.');
            }
            waitForUserInput();
        });
    });
}

// Catch potential errors
rl.on("error", (err) => {
    console.error("Error:", err);
});

function listCommands() {
    console.log('Available commands:');
    console.log('edit task - Edit an existing task');
    console.log('Add Task - Add a new task to the list');
    console.log('list - List all available commands');
    console.log('yeet - Exit the CLI');
}