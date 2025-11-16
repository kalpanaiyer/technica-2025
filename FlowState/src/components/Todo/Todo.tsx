import styles from './Todo.module.css'
import { useState } from 'react';

interface Task {
    id: number;
    text: string;
    completed: boolean;
    tokens: number;
}

const Todo: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showInput, setShowInput] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAddTask = () => {
        if (inputValue.trim()) {
            const newTask: Task = {
                id: Date.now(),
                text: inputValue,
                completed: false,
                tokens: 5
            };
            setTasks([...tasks, newTask]);
            setInputValue('');
            setShowInput(false);
        }
    };

    const handleToggleComplete = (id: number) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleDeleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
    };


    return (
        <>
            {!isExpanded ? (
                <div className={styles.tab} onClick={toggleExpanded}>
                    <h2>Todo</h2>
                    <span className={styles.arrow}>›</span>
                </div>
            ) : (
                <div className={styles.expanded_panel}>
                    <div className={styles.header}>
                        <h2>Todo</h2>
                        <span className={styles.arrow_back} onClick={toggleExpanded}>‹</span>
                    </div>  

                    {/* Task List */}
                    <div className={styles.task_list}>
                        {tasks.map(task => (
                            <div key={task.id} className={styles.task_item}>
                                <input 
                                    type="checkbox" 
                                    checked={task.completed}
                                    onChange={() => handleToggleComplete(task.id)}
                                    className={styles.checkbox}
                                />
                                <span className={task.completed ? styles.task_completed : styles.task_text}>
                                    {task.text}
                                </span>
                                <div className={styles.task_actions}>
                                    <div className={styles.token_display}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 17 20" fill="none">
                                            <path d="M16.9999 0.749477C16.9998 0.632647 16.9724 0.517452 16.9199 0.413074C16.8674 0.308697 16.7913 0.218024 16.6976 0.148283C16.6038 0.0785434 16.4951 0.031665 16.38 0.0113854C16.265 -0.00889416 16.1468 -0.0020139 16.0349 0.0314774L6.03486 3.03148C5.88033 3.07772 5.74483 3.17254 5.64845 3.30188C5.55208 3.43122 5.49997 3.58818 5.49986 3.74948V13.6265C4.85115 13.1748 4.06865 12.9561 3.27977 13.0058C2.49088 13.0555 1.74206 13.3709 1.15522 13.9004C0.568373 14.43 0.178064 15.1426 0.0478341 15.9222C-0.082396 16.7019 0.0551216 17.5027 0.437999 18.1942C0.820877 18.8857 1.42657 19.4273 2.15646 19.7307C2.88635 20.0341 3.69747 20.0816 4.45775 19.8653C5.21803 19.649 5.88271 19.1817 6.34357 18.5395C6.80443 17.8973 7.03434 17.118 6.99586 16.3285L6.99986 16.2495V8.30748L15.4999 5.75748V11.6275C14.8511 11.1758 14.0687 10.9571 13.2798 11.0068C12.4909 11.0565 11.7421 11.3719 11.1552 11.9014C10.5684 12.431 10.1781 13.1436 10.0478 13.9232C9.9176 14.7029 10.0551 15.5037 10.438 16.1952C10.8209 16.8867 11.4266 17.4283 12.1565 17.7317C12.8864 18.0351 13.6975 18.0826 14.4577 17.8663C15.218 17.65 15.8827 17.1827 16.3436 16.5405C16.8044 15.8983 17.0343 15.119 16.9959 14.3295L16.9999 14.2495V0.749477Z" fill="white"/>
                                        </svg>
                                        <span className={styles.token_count}>{task.tokens}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteTask(task.id)}
                                        className={styles.delete_btn}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Add Task Section */}
                    {!showInput ? (
                        <button 
                            className={styles.add_task_btn}
                            onClick={() => setShowInput(true)}
                        >
                            Add New Task
                        </button>
                    ) : (
                        <div className={styles.input_section}>
                            <input 
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                                placeholder="Enter a task"
                                className={styles.task_input}
                                autoFocus
                            />
                            <button 
                                onClick={handleAddTask}
                                className={styles.add_btn}
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default Todo