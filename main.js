import { createInterface } from 'readline';
import { existsSync, writeFileSync, readFileSync } from 'fs';
const path = './tasks.json';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

// Get command line arguments (excluding node and script path)
const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();

if (!existsSync(path)) {
    writeFileSync(path, JSON.stringify([]));
    console.log('tasks.json file has been created.');
}

// Handle commands based on arguments
if (args.length > 0) {
    handleCommand(command, args);
} else {
    console.log('Welcome to Kistunes CLI tracker!');
    console.log('For a list of all available commands, type "list". To exit, type "yeet".');
    waitForUserInput();
}

function handleCommand(command, args) {
    switch(command) {
        case 'add':
            const description = args.slice(1).join(' ');
            if (description) {
                addTask(description);
            } else {
                console.log('Please provide a task description.');
            }
            waitForUserInput();
            break;

        case 'edit':
            editTask();
            break;
        case 'delete':
            deleteTask();
                break;

        case 'list':
            listCommands();
            waitForUserInput();
            break;

        case 'yeet':
            console.log('Goodbye!');
            rl.close();
            break;

        default:
            console.log(`Unknown command: ${command}`);
            waitForUserInput();
    }
}


function addTask(description) {
    const tasks = JSON.parse(readFileSync(path));
    const newTask = {
        id: tasks.length + 1,
        description: description,
        completed: false,
        dateCreated: new Date().toISOString()
    };
    tasks.push(newTask);
    writeFileSync(path, JSON.stringify(tasks, null, 2));
    console.log('Task added successfully!');
}

function editTask() {
    const tasks = JSON.parse(readFileSync(path));

    if (tasks.length === 0) {
        console.log('No tasks available to edit.');
        return waitForUserInput();
    }

    console.log('\nAvailable tasks to edit:');
    tasks.forEach(task => {
        console.log(`[${task.id}] ${task.description} - ${task.completed ? '✅ Completed' : '❌ Not Completed'}`);
    });

    rl.question('\nEnter the task ID to edit: ', (taskIdInput) => {
        const taskId = parseInt(taskIdInput.trim());

        if (!taskId || !tasks.some(t => t.id === taskId)) {
            console.log('Invalid task ID. Please try again.');
            return waitForUserInput();
        }

        const task = tasks.find(t => t.id === taskId);

        rl.question(`Would you like to mark the task "${task.description}" as complete? (yes/no): `, (answer) => {
            if (answer.toLowerCase() === 'yes') {
                task.completed = true;
                writeFileSync(path, JSON.stringify(tasks, null, 2));
                console.log('✅ Task marked as complete!');
            } else {
                console.log('Task status unchanged.');
            }
            waitForUserInput();
        });
    });
}



function listCommands() {
    console.log('Available commands:');
    console.log('  add <task description>  - Add a new task');
    console.log('  edit <taskId>           - Edit an existing task');
    console.log('  list                    - List all available commands');
    console.log('  yeet                    - Exit the CLI');
}

function waitForUserInput() {
    rl.question('\nEnter a command: ', (input) => {
        const args = input.trim().split(' ');
        const command = args[0]?.toLowerCase();

        if (!command) {
            console.log('No command entered. Please try again.');
            return waitForUserInput();
        }

        handleCommand(command, args);
    });
}

function deleteTask() {
    const tasks = JSON.parse(readFileSync(path));

    if (tasks.length === 0) {
        console.log('No tasks available to delete.');
        return waitForUserInput();
    }

    console.log('\nAvailable tasks to delete:');
    tasks.forEach(task => {
        console.log(`[${task.id}] ${task.description} - ${task.completed ? '✅ Completed' : '❌ Not Completed'}`);
    });

    rl.question('\nEnter the task ID to delete: ', (taskIdInput) => {
        const taskId = parseInt(taskIdInput.trim());

        if (!taskId || !tasks.some(t => t.id === taskId)) {
            console.log('Invalid task ID. Please try again.');
            return waitForUserInput();
        }

        const task = tasks.find(t => t.id === taskId);

        rl.question(`Are you sure you want to delete the task "${task.description}"? (yes/no): `, (answer) => {
            if (answer.toLowerCase() === 'yes') {
                // Remove the task from the tasks array
                const updatedTasks = tasks.filter(t => t.id !== taskId);
                writeFileSync(path, JSON.stringify(updatedTasks, null, 2));
                console.log('✅ Task deleted successfully!');
            } else {
                console.log('Task deletion canceled.');
            }
            waitForUserInput();
        });
    });
}
