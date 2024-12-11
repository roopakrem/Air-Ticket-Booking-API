const ServiceProvider = require('../model/ServiceProvider');  // Adjust path based on your directory structure
const HttpError = require('../model/http-error');
const bcrypt = require('bcryptjs');


// Get all service providers
exports.getServiceProviders = async (req, res) => {
    try {
        const serviceProviders = await ServiceProvider.find().populate('flights').populate('seatClasses');
        res.status(200).json(serviceProviders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching service providers", error: err });
    }
};

// Get a single service provider by ID
exports.getServiceProviderById = async (req, res) => {
    try {
        const serviceProvider = await ServiceProvider.findById(req.params.id).populate('flights').populate('seatClasses');
        if (!serviceProvider) {
            return res.status(404).json({ message: "Service provider not found" });
        }
        res.status(200).json(serviceProvider);
    } catch (err) {
        res.status(500).json({ message: "Error fetching service provider", error: err });
    }
};
exports.loginServiceProvider = async (req, res, next) => {
    const { email, password } = req.body;
  
    console.log(req.body); // Check the request body
  
    try {
      // Check if user exists
      const existingServiceProvider = await ServiceProvider.findOne({ email });
      if (!existingServiceProvider) {
        return next(new HttpError('Invalid credentials, could not log you in(Email).', 401));
      }
      const isValidPassword = await bcrypt.compare(password, existingServiceProvider.password);
      if (!isValidPassword) {
        return next(new HttpError('Invalid credentials, could not log you in(Password).', 401));
      }
      // Verify password
  
      // Update lastLogin to current date and time
      await existingServiceProvider.save(); // Save the updated user document
      console.log("Logged In")
      console.log(isValidPassword)
      
      res.status(200).json({
        message: 'Logged In Successfully',
        ServiceProvider: existingServiceProvider.toObject({ getters: true })
      });
    } catch (err) {
      console.log(err);
      return next(new HttpError('Logging in failed, please try again.', 500));
    }
  };
// Create a new service provider
exports.createServiceProvider = async (req, res) => {
const imagePath = req.file.path.replace(/\\/g, '/');

    const { airlineName, airlineCode, email, password, phone, address } = req.body;
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      return next(new HttpError('Password Hashing Failed, Could Not Create User', 500));
    }
    const newServiceProvider = new ServiceProvider({ airlineName, airlineCode, logo:`http://localhost:5000/${imagePath}`, email, password:hashedPassword, phone, address });
    try {
        const savedServiceProvider = await newServiceProvider.save();
        res.status(201).json(savedServiceProvider);
    } catch (err) {
        res.status(500).json({ message: "Error creating service provider", error: err });
    }
};

// Update an existing service provider by ID
exports.updateServiceProvider = async (req, res) => {
    try {
        const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('flights').populate('seatClasses');
        if (!updatedServiceProvider) {
            return res.status(404).json({ message: "Service provider not found" });
        }
        res.status(200).json(updatedServiceProvider);
    } catch (err) {
        res.status(500).json({ message: "Error updating service provider", error: err });
    }
};

// Delete a service provider by ID
exports.deleteServiceProvider = async (req, res) => {
    try {
        const deletedServiceProvider = await ServiceProvider.findByIdAndDelete(req.params.id);
        if (!deletedServiceProvider) {
            return res.status(404).json({ message: "Service provider not found" });
        }
        res.status(200).json({ message: "Service provider deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting service provider", error: err });
    }
};
