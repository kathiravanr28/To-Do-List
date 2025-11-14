import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { getBackgrounds, getNextBackgroundIndex } from "../utils/backgroundChanger.js";

// Helper Functions
export function addTask(tasks, newTask, priority = "Medium", dueDate = null, category = "General") {
  const trimmed = newTask.trim();
  if (!trimmed) return tasks;
  return [...tasks, { text: trimmed, completed: false, priority, dueDate, category }];
}

export function removeTask(tasks, index) {
  return tasks.filter((_, i) => i !== index);
}

export function toggleTaskCompletion(tasks, index) {
  return tasks.map((task, i) =>
    i === index ? { ...task, completed: !task.completed } : task
  );
}

export function isTaskListEmpty(tasks) {
  return tasks.length === 0;
}

export function calculateProgress(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}

export function triggerConfetti() {
  const count = 200;
  const defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    }));
  }
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

// Main Hook
export function useToDoListLogic() {
  const backgrounds = getBackgrounds();
  const [index, setIndex] = useState(0);

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.length > 0 && parsed.every(t => t.completed) ? [] : parsed;
  });

  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(null);
  const [category, setCategory] = useState("General");

  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [progress, setProgress] = useState({ completed: 0, total: 0, percent: 0 });

  useEffect(() => {
    const interval = setInterval(() => setIndex(prev => getNextBackgroundIndex(prev)), 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setProgress(calculateProgress(tasks));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const { completed, total } = calculateProgress(tasks);
    if (total > 0 && completed === total) triggerConfetti();
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      const updated = tasks.map((t, i) =>
        i === editIndex ? { ...t, text: editValue.trim() } : t
      );
      setTasks(updated);
      setEditIndex(null);
      setEditValue("");
      setInput("");
      return;
    }

    const newTasks = addTask(tasks, input, priority, dueDate, category);

    if (newTasks.length === tasks.length) {
      alert("Please enter a valid task.");
      return;
    }

    setTasks(newTasks);
    setInput("");
  };

  const handleRemoveTask = idx => {
    setTasks(removeTask(tasks, idx));
    if (editIndex === idx) {
      setEditIndex(null);
      setEditValue("");
    }
  };

  const handleEditTask = idx => {
    if (tasks[idx].completed) return;
    setEditIndex(idx);
    setEditValue(tasks[idx].text);
  };

  const handleToggleComplete = idx => {
    const updated = toggleTaskCompletion(tasks, idx);
    setTasks(updated);

    const { completed, total } = calculateProgress(updated);
    if (total > 0 && completed === total) triggerConfetti();
  };

  return {
    backgrounds,
    index,
    tasks,
    input,
    priority,
    dueDate,
    category,

    handleInputChange: e => setInput(e.target.value),
    handleAddTask,
    handleRemoveTask,
    handleEditTask,
    handleEditValueChange: e => setEditValue(e.target.value),

    handlePriorityChange: e => setPriority(e.target.value),
    handleDueDateChange: e => setDueDate(e.target.value),
    handleCategoryChange: e => setCategory(e.target.value),

    editIndex,
    editValue,
    handleToggleComplete,

    isTaskListEmpty,
    progress
  };
}
