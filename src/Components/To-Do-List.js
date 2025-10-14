
// Pure function to add a task to the list
export function addTask(tasks, newTask) {
    const trimmed = newTask.trim();
    if (!trimmed) return tasks;
    return [...tasks, trimmed];
}

// Pure function to remove a task by index
export function removeTask(tasks, index) {
    return tasks.filter((_, i) => i !== index);
}

// Pure function to check if the task list is empty
export function isTaskListEmpty(tasks) {
    return tasks.length === 0;
}
