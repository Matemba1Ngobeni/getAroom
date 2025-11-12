import React, { useState } from 'react';
import type { UserType } from '../types';

interface SignUpFormProps {
  userType: UserType;
  onBack: () => void;
  onSubmit: (data: { name: string, email: string }) => void;
  backButtonText: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ userType, onBack, onSubmit, backButtonText }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd also pass the password for account creation
    onSubmit({ name, email });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md animate-fade-in">
      <button
        onClick={onBack}
        className="text-sm font-semibold text-slate-600 hover:text-teal-600 mb-6 flex items-center group"
      >
        <i className="fas fa-arrow-left mr-2 transition-transform group-hover:-translate-x-1"></i>
        {backButtonText}
      </button>

      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-800">
          Create your <span className="text-teal-600">{userType}</span> account
        </h2>
        <p className="mt-2 text-slate-500">
          Let's get you set up with your personal details.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="full-name" className="block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <div className="mt-1">
            <input
              id="full-name"
              name="full-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="John Doe"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;