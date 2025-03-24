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
        case 'start':
            listTasksToStart();
            break;
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
        case 'listdone':
            listCompletedTasks();
            waitForUserInput();
            break;
        case 'listinprogress':
                listInProgressTasks();
                waitForUserInput();
                break;
        case 'listincomplete':
                    listIncompleteTasks();
                    waitForUserInput();
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
        status: 'not started',  
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
    console.log('  listdone                - List all completed tasks');
    console.log('  listinprogress          - List all tasks in progress');      
    console.log('  listincomplete          - List all incomplete tasks');
    console.log('  start                   - Start a task');
    console.log('  delete                  - Delete a task');

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


function listCompletedTasks() {
    const tasks = JSON.parse(readFileSync(path));

    const completedTasks = tasks.filter(task => task.completed);

    if (completedTasks.length === 0) {
        console.log('No completed tasks found.');
        return waitForUserInput();
    }

    console.log('\nCompleted Tasks:');
    completedTasks.forEach(task => {
        console.log(`[${task.id}] ${task.description} - ✅ Completed`);
    });
}


function listIncompleteTasks() {
    const tasks = JSON.parse(readFileSync(path));

    const incompleteTasks = tasks.filter(task => !task.completed);

    if (incompleteTasks.length === 0) {
        console.log('No incomplete tasks found.');
        return waitForUserInput();
    }

    console.log('\nIncomplete Tasks:');
    incompleteTasks.forEach(task => {
        console.log(`[${task.id}] ${task.description} - ❌ Not Completed`);
    });
}


function listInProgressTasks() {
    const tasks = JSON.parse(readFileSync(path));

    const inProgressTasks = tasks.filter(task => task.status === 'in progress');

    if (inProgressTasks.length === 0) {
        console.log('No tasks are in progress.');
        return waitForUserInput();
    }

    console.log('\nIn Progress Tasks:');
    inProgressTasks.forEach(task => {
        console.log(`[${task.id}] ${task.description} - 🟡 In Progress`);
    });
}

function listTasksToStart() {
    const tasks = JSON.parse(readFileSync(path));

    // Filter tasks that are not yet started or already in progress
    const tasksToStart = tasks.filter(task => task.status === 'not started' || task.status === 'in progress');

    if (tasksToStart.length === 0) {
        console.log('No tasks available to start.');
        return waitForUserInput();
    }

    console.log('\nAvailable tasks to start:');
    tasksToStart.forEach(task => {
        console.log(`[${task.id}] ${task.description} - ${task.status === 'in progress' ? '🟡 In Progress' : '🔲 Not Started'}`);
    });

    // Prompt the user to select a task ID to start
    rl.question('Enter the task ID to start: ', (taskIdInput) => {
        const taskId = parseInt(taskIdInput);

        if (isNaN(taskId)) {
            console.log('Invalid task ID. Please enter a valid number.');
            return listTasksToStart();
        }

        const task = tasks.find(t => t.id === taskId);

        if (!task) {
            console.log('Task not found.');
            return listTasksToStart();
        }

        if (task.status === 'completed') {
            console.log('This task is already completed.');
            return listTasksToStart();
        }

        // Mark the task as in progress
        task.status = 'in progress';
        writeFileSync(path, JSON.stringify(tasks, null, 2));
        console.log('Task is now in progress!');
        waitForUserInput();
    });
}
