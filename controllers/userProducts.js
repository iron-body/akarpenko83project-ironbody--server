const { HttpError, ctrlWrapper } = require('../helpers');
const { UserProduct } = require('../models/userProduct');
const moment = require('moment');

const getUserProduct = async (req, res) => {
  const { userProductId } = req.params;
  const { _id: userId } = req.user;
  // Check if exist
  const getProduct = await UserProduct.findOne(
    {
      owner: userId,
      _id: userProductId,
    },
    { createdAt: 0, updatedAt: 0, owner: 0 }
  );

  if (!getProduct) {
    throw HttpError(404, `The product with id "${id}" not found`);
  }

  res.status(200).json(getProduct);
};

const getAllUserProducts = async (req, res) => {
  const { _id: userId } = req.user;
  const { limit = 25, page = 1, date, done } = req.query;
  const startFrom = (+page - 1) * +limit;

  // Get total items
  const totalItems = await UserProduct.countDocuments({
    owner: userId,
    ...(date && {
      date: {
        $lte: moment(date, 'DD.MM.YYYY').endOf('day').toDate(),
        $gte: moment(date, 'DD.MM.YYYY').startOf('day').toDate(),
      },
    }),
    // ...(typeof done !== 'undefined' && {
    //   done,
    // }),
  });

  const dataList = await UserProduct.find({
    owner: userId,
    ...(date && {
      date: {
        $lte: moment(date, 'DD.MM.YYYY').endOf('day').toDate(),
        $gte: moment(date, 'DD.MM.YYYY').startOf('day').toDate(),
      },
    }),
    ...(typeof done !== 'undefined' && {
      done,
    }),
  })
    .limit(+limit)
    .skip(startFrom);

  const summCalories = dataList.reduce((acuum, product) => {
    return product.calories + acuum;
  }, 0);

  const arrayWithCountedCalories = dataList.map(
    product => product.calories * (product.amount / 100)
  );

  res.status(200).json({
    arrayWithCountedCalories,
    limit,
    page,
    totalItems,
    totalPages: totalItems ? Math.ceil(+totalItems / +limit) : 0,
    summCalories,
  });
};

const createUserProduct = async (req, res) => {
  const newProduct = new UserProduct({
    ...req.body,
    owner: req.user._id,
  }).save();

  // const { _id } = await newProduct.save();

  res.status(200).json({
    // ...req.body,
    // id: _id,
    newProduct,
  });
};

const deleteUserProduct = async (req, res) => {
  const { userProductId } = req.params;
  const { date } = req.query;
  const { _id: userId } = req.user;
  if (!userProductId || !date) {
    throw HttpError(400, 'For deleting a product you need to send date and product ID');
  }
  // Check if exist
  const getProduct = await UserProduct.findOne({
    _id: userProductId,
    owner: userId,
    date: moment(date, 'DD.MM.YYYY'),
  });
  // console.log('date', date);
  console.log('moment', moment(date, 'DD.MM.YYYY Z'));
  console.log('getProduct', getProduct);
  if (!getProduct) {
    throw HttpError(404, `The product with id "${userProductId}" not found`);
  }
  // Delete product
  // await UserProduct.deleteOne({
  //   _id: id,
  // });
  res.status(200).json({
    ok: `The product with id "${userProductId}" was successfully deleted`,
  });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { done = false } = req.body;
  // Check if exist
  const getProduct = await UserProduct.findOne({
    _id: id,
  }).select('_id');
  if (!getProduct) {
    throw HttpError(404, `The product with id "${id}" not found`);
  }
  // Update product
  await Product.updateOne(
    {
      _id: id,
    },
    {
      done,
    }
  );
  res.status(200).json({
    ok: `The product with id "${id}" was successfully updated`,
  });
};

module.exports = {
  createUserProduct: ctrlWrapper(createUserProduct),
  updateUserProduct: ctrlWrapper(updateProduct),
  deleteUserProduct: ctrlWrapper(deleteUserProduct),
  getAllUserProducts: ctrlWrapper(getAllUserProducts),
  getUserProduct: ctrlWrapper(getUserProduct),
};
