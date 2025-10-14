import React from "react";
import "./To-Do-List.css";
import { useToDoListLogic } from "./To-Do-List-Function.js";
import emptyImage from "../assets/backgrounds/To-Do-List-pic.jpg";

function ToDoList() {
  const {
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
    progress, // ✅ added
  } = useToDoListLogic();

  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${backgrounds[index]})` }}
    >
      <div className="todo-app">
        <h1>To-Do List</h1>

        {/* ✅ Progress container */}
        <div className="stat-container">
          <div className="details">
            <h3>Keep it Up!</h3>
            <div id="Progressbar">
              <div
                id="progress"
                style={{ width: `${progress.percent}%` }}
              ></div>
            </div>
          </div>
          <div className="stats-number">
            <p id="numbers">
              {progress.completed}/{progress.total}
            </p>
          </div>
        </div>

        {/* ✅ Input form */}
        <form className="input-area" onSubmit={handleAddTask}>
          <input
            type="text"
            id="task-input"
            placeholder="Add a new task"
            value={editIndex !== null ? editValue : input}
            onChange={editIndex !== null ? handleEditValueChange : handleInputChange}
          />
          <button type="submit" id="add-task-btn">
            <i className="fa-solid fa-plus"></i>
          </button>
        </form>

        {/* ✅ Task list */}
        <div className="todos-container">
          <ul className="task-list">
            {tasks.map((task, idx) => (
              <li
                className={`task-list-item ${task.completed ? "completed" : ""}`}
                key={idx}
              >
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(idx)}
                />

                <span className="task-text">{task.text}</span>

                <button
                  className="edit-btn"
                  onClick={() => handleEditTask(idx)}
                  disabled={task.completed}
                  style={{
                    opacity: task.completed ? "0.5" : "1",
                    pointerEvents: task.completed ? "none" : "auto",
                  }}
                  title="Edit"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleRemoveTask(idx)}
                  title="Delete"
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
