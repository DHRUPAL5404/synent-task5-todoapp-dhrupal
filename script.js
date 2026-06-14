/**
 * TaskFlow Web Application Script
 * Author: Dhrupal Godhani
 * Focus: Phase 3 - Add, Delete, Complete, Validation, and localStorage Support
 */

// SELECTORS
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');

// STATE (Active Tasks Count)
let activeTasksCount = 0;

// FUNCTION: Update Task Counter Display
function updateCounter() {
    taskCounter.textContent = `${activeTasksCount} Task${activeTasksCount !== 1 ? 's' : ''}`;
}

// FUNCTION: Save Task List to localStorage
function saveTasks() {
    const tasks = [];
    const cards = taskList.querySelectorAll('.task-card');
    
    cards.forEach(card => {
        const text = card.querySelector('.task-text').textContent;
        const completed = card.classList.contains('completed');
        tasks.push({ text, completed });
    });
    
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

// FUNCTION: Load Task List from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || [];
    taskList.innerHTML = '';
    activeTasksCount = 0;
    
    tasks.forEach(task => {
        createTaskElement(task.text, task.completed);
    });
    
    updateCounter();
}

// FUNCTION: Build and Insert Task Card DOM element
function createTaskElement(taskText, isCompleted = false) {
    // Create Task Card Element
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    if (isCompleted) {
        taskCard.classList.add('completed');
    }
    
    // 1. Create Complete Toggle Button (Custom Checkbox)
    const checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'check-btn';
    checkBtn.ariaLabel = 'Mark Task Completed';
    checkBtn.innerHTML = '<span class="check-icon">✓</span>';

    // 2. Create Task Text element
    const taskContent = document.createElement('span');
    taskContent.className = 'task-text';
    taskContent.textContent = taskText;

    // 3. Create Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.ariaLabel = 'Delete Task';
    deleteBtn.innerHTML = `
        <svg class="trash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    `;

    // Toggle Complete event listener
    checkBtn.addEventListener('click', () => {
        taskCard.classList.toggle('completed');
        saveTasks();
    });

    // Delete Task event listener
    deleteBtn.addEventListener('click', () => {
        // Simple slide-out exit animation before removing from DOM
        taskCard.style.transform = 'scale(0.9) translateX(20px)';
        taskCard.style.opacity = '0';
        
        setTimeout(() => {
            taskCard.remove();
            activeTasksCount--;
            updateCounter();
            saveTasks();
        }, 250);
    });

    // Append child elements to task card
    taskCard.appendChild(checkBtn);
    taskCard.appendChild(taskContent);
    taskCard.appendChild(deleteBtn);

    // Append card to list
    taskList.appendChild(taskCard);

    // Increment Task Counter
    activeTasksCount++;
}

// FUNCTION: Add Task Trigger Handler
function handleAddTask() {
    const taskText = taskInput.value.trim();

    // Validation: Empty inputs should show alert
    if (taskText === '') {
        alert('Please enter a task description.');
        return;
    }

    createTaskElement(taskText, false);
    updateCounter();
    saveTasks();

    // Reset input field and restore focus
    taskInput.value = '';
    taskInput.focus();
}

// EVENT LISTENERS
addBtn.addEventListener('click', handleAddTask);

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleAddTask();
    }
});

// INITIALIZATION
window.addEventListener('DOMContentLoaded', loadTasks);
