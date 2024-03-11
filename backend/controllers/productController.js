import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

const getAllProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = req.query.pageNumber || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};
  const skip = (page - 1) * pageSize;
  const total = await Product.countDocuments({ ...keyword });
  const pages = Math.ceil(total / pageSize);

  try {
    const products = await Product.find({
      ...keyword,
    })
      .limit(pageSize)
      .skip(skip);

    res.status(200).json({
      products,
      page,
      pages,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error({ message: 'Resource not found' });
  }
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Create a product
// @route   POST /api/products/
// @access  Admin/Private

const createProduct = asyncHandler(async (req, res) => {
  const product = await new Product({
    name: 'New product',
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Amazon',
    category: 'Electronics',
    description: 'This is a test product',
    rating: 4,
    numReviews: 12,
    price: 29.99,
    countInStock: 5,
  });

  const createdProduct = await product.save();

  res.status(200).json(createdProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Edit a product
// @route   PUT /api/products/:id
// @access  Private/Admin

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, description, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.image = image;
    product.countInStock = countInStock;
    product.brand = brand;
    product.category = category;
    product.description = description;
    product.price = price;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(400);
    throw new Error('Product not found');
  }
});

// @desc    Create a review
// @route   POST /api/products/:id/reviews
// @access  Private/Admin

const createProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() == req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(404);
      throw new Error('You have already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Get top products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
