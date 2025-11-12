
import React, { useState } from 'react';
import type { TimeManagerEvent, TimeManagerEventCategory } from '../../types';

interface AddEventModalProps {
    onAddEvent: (event: Omit<TimeManagerEvent, 'id'>) => void;
    onClose: () => void;
}

const CATEGORIES: TimeManagerEventCategory[] = ['Timetable', 'Assignment', 'Test', 'Appointment', 'Study', 'Birthday', 'Rent Due', 'Sleep', 'Exercise', 'Personal'];

const AddEventModal: React.FC<AddEventModalProps> = ({ onAddEvent, onClose }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<TimeManagerEventCategory>('Personal');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date) {
            alert('Please fill in at least the title and date.');
            return;
        }
        onAddEvent({ title, category, date, startTime, endTime, notes });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-800">Add New Schedule Entry</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <div>
                        <label htmlFor="event-title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input type="text" id="event-title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="e.g., Final Exam Study Group" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="event-category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select id="event-category" value={category} onChange={e => setCategory(e.target.value as TimeManagerEventCategory)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="event-date" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input type="date" id="event-date" value={date} onChange={e => setDate(e.target.value)} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                    </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="event-start-time" className="block text-sm font-medium text-slate-700 mb-1">Start Time (Optional)</label>
                            <input type="time" id="event-start-time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="event-end-time" className="block text-sm font-medium text-slate-700 mb-1">End Time (Optional)</label>
                            <input type="time" id="event-end-time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                    </div>

                     <div>
                        <label htmlFor="event-notes" className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                        <textarea id="event-notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="Add any extra details here..."></textarea>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200 transition-colors">Cancel</button>
                        <button type="submit" className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700 transition-colors">Add Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEventModal;
