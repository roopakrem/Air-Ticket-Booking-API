const express = require('express');
const serviceProviderController = require('../controllers/serviceprovider-controller');
const logoUpoad = require('../middleware/userimage-upload');

const router = express.Router();

// Route to get all service providers
router.get('/', serviceProviderController.getServiceProviders);

// Route to get a single service provider by ID
router.get('/:id', serviceProviderController.getServiceProviderById);

// Route to create a new service provider
router.post('/',logoUpoad.single('logo'), serviceProviderController.createServiceProvider);

// Route to update a service provider by ID
router.put('/:id', serviceProviderController.updateServiceProvider);

// Route to delete a service provider by ID
router.delete('/:id', serviceProviderController.deleteServiceProvider);

router.post('/login/', serviceProviderController.loginServiceProvider);





module.exports = router;
