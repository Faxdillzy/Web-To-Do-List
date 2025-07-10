document.addEventListener('DOMContentLoaded', function() {
            const todoForm = document.querySelector('.todo-form');
            const todoTitleInput = document.getElementById('todo-title');
            const todoDateInput = document.getElementById('todo-date');
            const addTodoBtn = document.getElementById('add-todo');
            const todoItemsContainer = document.getElementById('todo-items');
            const filterBtns = document.querySelectorAll('.filter-btn');
            
            let todos = JSON.parse(localStorage.getItem('todos')) || [];
            let currentFilter = 'all';
            
            // Render todos based on current filter
            function renderTodos() {
                todoItemsContainer.innerHTML = '';
                
                const filteredTodos = todos.filter(todo => {
                    if (currentFilter === 'all') return true;
                    if (currentFilter === 'active') return !todo.completed;
                    if (currentFilter === 'completed') return todo.completed;
                    return true;
                });
                
                if (filteredTodos.length === 0) {
                    todoItemsContainer.innerHTML = '<div class="empty-state">Tidak ada aktivitas hari ini. Tambahkan aktivitas baru!</div>';
                    return;
                }
                
                filteredTodos.forEach((todo, index) => {
                    const todoItem = document.createElement('div');
                    todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                    todoItem.innerHTML = `
                        <div class="todo-info">
                            <div class="todo-title">${todo.title}</div>
                            <div class="todo-date">${formatDate(todo.date)}</div>
                        </div>
                        <div class="todo-actions">
                            <button class="delete-btn" data-id="${index}">Hapus</button>
                        </div>
                    `;
                    
                    todoItem.addEventListener('click', function(e) {
                        if (!e.target.classList.contains('delete-btn')) {
                            toggleTodoComplete(index);
                        }
                    });
                    
                    todoItemsContainer.appendChild(todoItem);
                });
                
                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        deleteTodo(parseInt(this.getAttribute('data-id')));
                    });
                });
            }
            
            // Format date to display
            function formatDate(dateString) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const date = new Date(dateString);
                return date.toLocaleDateString('id-ID', options);
            }
            
            // Add new todo
            function addTodo() {
                const title = todoTitleInput.value.trim();
                const date = todoDateInput.value;
                
                if (!title) {
                    alert('Silakan masukkan aktivitas!');
                    return;
                }
                
                if (!date) {
                    alert('Silakan pilih tanggal!');
                    return;
                }
                
                const newTodo = {
                    title,
                    date,
                    completed: false
                };
                
                todos.push(newTodo);
                saveTodos();
                renderTodos();
                
                // Reset form
                todoTitleInput.value = '';
                todoDateInput.value = '';
                todoTitleInput.focus();
            }
            
            // Toggle todo complete status
            function toggleTodoComplete(index) {
                todos[index].completed = !todos[index].completed;
                saveTodos();
                renderTodos();
            }
            
            // Delete todo
            function deleteTodo(index) {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            }
            
            // Save todos to localStorage
            function saveTodos() {
                localStorage.setItem('todos', JSON.stringify(todos));
            }
            
            // Event listeners
            addTodoBtn.addEventListener('click', addTodo);
            
            todoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                addTodo();
            });
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.getAttribute('data-filter');
                    renderTodos();
                });
            });
            
            // Set today's date as default
            const today = new Date().toISOString().split('T')[0];
            todoDateInput.value = today;
            
            // Initial render
            renderTodos();
        });
