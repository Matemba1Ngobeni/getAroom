import React, { useState } from 'react';
import { seedDatabase } from '../services/firestoreService';

const DatabaseSetup: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleSeed = async () => {
        setIsLoading(true);
        try {
            await seedDatabase();
            setIsDone(true);
        } catch (error) {
            console.error("Failed to seed database:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isDone) {
        return (
             <div className="text-center bg-teal-50 border border-teal-200 text-teal-800 font-semibold p-4 rounded-lg">
                Database initialized! Please refresh the page to see the sample rooms and data.
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-8 border border-slate-200 text-center my-16">
            <i className="fas fa-database text-5xl text-teal-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-slate-800">Welcome to Get.A.Room!</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">
                To get started, you need to initialize the database with some sample data. This will create collections for rooms, users, and more in your Firestore project.
            </p>
            <button
                onClick={handleSeed}
                disabled={isLoading}
                className="mt-6 bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 transition-transform transform hover:scale-105 shadow-lg disabled:bg-slate-400 disabled:cursor-wait"
            >
                {isLoading ? (
                    <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Initializing...
                    </>
                ) : (
                    'Initialize Database'
                )}
            </button>
             <p className="text-xs text-slate-400 mt-4">
                Note: This only needs to be done once.
            </p>
        </div>
    );
};

export default DatabaseSetup;
