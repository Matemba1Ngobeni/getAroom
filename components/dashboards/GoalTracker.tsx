
import React from 'react';
import type { Goal, GoalTask } from '../../types';

interface GoalTrackerProps {
    goals: Goal[];
    onAddGoal: (goal: Omit<Goal, 'id' | 'tasks'> & { tasks: Omit<GoalTask, 'id' | 'completed'>[] }) => void;
    onToggleGoalTask: (goalId: string, taskId: string) => void;
}

const ProgressBar: React.FC<{ tasks: GoalTask[] }> = ({ tasks }) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-medium text-slate-600">Progress</span>
                <span className="font-semibold text-teal-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

const GoalTracker: React.FC<GoalTrackerProps> = ({ goals, onAddGoal, onToggleGoalTask }) => {
    // Note: A full form for adding goals would be implemented here.
    // For this implementation, we will focus on displaying existing goals.

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-xl font-bold text-slate-800">Your Goals</h2>
                <button className="text-sm font-semibold text-teal-600 hover:text-teal-700" onClick={() => alert('Add goal functionality would open a form here.')}>
                    <i className="fas fa-plus mr-1"></i> Add Goal
                </button>
            </div>
            <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                {goals.map(goal => (
                    <div key={goal.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="font-bold text-lg text-slate-800">{goal.title}</h3>
                        <p className="text-sm text-slate-600 mt-1 mb-4">{goal.description}</p>
                        
                        <ProgressBar tasks={goal.tasks} />

                        <div className="mt-4 space-y-2">
                            {goal.tasks.map(task => (
                                <label key={task.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-100 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => onToggleGoalTask(goal.id, task.id)}
                                        className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                    />
                                    <span className={`flex-grow text-slate-700 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                                        {task.text}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalTracker;
