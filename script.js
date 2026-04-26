// 1. المتغيرات الأساسية
let tasks = JSON.parse(localStorage.getItem('proTasks')) || [];
let currentFilter = 'All';

const taskForm = document.getElementById('taskForm');
const tasksContainer = document.getElementById('tasksContainer');
const taskCountElement = document.getElementById('taskCount');

// 2. عرض المهام وتحديث العداد
function renderTasks() {
    tasksContainer.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'All') return true;
        if (currentFilter === 'Completed') return task.completed;
        return task.category === currentFilter;
    });

    if (taskCountElement) {
        const pendingTasks = tasks.filter(t => !t.completed).length;
        taskCountElement.innerText = pendingTasks;
    }

    filteredTasks.forEach((task, index) => {
        let badgeClass = task.category === 'Urgent' ? 'bg-danger-subtle text-danger' : 
                         task.category === 'Personal' ? 'bg-success-subtle text-success' : 
                         'bg-primary-subtle text-primary';

        const opacity = task.completed ? '0.6' : '1';
        const textDecoration = task.completed ? 'text-decoration-line-through text-muted' : '';

        tasksContainer.innerHTML += `
            <div class="col-12 col-md-6 col-xl-4" style="opacity: ${opacity}; transition: 0.3s">
                <div class="card h-100 border-0 shadow-sm p-3 rounded-4 hover-card">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge ${badgeClass} px-3 py-2 rounded-pill small">${task.category}</span>
                        <button onclick="deleteTask(${index})" class="btn btn-link text-danger p-0 border-0">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                    <h5 class="fw-bold mb-2 ${textDecoration}">${task.title}</h5>
                    <p class="text-muted small mb-4">Created on ${task.date}</p>
                    <div class="mt-auto border-top pt-3 d-flex justify-content-end">
                        <input class="form-check-input" type="checkbox" 
                               ${task.completed ? 'checked' : ''} 
                               onclick="toggleComplete(${index})" style="width: 1.3rem; height: 1.3rem; cursor:pointer;">
                    </div>
                </div>
            </div>
        `;
    });
}

// 3. إضافة وحذف وتعديل المهام
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    tasks.push({
        title: document.getElementById('taskTitle').value,
        category: document.getElementById('taskCategory').value,
        date: new Date().toLocaleDateString(),
        completed: false
    });
    saveAndRender();
    bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
    taskForm.reset();
});

function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRender();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('proTasks', JSON.stringify(tasks));
    renderTasks();
}

// 4. الفلترة في السايدبار
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('bg-primary', 'text-white'));
        btn.classList.add('bg-primary', 'text-white');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

// 5. نظام إدراة اسم المستخدم بالمودال (النسخة النهائية)
function setupUserProfile() {
    let savedName = localStorage.getItem('proTaskUserName');
    const nameModalElement = document.getElementById('nameModal');
    
    if (!nameModalElement) return; 

    const nameModal = new bootstrap.Modal(nameModalElement);

    if (!savedName) {
        nameModal.show();
        document.getElementById('saveNameBtn').addEventListener('click', () => {
            const inputName = document.getElementById('nameInput').value.trim();
            if (inputName) {
                localStorage.setItem('proTaskUserName', inputName);
                applyUserData(inputName);
                nameModal.hide();
            }
        });
    } else {
        applyUserData(savedName);
    }
}

function applyUserData(name) {
    const nameElement = document.getElementById('userName');
    const avatarElement = document.getElementById('userAvatar');
    if(nameElement) nameElement.innerText = name;
    if(avatarElement) avatarElement.innerText = name.charAt(0).toUpperCase();
}

// تشغيل النظام
renderTasks();
setupUserProfile();