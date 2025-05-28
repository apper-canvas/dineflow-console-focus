import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [cart, setCart] = useState([]);
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Tomatoes', quantity: 45, unit: 'kg', reorderLevel: 10, status: 'good' },
    { id: 2, name: 'Onions', quantity: 8, unit: 'kg', reorderLevel: 15, status: 'low' },
    { id: 3, name: 'Chicken Breast', quantity: 25, unit: 'kg', reorderLevel: 20, status: 'good' },
    { id: 4, name: 'Rice', quantity: 3, unit: 'kg', reorderLevel: 10, status: 'critical' },
  ]);
  const [tables, setTables] = useState([
    { id: 1, number: 1, capacity: 4, status: 'available', currentOrder: null },
    { id: 2, number: 2, capacity: 2, status: 'occupied', currentOrder: 'ORD-001' },
    { id: 3, number: 3, capacity: 6, status: 'reserved', currentOrder: null },
    { id: 4, number: 4, capacity: 4, status: 'cleaning', currentOrder: null },
    { id: 5, number: 5, capacity: 8, status: 'available', currentOrder: null },
    { id: 6, number: 6, capacity: 2, status: 'occupied', currentOrder: 'ORD-002' },
  ]);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableData, setNewTableData] = useState({ number: '', capacity: 4 });

  const [selectedTable, setSelectedTable] = useState(null);
  const [menuItems] = useState([
    { id: 1, name: 'Margherita Pizza', category: 'Pizza', price: 18.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center' },
    { id: 2, name: 'Caesar Salad', category: 'Salads', price: 12.99, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop&crop=center' },
    { id: 3, name: 'Grilled Salmon', category: 'Main Course', price: 24.99, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop&crop=center' },
    { id: 4, name: 'Chocolate Cake', category: 'Desserts', price: 8.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop&crop=center' },
    { id: 5, name: 'Beef Burger', category: 'Burgers', price: 16.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop&crop=center' },
    { id: 6, name: 'Pasta Carbonara', category: 'Pasta', price: 19.99, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop&crop=center' },
  ]);

  const tabs = [
    { id: 'pos', name: 'POS System', icon: 'ShoppingCart' },
    { id: 'inventory', name: 'Inventory', icon: 'Package' },
    { id: 'tables', name: 'Tables', icon: 'Grid3X3' },
  ];

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`Added ${item.name} to cart`, {
      icon: '🛒',
      autoClose: 2000
    });
  };

  const removeFromCart = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    setCart(cart.filter(cartItem => cartItem.id !== itemId));
    toast.info(`Removed ${item?.name} from cart`, {
      icon: '🗑️',
      autoClose: 2000
    });
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(cart.map(cartItem =>
      cartItem.id === itemId
        ? { ...cartItem, quantity: newQuantity }
        : cartItem
    ));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const processOrder = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!');
      return;
    }
    if (!selectedTable) {
      toast.error('Please select a table!');
      return;
    }
    
    setCart([]);
    setSelectedTable(null);
    toast.success('Order processed successfully!', {
      icon: '✅',
      autoClose: 3000
    });
  };

  const updateInventoryStock = (itemId, newQuantity) => {
    setInventory(inventory.map(item => {
      if (item.id === itemId) {
        const status = newQuantity <= 5 ? 'critical' : newQuantity <= item.reorderLevel ? 'low' : 'good';
        return { ...item, quantity: newQuantity, status };
      }
      return item;
    }));
    toast.success('Stock updated successfully!');
  };

  const updateTableStatus = (tableId, newStatus) => {
    setTables(tables.map(table =>
      table.id === tableId ? { ...table, status: newStatus } : table
    ));
    toast.success('Table status updated!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'occupied': return 'bg-red-500';
      case 'reserved': return 'bg-yellow-500';
      case 'cleaning': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getInventoryStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };


  const addNewTable = () => {
    if (!newTableData.number || newTableData.number <= 0) {
      toast.error('Please enter a valid table number!');
      return;
    }
    
    if (tables.some(table => table.number === parseInt(newTableData.number))) {
      toast.error('Table number already exists!');
      return;
    }
    
    if (!newTableData.capacity || newTableData.capacity <= 0) {
      toast.error('Please enter a valid capacity!');
      return;
    }
    
    const newTable = {
      id: Math.max(...tables.map(t => t.id)) + 1,
      number: parseInt(newTableData.number),
      capacity: parseInt(newTableData.capacity),
      status: 'available',
      currentOrder: null
    };
    
    setTables([...tables, newTable]);
    setNewTableData({ number: '', capacity: 4 });
    setShowAddTableModal(false);
    
    toast.success(`Table ${newTable.number} added successfully!`, {
      icon: '✅',
      autoClose: 3000
    });
  };

  const openAddTableModal = () => {
    setNewTableData({ number: '', capacity: 4 });
    setShowAddTableModal(true);
  };

  const closeAddTableModal = () => {
    setShowAddTableModal(false);
    setNewTableData({ number: '', capacity: 4 });
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Navigation */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-2 sm:gap-4 bg-surface-100 dark:bg-surface-800 p-2 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow'
                  : 'text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{tab.name}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'pos' && (
          <motion.div
            key="pos"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <div className="glass-effect rounded-2xl p-6 shadow-soft">
                <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100 mb-6 flex items-center">
                  <ApperIcon name="MenuBook" className="w-6 h-6 mr-3 text-primary" />
                  Menu Items
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {menuItems.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="gradient-border rounded-xl p-4 cursor-pointer group"
                      onClick={() => addToCart(item)}
                    >
                      <div className="aspect-w-16 aspect-h-10 mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                        {item.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ₹{item.price}

                        </span>
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ApperIcon name="Plus" className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart & Order Processing */}
            <div className="space-y-6">
              {/* Table Selection */}
              <div className="glass-effect rounded-2xl p-6 shadow-soft">
                <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center">
                  <ApperIcon name="MapPin" className="w-5 h-5 mr-2 text-primary" />
                  Select Table
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {tables.filter(table => table.status === 'available').map((table) => (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTable(table)}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                        selectedTable?.id === table.id
                          ? 'border-primary bg-primary/10'
                          : 'border-surface-300 dark:border-surface-600 hover:border-primary/50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium text-surface-900 dark:text-surface-100">
                          Table {table.number}
                        </div>
                        <div className="text-xs text-surface-600 dark:text-surface-400">
                          {table.capacity} seats
                        </div>
                      </div>
                    </button>
                  ))}
                <button
                  onClick={openAddTableModal}
                  className="col-span-3 p-3 rounded-lg border-2 border-dashed border-primary/50 hover:border-primary transition-all duration-300 bg-primary/5 hover:bg-primary/10 group"
                >
                  <div className="flex items-center justify-center space-x-2 text-primary">
                    <ApperIcon name="Plus" className="w-5 h-5" />
                    <span className="text-sm font-medium">Add Table</span>
                  </div>
                </button>

                </div>
              </div>

              {/* Cart */}
              <div className="glass-effect rounded-2xl p-6 shadow-soft">
                <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center">
                  <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2 text-primary" />
                  Current Order
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-surface-600 dark:text-surface-400 text-center py-8">
                      Cart is empty
                    </p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-surface-900 dark:text-surface-100 text-sm">
                            {item.name}
                          </h4>
                          <p className="text-primary font-semibold text-sm">
                            ₹{item.price}

                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <ApperIcon name="Minus" className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-medium text-surface-900 dark:text-surface-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                          >
                            <ApperIcon name="Plus" className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {cart.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-600">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-surface-900 dark:text-surface-100">Total:</span>
                      <span className="text-xl font-bold text-primary">₹{getTotalAmount().toFixed(2)}</span>

                    </div>
                    <button
                      onClick={processOrder}
                      className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:shadow-glow transition-all duration-300"
                    >
                      Process Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-effect rounded-2xl p-6 shadow-soft">
              <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100 mb-6 flex items-center">
                <ApperIcon name="Package" className="w-6 h-6 mr-3 text-primary" />
                Inventory Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {inventory.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="gradient-border rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                        {item.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInventoryStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-400">Current Stock:</span>
                        <span className="font-medium text-surface-900 dark:text-surface-100">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateInventoryStock(item.id, Math.max(0, item.quantity - 1))}
                          className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          <ApperIcon name="Minus" className="w-4 h-4 mx-auto" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateInventoryStock(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 py-2 px-2 text-center bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => updateInventoryStock(item.id, item.quantity + 1)}
                          className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          <ApperIcon name="Plus" className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                      
                      <div className="text-xs text-surface-600 dark:text-surface-400">
                        Reorder at: {item.reorderLevel} {item.unit}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tables' && (
          <motion.div
            key="tables"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-effect rounded-2xl p-6 shadow-soft">
              <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100 mb-6 flex items-center">
                <ApperIcon name="Grid3X3" className="w-6 h-6 mr-3 text-primary" />
                Table Management
              </h2>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-surface-700 dark:text-surface-300">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-surface-700 dark:text-surface-300">Occupied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-surface-700 dark:text-surface-300">Reserved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-surface-700 dark:text-surface-300">Cleaning</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tables.map((table) => (
                  <motion.div
                    key={table.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="gradient-border rounded-xl p-4 cursor-pointer group relative"
                  >
                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusColor(table.status)}`}></div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center">
                        <ApperIcon name="Users" className="w-6 h-6 text-surface-600 dark:text-surface-400" />
                      </div>
                      
                      <h3 className="font-bold text-surface-900 dark:text-surface-100 mb-1">
                        Table {table.number}
                      </h3>
                      
                      <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                        {table.capacity} seats
                      </p>
                      
                      <div className="text-xs font-medium text-surface-700 dark:text-surface-300 mb-3 capitalize">
                        {table.status}
                      </div>
                      
                      {table.currentOrder && (
                        <div className="text-xs text-primary font-medium mb-3">
                          {table.currentOrder}
                        </div>
                      )}
                      
                      <select
                        value={table.status}
                        onChange={(e) => updateTableStatus(table.id, e.target.value)}
                        className="w-full text-xs py-1 px-2 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded"
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="reserved">Reserved</option>
                        <option value="cleaning">Cleaning</option>
                      </select>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Table Modal */}
      <AnimatePresence>
        {showAddTableModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeAddTableModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-effect rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 flex items-center">
                  <ApperIcon name="Plus" className="w-6 h-6 mr-3 text-primary" />
                  Add New Table
                </h3>
                <button
                  onClick={closeAddTableModal}
                  className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Table Number
                  </label>
                  <input
                    type="number"
                    value={newTableData.number}
                    onChange={(e) => setNewTableData({ ...newTableData, number: e.target.value })}
                    className="w-full py-3 px-4 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter table number"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    value={newTableData.capacity}
                    onChange={(e) => setNewTableData({ ...newTableData, capacity: e.target.value })}
                    className="w-full py-3 px-4 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter seating capacity"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={closeAddTableModal}
                  className="flex-1 py-3 px-4 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl font-medium hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewTable}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:shadow-glow transition-all duration-300"
                >
                  Add Table
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MainFeature;