import React from "react";
import "./To-Do-List.css";
import { useToDoListLogic } from "./To-Do-List-Function.js";
import emptyImage from "../assets/backgrounds/To-Do-list-pic.jpg";

function ToDoList() {
  const {
    backgrounds,
    index,
    tasks,
    input,
    priority,
    category,
    dueDate,

    handleInputChange,
    handleAddTask,
    handleRemoveTask,
    handleEditTask,
    handleEditValueChange,
    handlePriorityChange,
    handleCategoryChange,
    handleDueDateChange,

    editIndex,
    editValue,

    handleToggleComplete,
    isTaskListEmpty,
    progress,
  } = useToDoListLogic();

  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${backgrounds[index]})` }}
    >
      <div className="todo-app">
        <h1>To-Do List</h1>

        {/* Progress container */}
        <div className="stat-container">
          <div className="details">
            <h3>Keep it Up!</h3>
            <div id="Progressbar">
              <div id="progress" style={{ width: `${progress.percent}%` }}></div>
            </div>
          </div>

          <div className="stats-number">
            <p id="numbers">{progress.completed}/{progress.total}</p>
          </div>
        </div>

        {/* Input form */}
        <form className="input-area" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Add a new task"
            value={editIndex !== null ? editValue : input}
            onChange={editIndex !== null ? handleEditValueChange : handleInputChange}
          />
          <button type="submit">
            <i className="fa-solid fa-plus"></i>
          </button>
        </form>

        {/* Priority | Category | Due Date */}
        <div className="task-options-row">
          <select value={priority} onChange={handlePriorityChange}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select value={category} onChange={handleCategoryChange}>
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>

          <input type="date" value={dueDate || ""} onChange={handleDueDateChange} />
        </div>

        {/* Task list */}
        <div className="todos-container">
          <ul className="task-list">
            {tasks.map((task, idx) => (
              <li
                key={idx}
                className={`task-list-item ${task.completed ? "completed" : ""}`}
              >
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(idx)}
                />

                {/* Task content */}
                <div className="task-content">
                  <span className="task-text">{task.text}</span>

                  <div className="task-meta">
                    <span className={`priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span>{task.category}</span>
                    {task.dueDate && <span>Due: {task.dueDate}</span>}
                  </div>
                </div>

                <button
                  className="edit-btn"
                  onClick={() => handleEditTask(idx)}
                  disabled={task.completed}
                >
                  <i className="fa-solid fa-pen"></i>
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleRemoveTask(idx)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </li>
            ))}
          </ul>

          {isTaskListEmpty(tasks) && (
            <img className="empty-image" src={emptyImage} alt="empty" />
          )}
        </div>
      </div>
    </div>
  );
}

export default ToDoList;
