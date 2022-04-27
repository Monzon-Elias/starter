//const fs = require('fs');
const Tour = require('../models/tourModel');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
//
//The checkId and checkBody functions are no longer needed bc the schema will handle this on mongo db
//
// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   if (+req.params.id > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'fail', message: 'Missing name or price' });
//   }
//   next();
// };

/*Functions handlers */
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
exports.getOneTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.postNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Invalid data sent!' });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Invalid data sent!' });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
