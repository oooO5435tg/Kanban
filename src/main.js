new Vue({
    el: '#app',
    data(){
        return {
            newTask: {
                title: '',
                description: '',
                deadline: '',
                createdAt: new Date().toLocaleString(),
                lastChange: null,
                rreturn: null,
                isOverdue: false,
                tasks: [] // Инициализируем tasks пустым массивом
            },
            plannedTasks: [],
            progressTasks: [],
            testingTasks: [],
            completedTasks: [],
            editedTask: null,
            editedTaskIndex: null,
            editedColumn: null,
            taskReturnHistory: {}, // объект для хранения истории возвратов
        }
    },
    methods:{
        addTaskItem() {
            this.newTask.tasks.push('');
        },
        addTask() {
            if (!this.newTask.title) {
                alert('Необходимо указать заголовок задачи');
                return;
            }
            if (!this.newTask.description) {
                alert('Необходимо указать описание задачи');
                return;
            }
            if (!this.newTask.deadline) {
                alert('Необходимо указать дэдлайн (срок сдачи задачи)');
                return;
            }
            if (new Date(this.newTask.deadline) <= new Date(new Date().setDate(new Date().getDate()))) {
                alert('Недействительная дата дэдлайна (минимум должен быть - завтра)');
                return;
            }
            // Проверка и разделение списка задач
            if (this.newTask.tasks.length > 0) {
                this.newTask.tasks = this.newTask.tasks
                .filter(task => task.trim() !== '') // удаляем пустые элементы
                .map(task => ({ name: task, completed: false })); // добавляем чекбоксы в объекты списка задач
            }
        
            this.plannedTasks.push({...this.newTask});
            this.newTask = {
                title: '',
                description: '',
                deadline: '',
                createdAt: new Date().toLocaleString(),
                lastChange: null,
                tasks: []
            }
        },
        EditForm(taskIndex) {
            this[this.editedColumn][taskIndex] = {...this.editedTask, lastChange: new Date().toLocaleString()};
            this.editedTask = null;
            this.editedTaskIndex = null;
            this.editedColumn = null;
        },
        EditTask(taskIndex, column) {
            this.editedTask = {...this[column][taskIndex]};
            this.editedTaskIndex = taskIndex;
            this.editedColumn = column;
        },
        removeTask(taskIndex) {
            this.plannedTasks.splice(taskIndex, 1);
        },
        moveToInProgress(taskIndex) {
            const taskToMove = this.plannedTasks.splice(taskIndex, 1)[0];
            this.progressTasks.push(taskToMove);
        },
        moveToTesting(taskIndex) {
            const taskToMove = this.progressTasks.splice(taskIndex, 1)[0];
            this.testingTasks.push(taskToMove);
        },
        returnToInProgress(taskIndex) {
            const task = this.testingTasks[taskIndex];
            if (!task.rreturn) {
                alert('Необходимо указать причину возврата');
                return;
            }
            
            // Обновляем историю возвратов
            if (this.taskReturnHistory[task.id]) {
                this.taskReturnHistory[task.id].push(task.rreturn);
            } else {
                this.taskReturnHistory[task.id] = [task.rreturn];
            }
    
            // Передвигаем задачу в колонку progressTasks
            const taskToMove = this.testingTasks.splice(taskIndex, 1)[0];
            this.progressTasks.push(taskToMove);
        },
        moveToCompleted(taskIndex) {
            // Проверяем, что все пункты списка отмечены как выполненные
            const task = this.testingTasks[taskIndex];
            if (!task.tasks.every(taskItem => taskItem.completed)) {
                alert('Невозможно переместить задачу в столбец "Выполненные задачи", поскольку не все пункты списка задач отмечены как выполненные.');
                return;
            }

            const taskToMove = this.testingTasks.splice(taskIndex, 1)[0];
            taskToMove.isOverdue = new Date(taskToMove.deadline) < new Date();
            this.completedTasks.push(taskToMove);
        }
    }
})