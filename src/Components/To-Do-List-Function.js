import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { getBackgrounds, getNextBackgroundIndex } from "../utils/backgroundChanger.js";

// =======================
// Helper Functions
// =======================
export function addTask(tasks, newTask) {
  const trimmed = newTask.trim();
  if (!trimmed) return tasks;
  return [...tasks, { text: trimmed, completed: false }];
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
  const completed = tasks.filter((t) => t.completed).length;
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

// =======================
// Main Hook
// =======================
export function useToDoListLogic() {
  const backgrounds = getBackgrounds();
  const [index, setIndex] = useState(0);

  // Load tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [progress, setProgress] = useState({ completed: 0, total: 0, percent: 0 });

  // 🔄 Change background every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => getNextBackgroundIndex(prev));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // 📊 Update progress and save tasks whenever tasks change
  useEffect(() => {
    setProgress(calculateProgress(tasks));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 🎉 Trigger confetti if all tasks are already completed on page load
  useEffect(() => {
    const { completed, total } = calculateProgress(tasks);
    if (total > 0 && completed === total) {
      triggerConfetti();
    }
  }, []); // Run only once on mount

  // ➕ Add or Edit Task
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

    const newTasks = addTask(tasks, input);
    if (newTasks.length === tasks.length) {
      alert("Please enter a valid task.");
      return;
    }
    setTasks(newTasks);
    setInput("");
  };

  // ❌ Remove Task
  const handleRemoveTask = (idx) => {
    setTasks(removeTask(tasks, idx));
    if (editIndex === idx) {
      setEditIndex(null);
      setEditValue("");
    }
  };

  // ✏️ Edit Task
  const handleEditTask = (idx) => {
    if (tasks[idx].completed) return;
    setEditIndex(idx);
    setEditValue(tasks[idx].text);
  };

  // ✅ Toggle Complete + Trigger Confetti if All Done
  const handleToggleComplete = (idx) => {
    const updated = toggleTaskCompletion(tasks, idx);
    setTasks(updated);

    const { completed, total } = calculateProgress(updated);
    if (total > 0 && completed === total) {
      triggerConfetti();
    }
  };

  // Input Handlers
  const handleInputChange = (e) => setInput(e.target.value);
  const handleEditValueChange = (e) => setEditValue(e.target.value);

  return {
    backgrounds,
    index,
    tasks,
    input,
    handleInputChange,
    handleAddTask,
    handleRemoveTask,
    handleEditTask,
    handleEditValueChange,
    editIndex,
    editValue,
    handleToggleComplete,
    isTaskListEmpty,
    progress,
  };
}
