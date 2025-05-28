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
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);

  const [newTableData, setNewTableData] = useState({ number: '', capacity: 4 });

  const [tableBillingHistory, setTableBillingHistory] = useState(new Map()); // Track billing count per table

  const [openTables, setOpenTables] = useState(new Map()); // Map of table ID to { table, cart, isMinimized }

  const [menuItems, setMenuItems] = useState([

    { id: 1, name: 'Margherita Pizza', category: 'Pizza', price: 18.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center' },
    { id: 2, name: 'Caesar Salad', category: 'Salads', price: 12.99, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop&crop=center' },
    { id: 3, name: 'Grilled Salmon', category: 'Main Course', price: 24.99, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop&crop=center' },
    { id: 4, name: 'Chocolate Cake', category: 'Desserts', price: 8.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop&crop=center' },
    { id: 5, name: 'Beef Burger', category: 'Burgers', price: 16.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop&crop=center' },
    { id: 6, name: 'Pasta Carbonara', category: 'Pasta', price: 19.99, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop&crop=center' },
  ]);
  const [editingPriceItem, setEditingPriceItem] = useState(null);
  const [showEditPriceModal, setShowEditPriceModal] = useState(false);
  const [editPriceData, setEditPriceData] = useState({ price: '' });
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuData, setNewMenuData] = useState({ 
    name: '', 
    category: '', 
    price: '', 
    image: null,
    imagePreview: ''
  });

  const [editingImageItem, setEditingImageItem] = useState(null);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [editImageData, setEditImageData] = useState({ image: null, imagePreview: '' });






  const tabs = [
    { id: 'pos', name: 'POS System', icon: 'ShoppingCart' },
    { id: 'inventory', name: 'Inventory', icon: 'Package' },
    { id: 'tables', name: 'Tables', icon: 'Grid3X3' },
  ];

  const handleTableClick = (table) => {
    setOpenTables(prev => {
      const newOpenTables = new Map(prev);
      if (newOpenTables.has(table.id)) {
        // Toggle minimize/maximize
        const tableData = newOpenTables.get(table.id);
        newOpenTables.set(table.id, {
          ...tableData,
          isMinimized: !tableData.isMinimized
        });
      } else {
        // Open new table window
        newOpenTables.set(table.id, {
          table,
          cart: [],
          isMinimized: false
        });
        toast.success(`Opened table ${table.number}`, {
          icon: '📋',
          autoClose: 2000
        });
      }
      return newOpenTables;
    });
  };

  const addToCartForTable = (tableId, item) => {
    setOpenTables(prev => {
      const newOpenTables = new Map(prev);
      const tableData = newOpenTables.get(tableId);
      if (!tableData) return prev;
      
      const existingItem = tableData.cart.find(cartItem => cartItem.id === item.id);
      let newCart;
      
      if (existingItem) {
        newCart = tableData.cart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        newCart = [...tableData.cart, { ...item, quantity: 1 }];
      }
      
      newOpenTables.set(tableId, {
        ...tableData,
        cart: newCart
      });
      
      toast.success(`Added ${item.name} to Table ${tableData.table.number}`, {
        icon: '🛒',
        autoClose: 2000
      });
      
      return newOpenTables;
    });
  };

  const removeFromCartForTable = (tableId, itemId) => {
    setOpenTables(prev => {
      const newOpenTables = new Map(prev);
      const tableData = newOpenTables.get(tableId);
      if (!tableData) return prev;
      
      const item = tableData.cart.find(cartItem => cartItem.id === itemId);
      const newCart = tableData.cart.filter(cartItem => cartItem.id !== itemId);
      
      newOpenTables.set(tableId, {
        ...tableData,
        cart: newCart
      });
      
      toast.info(`Removed ${item?.name} from Table ${tableData.table.number}`, {
        icon: '🗑️',
        autoClose: 2000
      });
      
      return newOpenTables;
    });
  };

  const updateCartQuantityForTable = (tableId, itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCartForTable(tableId, itemId);
      return;
    }
    
    setOpenTables(prev => {
      const newOpenTables = new Map(prev);
      const tableData = newOpenTables.get(tableId);
      if (!tableData) return prev;
      
      const newCart = tableData.cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
      
      newOpenTables.set(tableId, {
        ...tableData,
        cart: newCart
      });
      
      return newOpenTables;
    });
  };

  const getTotalAmountForTable = (tableId) => {
    const tableData = openTables.get(tableId);
    if (!tableData) return 0;
    return tableData.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const processOrderForTable = (tableId) => {
    const tableData = openTables.get(tableId);
    if (!tableData) return;
    
    if (tableData.cart.length === 0) {
      toast.error('Cart is empty!');
      return;
    }
    
    // Update billing history
    setTableBillingHistory(prev => {
      const newHistory = new Map(prev);
      const currentCount = newHistory.get(tableId) || 0;
      newHistory.set(tableId, currentCount + 1);
      return newHistory;
    });
    
    // Close the table window
    setOpenTables(prev => {
      const newOpenTables = new Map(prev);
      newOpenTables.delete(tableId);
      return newOpenTables;
    });
    
    // Update table status back to available
    setTables(tables.map(table =>
      table.id === tableId ? { ...table, status: 'available', currentOrder: null } : table
    ));
    
    toast.success(`Order processed successfully for Table ${tableData.table.number}! Total amount: ₹${getTotalAmountForTable(tableId).toFixed(2)}`, {
      icon: '✅',
      autoClose: 3000
    });
  };


  const closeTableWindow = (tableId) => {
    const tableData = openTables.get(tableId);
    if (!tableData) return;
    
    setOpenTables(prev => {
      const newOpenTables = new Map(prev);
      newOpenTables.delete(tableId);
      return newOpenTables;
    });
    
    toast.info(`Closed Table ${tableData.table.number}`, {
      icon: '❌',
      autoClose: 2000
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


  const deleteTable = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) {
      toast.error('Table not found!');
      return;
    }
    
    // Check if table is currently in use
    if (openTables.has(tableId)) {
      toast.error('Cannot delete table that is currently in use!');
      return;
    }
    
    if (table.status === 'occupied') {
      toast.error('Cannot delete occupied table!');
      return;
    }
    
    // Remove table from tables array
    setTables(tables.filter(t => t.id !== tableId));
    
    // Clean up billing history
    setTableBillingHistory(prev => {
      const newHistory = new Map(prev);
      newHistory.delete(tableId);
      return newHistory;
    });
    
    // Close delete confirmation modal
    setShowDeleteConfirmModal(false);
    setTableToDelete(null);
    
    toast.success(`Table ${table.number} deleted successfully!`, {
      icon: '🗑️',
      autoClose: 3000
    });
  };

  const openDeleteConfirmModal = (table) => {
    setTableToDelete(table);
    setShowDeleteConfirmModal(true);
  };

  const closeDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setTableToDelete(null);
  };


  const openEditPriceModal = (item) => {
    setEditingPriceItem(item);
    setEditPriceData({ price: item.price.toString() });
    setShowEditPriceModal(true);
  };

  const closeEditPriceModal = () => {
    setShowEditPriceModal(false);
    setEditingPriceItem(null);
    setEditPriceData({ price: '' });
  };

  const updateMenuItemPrice = () => {
    if (!editPriceData.price || parseFloat(editPriceData.price) <= 0) {
      toast.error('Please enter a valid price!');
      return;
    }
    
    const newPrice = parseFloat(editPriceData.price);
    
    setMenuItems(menuItems.map(item =>
      item.id === editingPriceItem.id
        ? { ...item, price: newPrice }
        : item
    ));
    
    closeEditPriceModal();
    
    toast.success(`Updated price for ${editingPriceItem.name} to ₹${newPrice.toFixed(2)}`, {
      icon: '💰',
      autoClose: 3000
    });
  };

  const openAddMenuModal = () => {
    setNewMenuData({ name: '', category: '', price: '', image: null, imagePreview: '' });
    setShowAddMenuModal(true);
  };



  const closeAddMenuModal = () => {
    setShowAddMenuModal(false);
    setNewMenuData({ name: '', category: '', price: '', image: null, imagePreview: '' });

  };

  };

  const addNewMenuItem = () => {
    if (!newMenuData.name.trim()) {
      toast.error('Please enter a menu item name!');
      return;
    }
    
    if (!newMenuData.category.trim()) {
      toast.error('Please enter a category!');
      return;
    }
    
    if (!newMenuData.price || parseFloat(newMenuData.price) <= 0) {
      toast.error('Please enter a valid price!');
      return;
    }
    
    if (!newMenuData.image) {
      toast.error('Please select an image!');
      return;
    }

    
    const newMenuItem = {
      id: Math.max(...menuItems.map(item => item.id)) + 1,
      name: newMenuData.name.trim(),
      category: newMenuData.category.trim(),
      price: parseFloat(newMenuData.price),
      image: newMenuData.imagePreview

    };
    
    setMenuItems([...menuItems, newMenuItem]);
    closeAddMenuModal();
    
    toast.success(`Added ${newMenuItem.name} to menu!`, {
      icon: '🍽️',
      autoClose: 3000
    });
  };


  const openEditImageModal = (item) => {
    setEditingImageItem(item);
    setEditImageData({ image: null, imagePreview: item.image });

    setShowEditImageModal(true);
  };

  const closeEditImageModal = () => {
    setShowEditImageModal(false);
    setEditingImageItem(null);
    setEditImageData({ image: null, imagePreview: '' });

  };

  };

  const updateMenuItemImage = () => {
    if (!editImageData.image && !editImageData.imagePreview) {
      toast.error('Please select an image!');
      return;
    }
    
    const imageToUse = editImageData.imagePreview || editingImageItem.image;

    
    setMenuItems(menuItems.map(item =>
      item.id === editingImageItem.id
        ? { ...item, image: imageToUse }

        : item
    ));
    
    closeEditImageModal();
    
    toast.success(`Updated image for ${editingImageItem.name}`, {
      icon: '🖼️',
      autoClose: 3000
    });
  };

  const handleImageUpload = (file, isEdit = false) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file!');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB!');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      if (isEdit) {
        setEditImageData({ image: file, imagePreview: imageUrl });
      } else {
        setNewMenuData(prev => ({ ...prev, image: file, imagePreview: imageUrl }));
      }
    };
    reader.readAsDataURL(file);
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
            className="space-y-6"
          >
            {/* Table Selection */}
            <div className="glass-effect rounded-2xl p-6 shadow-soft">
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center">
                <ApperIcon name="MapPin" className="w-5 h-5 mr-2 text-primary" />
                Select Tables
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {tables.filter(table => table.status === 'available' || openTables.has(table.id)).map((table) => (
                  <button
                    key={table.id}
                    onClick={() => handleTableClick(table)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 relative ${
                      openTables.has(table.id)
                        ? openTables.get(table.id).isMinimized
                          ? 'border-accent bg-accent/20'
                          : 'border-primary bg-primary/10'
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
                      {openTables.has(table.id) && (
                        <div className="text-xs mt-1">
                          <span className={`px-2 py-1 rounded-full text-white ${
                            openTables.get(table.id).isMinimized ? 'bg-accent' : 'bg-primary'
                          }`}>
                            {openTables.get(table.id).isMinimized ? 'Running' : 'Open'}

                          </span>
                        </div>
                      )}
                    </div>
                    {/* Delete button for POS select table section */}
                    {!openTables.has(table.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteConfirmModal(table);
                        }}
                        className="absolute top-1 left-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                      >
                        <ApperIcon name="X" className="w-3 h-3 text-white" />
                      </button>
                    )}

                  </button>
                <button
                  onClick={openAddTableModal}
                  className="col-span-3 sm:col-span-4 md:col-span-6 p-3 rounded-lg border-2 border-dashed border-primary/50 hover:border-primary transition-all duration-300 bg-primary/5 hover:bg-primary/10 group"
                >
                  <div className="flex items-center justify-center space-x-2 text-primary">
                    <ApperIcon name="Plus" className="w-5 h-5" />
                    <span className="text-sm font-medium">Add Table</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Open Table Windows */}
            <div className="space-y-6">
              {Array.from(openTables.entries()).map(([tableId, tableData]) => {
                if (tableData.isMinimized) return null;
                
                return (
                  <motion.div
                    key={tableId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-effect rounded-2xl p-6 shadow-soft border-2 border-primary/20"
                  >
                    {/* Table Window Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100 flex items-center">
                        <ApperIcon name="Users" className="w-6 h-6 mr-3 text-primary" />
                        Table {tableData.table.number} - {tableData.table.capacity} seats
                      </h2>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTableClick(tableData.table)}
                          className="px-3 py-1 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors text-sm"
                        >
                          Minimize
                        </button>
                        <button
                          onClick={() => closeTableWindow(tableId)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                      {/* Menu Items */}
                      <div className="lg:col-span-2">
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center">
                              <ApperIcon name="MenuBook" className="w-5 h-5 mr-2 text-primary" />
                              Menu Items
                            </h3>
                            <button
                              onClick={openAddMenuModal}
                              className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow transition-all duration-300 text-sm"
                            >
                              <ApperIcon name="Plus" className="w-4 h-4" />
                              <span>Add Item</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {menuItems.map((item) => (
                              <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="gradient-border rounded-xl p-4 cursor-pointer group"
                                onClick={() => addToCartForTable(tableId, item)}
                              >
                                <div className="aspect-w-16 aspect-h-10 mb-3">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-1">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                                  {item.category}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-primary">
                                    ₹{item.price}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openEditImageModal(item);
                                      }}
                                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-600"
                                    >
                                      <ApperIcon name="Image" className="w-4 h-4 text-white" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openEditPriceModal(item);
                                      }}
                                      className="w-8 h-8 bg-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-accent/80"
                                    >
                                      <ApperIcon name="Edit" className="w-4 h-4 text-white" />
                                    </button>
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <ApperIcon name="Plus" className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Cart */}
                      <div>
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center">
                            <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2 text-primary" />
                            Current Order
                          </h3>
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {tableData.cart.length === 0 ? (
                              <p className="text-surface-600 dark:text-surface-400 text-center py-8">
                                Cart is empty
                              </p>
                            ) : (
                              tableData.cart.map((item) => (
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
                                      onClick={() => updateCartQuantityForTable(tableId, item.id, item.quantity - 1)}
                                      className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                      <ApperIcon name="Minus" className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center font-medium text-surface-900 dark:text-surface-100">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateCartQuantityForTable(tableId, item.id, item.quantity + 1)}
                                      className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                                    >
                                      <ApperIcon name="Plus" className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                          
                          {tableData.cart.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-600">
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-bold text-surface-900 dark:text-surface-100">Total:</span>
                                <span className="text-xl font-bold text-primary">₹{getTotalAmountForTable(tableId).toFixed(2)}</span>
                              </div>
                              <button
                                onClick={() => processOrderForTable(tableId)}
                                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:shadow-glow transition-all duration-300"
                              >
                                Process Order
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
                      
                      {/* Billing History Display */}
                      <div className="text-xs text-primary font-medium mb-3">
                        Billed: {tableBillingHistory.get(table.id) || 0} times
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
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteConfirmModal(table);
                        }}
                        className="absolute top-2 left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                      >
                        <ApperIcon name="Trash2" className="w-3 h-3 text-white" />
                      </button>

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

      {/* Edit Price Modal */}
      <AnimatePresence>
        {showEditPriceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeEditPriceModal}
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
                  <ApperIcon name="Edit" className="w-6 h-6 mr-3 text-primary" />
                  Edit Price
                </h3>
                <button
                  onClick={closeEditPriceModal}
                  className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </button>
              </div>
              
              {editingPriceItem && (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={editingPriceItem.image}
                      alt={editingPriceItem.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100">
                        {editingPriceItem.name}
                      </h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        {editingPriceItem.category}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        Current: ₹{editingPriceItem.price}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    New Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={editPriceData.price}
                    onChange={(e) => setEditPriceData({ ...editPriceData, price: e.target.value })}
                    className="w-full py-3 px-4 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter new price"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={closeEditPriceModal}
                  className="flex-1 py-3 px-4 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl font-medium hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateMenuItemPrice}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:shadow-glow transition-all duration-300"
                >
                  Update Price
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Menu Item Modal */}
      <AnimatePresence>
        {showAddMenuModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeAddMenuModal}
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
                  Add Menu Item
                </h3>
                <button
                  onClick={closeAddMenuModal}
                  className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={newMenuData.name}
                    onChange={(e) => setNewMenuData({ ...newMenuData, name: e.target.value })}
                    className="w-full py-3 px-4 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter item name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newMenuData.category}
                    onChange={(e) => setNewMenuData({ ...newMenuData, category: e.target.value })}
                    className="w-full py-3 px-4 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter category (e.g., Pizza, Salads)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newMenuData.price}
                    onChange={(e) => setNewMenuData({ ...newMenuData, price: e.target.value })}
                    className="w-full py-3 px-4 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter price"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Image
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="w-full py-3 px-4 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/80"
                    />
                    {newMenuData.imagePreview && (
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Preview
                        </label>
                        <div className="w-full h-32 bg-surface-100 dark:bg-surface-700 rounded-lg overflow-hidden">
                          <img
                            src={newMenuData.imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={closeAddMenuModal}
                  className="flex-1 py-3 px-4 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl font-medium hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewMenuItem}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:shadow-glow transition-all duration-300"
                >
                  Add Item
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Image Modal */}
      <AnimatePresence>
        {showEditImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeEditImageModal}
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
                  <ApperIcon name="Image" className="w-6 h-6 mr-3 text-primary" />
                  Edit Image
                </h3>
                <button
                  onClick={closeEditImageModal}
                  className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </button>
              </div>
              
              {editingImageItem && (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={editingImageItem.image}
                      alt={editingImageItem.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100">
                        {editingImageItem.name}
                      </h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        {editingImageItem.category}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    New Image
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0], true)}
                      className="w-full py-3 px-4 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/80"
                    />
                    {editImageData.imagePreview && (
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Preview
                        </label>
                        <div className="w-full h-32 bg-surface-100 dark:bg-surface-700 rounded-lg overflow-hidden">
                          <img
                            src={editImageData.imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>


              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={closeEditImageModal}
                  className="flex-1 py-3 px-4 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl font-medium hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateMenuItemImage}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:shadow-glow transition-all duration-300"
                >
                  Update Image
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirmModal && tableToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeDeleteConfirmModal}
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
                  <ApperIcon name="AlertTriangle" className="w-6 h-6 mr-3 text-red-500" />
                  Delete Table
                </h3>
                <button
                  onClick={closeDeleteConfirmModal}
                  className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <ApperIcon name="Users" className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-surface-900 dark:text-surface-100">
                      Table {tableToDelete.number}
                    </h4>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {tableToDelete.capacity} seats • Status: {tableToDelete.status}
                    </p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      Billed: {tableBillingHistory.get(tableToDelete.id) || 0} times
                    </p>
                  </div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Warning:</strong> This action cannot be undone. Are you sure you want to delete this table? All billing history for this table will be permanently lost.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={closeDeleteConfirmModal}
                  className="flex-1 py-3 px-4 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl font-medium hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteTable(tableToDelete.id)}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Delete Table
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