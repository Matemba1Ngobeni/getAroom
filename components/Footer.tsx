import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Get.A.Room. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-teal-600 transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-teal-600 transition-colors"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-teal-600 transition-colors"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;