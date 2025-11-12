
import React, { useState } from 'react';
import type { TimeManagerEvent, Goal, GoalTask } from '../../types';
import GoalTracker from './GoalTracker';
import AddEventModal from './AddEventModal';

interface TimeManagerDashboardProps {
    events: TimeManagerEvent[];
    goals: Goal[];
    onAddEvent: (event: Omit<TimeManagerEvent, 'id'>) => void;
    onDeleteEvent: (eventId: string) => void;
    onAddGoal: (goal: Omit<Goal, 'id' | 'tasks'> & { tasks: Omit<GoalTask, 'id' | 'completed'>[] }) => void;
    onToggleGoalTask: (goalId: string, taskId: string) => void;
    onClose: () => void;
}

const getCategoryIcon = (category: TimeManagerEvent['category']) => {
    const iconMap = {
        Timetable: 'fa-calendar-alt',
        Assignment: 'fa-file-alt',
        Test: 'fa-vial',
        Appointment: 'fa-user-md',
        Study: 'fa-book-open',
        Birthday: 'fa-birthday-cake',
        'Rent Due': 'fa-dollar-sign',
        Sleep: 'fa-bed',
        Exercise: 'fa-dumbbell',
        Personal: 'fa-star',
    };
    return iconMap[category] || 'fa-question-circle';
};

const TimeManagerDashboard: React.FC<TimeManagerDashboardProps> = ({ events, goals, onAddEvent, onDeleteEvent, onAddGoal, onToggleGoalTask, onClose }) => {
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = events
        .filter(e => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 10);

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in">
                <div className="bg-slate-50 rounded-xl shadow-2xl w-full h-full flex flex-col">
                    {/* Header */}
                    <header className="flex-shrink-0 p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <i className="fas fa-clock text-2xl text-teal-600"></i>
                            <h1 className="text-2xl font-extrabold text-slate-800">Time Management Hub</h1>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <i className="fas fa-times text-2xl"></i>
                        </button>
                    </header>

                    {/* Main Content */}
                    <main className="flex-grow p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Left Column: Agenda */}
                        <section className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-800">Upcoming Agenda</h2>
                                <button onClick={() => setIsAddEventModalOpen(true)} className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                                    <i className="fas fa-plus mr-1"></i> Add Entry
                                </button>
                            </div>
                            <div className="space-y-3 overflow-y-auto flex-grow pr-2">
                                {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                                            <i className={`fas ${getCategoryIcon(event.category)}`}></i>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-slate-800">{event.title}</p>
                                            <p className="text-sm text-slate-500">
                                                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                {event.startTime && ` at ${event.startTime}`}
                                            </p>
                                        </div>
                                         <button onClick={() => onDeleteEvent(event.id)} className="text-slate-400 hover:text-red-500 transition-colors text-xs">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                )) : (
                                    <div className="text-center py-10">
                                        <i className="far fa-calendar-check text-4xl text-slate-400"></i>
                                        <p className="mt-2 text-slate-500">Your schedule is clear!</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 border-t border-slate-200 pt-4">
                                <button className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800">
                                   <i className="fab fa-google mr-2"></i> Sync with Google Calendar
                                </button>
                            </div>
                        </section>

                        {/* Right Column: Goal Tracker */}
                        <section className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm">
                            <GoalTracker goals={goals} onAddGoal={onAddGoal} onToggleGoalTask={onToggleGoalTask} />
                        </section>
                    </main>
                </div>
            </div>
             {isAddEventModalOpen && <AddEventModal onAddEvent={onAddEvent} onClose={() => setIsAddEventModalOpen(false)} />}
        </>
    );
};

export default TimeManagerDashboard;
