const SeatClass = require('../model/SeatClass');
const HttpError = require('../model/http-error');

// Get all seat classes
exports.getAllSeatClasses = async (req, res, next) => {
    try {
      const seatClasses = await SeatClass.find();
      if (!seatClasses || seatClasses.length === 0) {
          return next(new HttpError('No Seat Classes found.', 404));
        }
    
      res.status(200).json({ seatClasses });
    } catch (err) {
      return next(new HttpError('Fetching seat classes failed, please try again later.', 500));
    }
  };

// Create a new seat class entry
exports.createSeatClass = async (req, res, next) => {
  const { seatClassName, economySeats, economySeatPrice, economyFoodPrice, economyavailableSeats,
          businessSeats, businessSeatPrice, businessFoodPrice, businessavailableSeats,
          firstClassSeats, firstClassSeatPrice, firstClassFoodPrice, firstClassavailableSeats } = req.body;


  console.log(req.body) // formdata is not working for creation also


  const totalSeats = economySeats + businessSeats + firstClassSeats;
  const totalAvailableSeats = economyavailableSeats + businessavailableSeats + firstClassavailableSeats;

  const newSeatClass = new SeatClass({
    seatClassName,
    economySeats,
    economySeatPrice,
    economyFoodPrice,
    economyavailableSeats,
    businessSeats,
    businessSeatPrice,
    businessFoodPrice,
    businessavailableSeats,
    firstClassSeats,
    firstClassSeatPrice,
    firstClassFoodPrice,
    firstClassavailableSeats,
    totalSeats,
    totalAvailableSeats
  });

  console.log(newSeatClass)
  try {
      // Check if user already exists
  const existingSeatClass = await SeatClass.findOne({ seatClassName });
  if (existingSeatClass) {
    return next(new HttpError('SeatClass already exists, please check again.', 422));
  }
    await newSeatClass.save();
    res.status(201).json({ seatClass: newSeatClass });
  } catch (err) {
    console.log(err)
    return next(new HttpError('Creating seat class failed, please try again.', 500));
  }
};



// Get a single seat class by ID
exports.getSeatClassById = async (req, res, next) => {
  const seatClassId = req.params.id;

  try {
    const seatClass = await SeatClass.findById(seatClassId);
    if (!seatClass) {
      return next(new HttpError('Seat class not found.', 404));
    }
    res.status(200).json({ seatClass });
  } catch (err) {
    return next(new HttpError('Fetching seat class failed, please try again later.', 500));
  }
};

// Update a seat class by ID
exports.updateSeatClass = async (req, res, next) => {
  const seatClassId = req.params.id;
  const updates = req.body;

  try {
    const seatClass = await SeatClass.findById(seatClassId);
    if (!seatClass) {
      return next(new HttpError('Seat class not found.', 404));
    }

    console.log(req.body) // formdata is not working for creation also


    Object.assign(seatClass, updates); // Update fields with incoming data
    seatClass.totalSeats = seatClass.economySeats + seatClass.businessSeats + seatClass.firstClassSeats;
    seatClass.totalAvailableSeats = seatClass.economyavailableSeats + seatClass.businessavailableSeats + seatClass.firstClassavailableSeats;

    await seatClass.save();
    res.status(200).json({ seatClass });
  } catch (err) {
    return next(new HttpError('Updating seat class failed, please try again later.', 500));
  }
};

// Delete a seat class by ID
exports.deleteSeatClass = async (req, res, next) => {
  const seatClassId = req.params.id;

  try {
    const seatClass = await SeatClass.findById(seatClassId);
    if (!seatClass) {
      return next(new HttpError('Seat class not found.', 404));
    }

    await seatClass.deleteOne();
    res.status(200).json({ message: 'Seat class deleted successfully.' });
  } catch (err) {
    return next(new HttpError('Deleting seat class failed, please try again later.', 500));
  }
};
