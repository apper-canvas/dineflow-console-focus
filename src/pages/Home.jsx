import React from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';

const Home = ({ darkMode, setDarkMode }) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 glass-effect border-b border-surface-200 dark:border-surface-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-glow">
                <ApperIcon name="ChefHat" className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Fork & Folly

                </h1>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">
                  Restaurant Management
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 sm:p-3 rounded-xl neu-button transition-all duration-300 hover:shadow-glow"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-surface-700 dark:text-surface-300" 
                />
              </button>
              
              <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-glow transition-all duration-300">
                <ApperIcon name="Settings" className="w-4 h-4" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        <MainFeature />
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <ApperIcon name="ChefHat" className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Fork & Folly

                </span>
              </div>
              <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed">
                Complete restaurant management solution for modern food service businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                <li className="flex items-center space-x-2">
                  <ApperIcon name="CheckCircle" className="w-4 h-4 text-primary" />
                  <span>POS System</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ApperIcon name="CheckCircle" className="w-4 h-4 text-primary" />
                  <span>Inventory Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ApperIcon name="CheckCircle" className="w-4 h-4 text-primary" />
                  <span>Table Management</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Connect</h3>
              <div className="flex space-x-3">
                <button className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-primary hover:text-white transition-all duration-300">
                  <ApperIcon name="Twitter" className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-primary hover:text-white transition-all duration-300">
                  <ApperIcon name="Facebook" className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-primary hover:text-white transition-all duration-300">
                  <ApperIcon name="Instagram" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-surface-200 dark:border-surface-700 mt-8 pt-8 text-center">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              © 2024 Fork & Folly. All rights reserved. Powered by innovation.

            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;