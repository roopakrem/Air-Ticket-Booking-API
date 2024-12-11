const Passenger = require('../model/Passengers');
const HttpError = require('../model/http-error');

// Get all passengers
exports.getAllPassengers = async (req, res, next) => {
    try {
        const passengers = await Passenger.find();
        if (!passengers || passengers.length === 0) {
            return next(new HttpError('No Passenger to show.', 404));
        }
        res.json({ passengers: passengers.map(passenger => passenger.toObject({ getters: true })) });
    } catch (err) {
        return next(new HttpError('Fetching passengers failed, please try again later.', 500));
    }
};

// Create a new passenger
exports.createPassenger = async (req, res, next) => {
    const { name, age, phone, idName, idNumber, seatClass, food } = req.body;

    console.log(req.body) // formdata is not working

    // Validate seat class
    if (!['Economy', 'Business', 'First'].includes(seatClass)) {
        return next(new HttpError('Invalid seat class. Must be one of: Economy, Business, First.', 400));
    }

    if (!['Yes', 'No'].includes(food)) {
        return next(new HttpError('Please Select your Choice of Food', 400));
    }


    const newPassenger = new Passenger({
        name,
        age,
        phone,
        idName,
        idNumber,
        seatClass,
        food
    });

    try {
        await newPassenger.save();
        res.status(201).json({ message: 'Passenger created successfully', passenger: newPassenger.toObject({ getters: true }) });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Creating passenger failed, please try again.', 500));
    }
};

// Get passenger by ID
exports.getPassengerById = async (req, res, next) => {
    const passengerId = req.params.pid;

    try {
        const passenger = await Passenger.findById(passengerId);
        if (!passenger) {
            return next(new HttpError('Passenger not found.', 404));
        }
        res.json({ passenger: passenger.toObject({ getters: true }) });
    } catch (err) {
        return next(new HttpError('Fetching passenger failed, please try again later.', 500));
    }
};


// Update passenger by ID
exports.updatePassenger = async (req, res, next) => {
    const passengerId = req.params.pid;
    const { name, age, phone, idName, idNumber, seatClass, food } = req.body;

    // Validate seat class
    if (!['Economy', 'Business', 'First'].includes(seatClass)) {
        return next(new HttpError('Invalid seat class. Must be one of: Economy, Business, First.', 400));
    }

    if (!['Yes', 'No'].includes(food)) {
        return next(new HttpError('Please Select your Choice of Food', 400));
    }


    try {
        const passenger = await Passenger.findById(passengerId);
        if (!passenger) {
            return next(new HttpError('Passenger not found.', 404));
        }

        // Update fields
        passenger.name = name;
        passenger.age = age;
        passenger.phone = phone;
        passenger.idName = idName;
        passenger.idNumber = idNumber;
        passenger.seatClass = seatClass;
        passenger.food = food;

        await passenger.save();
        res.status(200).json({ message: 'Passenger updated successfully', passenger: passenger.toObject({ getters: true }) });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Updating passenger failed, please try again later.', 500));
    }
};

// Delete passenger by ID
exports.deletePassenger = async (req, res, next) => {
    const passengerId = req.params.pid;

    try {
        const passenger = await Passenger.findById(passengerId);
        if (!passenger) {
            return next(new HttpError('Passenger not found.', 404));
        }

        await passenger.deleteOne();
        res.status(200).json({ message: 'Passenger deleted successfully' });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Deleting passenger failed, please try again later.', 500));
    }
};
