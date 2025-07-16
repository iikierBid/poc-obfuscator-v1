import '../css/styles.css';

class Task {
    constructor(text) {
        this.id = Date.now();
        this.text = text;
        this.completed = false;
    }
}

class ToDoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.filter = 'all'; // 'all', 'active', 'completed'

        this.taskForm = document.getElementById('task-form');
        this.taskInput = document.getElementById('task-input');
        this.taskList = document.getElementById('task-list');
        this.taskCount = document.getElementById('task-count');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.filtersContainer = document.querySelector('.filters');

        this.init();
    }

    init() {
        this.taskForm.addEventListener('submit', this.addTask.bind(this));
        this.taskList.addEventListener('click', this.handleTaskClick.bind(this));
        this.clearCompletedBtn.addEventListener('click', this.clearCompleted.bind(this));
        this.filtersContainer.addEventListener('click', this.handleFilterClick.bind(this));
        this.render();
    }

    save() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask(e) {
        e.preventDefault();
        const text = this.taskInput.value.trim();
        if (text) {
            this.tasks.push(new Task(text));
            this.taskInput.value = '';
            this.save();
            this.render();
        }
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.save();
        this.render();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.save();
        this.render();
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.save();
        this.render();
    }

    handleTaskClick(e) {
        const target = e.target;
        const taskId = parseInt(target.closest('.task-item').dataset.id, 10);

        if (target.classList.contains('toggle')) {
            this.toggleTask(taskId);
        } else if (target.classList.contains('destroy')) {
            this.deleteTask(taskId);
        }
    }
    
    setFilter(filter) {
        this.filter = filter;
        this.render();
    }
    
    handleFilterClick(e) {
        const target = e.target;
        if (target.matches('.filter-btn')) {
            this.setFilter(target.dataset.filter);
        }
    }

    getFilteredTasks() {
        switch (this.filter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    render() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = filteredTasks.map(task => this.createTaskElement(task)).join('');
        this.updateTaskCount();
        this.updateFilters();
        this.toggleClearCompletedButton();
    }

    createTaskElement(task) {
        return `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="view">
                    <input class="toggle" type="checkbox" ${task.completed ? 'checked' : ''}>
                    <label class="task-text">${task.text}</label>
                    <button class="destroy"></button>
                </div>
            </li>
        `;
    }

    updateTaskCount() {
        const activeTasks = this.tasks.filter(task => !task.completed).length;
        const plural = activeTasks !== 1 ? 's' : '';
        this.taskCount.textContent = `${activeTasks} tarefa${plural} restante${plural}`;
    }
    
    updateFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === this.filter);
        });
    }

    toggleClearCompletedButton() {
        const hasCompleted = this.tasks.some(task => task.completed);
        this.clearCompletedBtn.style.display = hasCompleted ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ToDoApp();
}); 