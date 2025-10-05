const Category = require('../database/models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    // Ensure unique name
    const existing = await Category.findOne({ name });
    if (existing) return res.status(409).json({ success: false, message: 'Category already exists' });

    const category = new Category({ name, description, image });
    await category.save();
    return res.status(201).json({ success: true, data: category });
  } catch (err) {
    console.error('createCategory error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get list of categories with optional search and pagination
exports.getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Category.find(filter).sort({ created_at: -1 }).skip(skip).limit(parseInt(limit)),
      Category.countDocuments(filter),
    ]);

    return res.json({ success: true, data: items, meta: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) {
    console.error('getCategories error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get category by id
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, data: category });
  } catch (err) {
    console.error('getCategoryById error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date();

    // If updating name, ensure uniqueness
    if (updates.name) {
      const exist = await Category.findOne({ name: updates.name, _id: { $ne: id } });
      if (exist) return res.status(409).json({ success: false, message: 'Category name already in use' });
    }

    const category = await Category.findByIdAndUpdate(id, updates, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, data: category });
  } catch (err) {
    console.error('updateCategory error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    console.error('deleteCategory error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
