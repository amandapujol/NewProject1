const express = require('express');
const path = require('path');
const da = require('./data-access');

const app = express();
const port = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// GET all customers
app.get('/customers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [customer, err] = await da.getCustomerById(id);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).send(err);
    }
  } catch (error) {
    console.error('Error in GET /customers/:id:', error);
    res.status(500).send('Server error');
  }
});


// GET reset - reset customer data to defaults
app.get('/reset', async (req, res) => {
  try {
    const [result, err] = await da.resetCustomers();
    if (result) {
      res.send(result);
    } else {
      res.status(500).send(err);
    }
  } catch (error) {
    console.error('Error in GET /reset:', error);
    res.status(500).send('Server error');
  }
});

// POST new customer
app.post('/customers', async (req, res) => {
  const newCustomer = req.body;
  if (!newCustomer) {
    return res.status(400).send('missing request body');
  }
  try {
    const [status, id, err] = await da.addCustomer(newCustomer);
    if (status === 'success') {
      newCustomer._id = id;
      res.status(201).json(newCustomer);
    } else {
      res.status(400).send(err);
    }
  } catch (error) {
    console.error('Error in POST /customers:', error);
    res.status(500).send('Server error');
  }
});

// PUT update existing customer by id
app.put('/customers/:id', async (req, res) => {
  const updatedCustomer = req.body;
  const id = req.params.id;

  if (!updatedCustomer) {
    return res.status(400).send('missing request body');
  }

  // Remove _id if present to avoid conflict
  delete updatedCustomer._id;

  // Ensure id from URL parameter is a number and assigned to the customer object
  updatedCustomer.id = +id;

  try {
    const [message, err] = await da.updateCustomer(updatedCustomer);
    if (message) {
      res.send(message);
    } else {
      res.status(400).send(err);
    }
  } catch (error) {
    console.error('Error in PUT /customers/:id:', error);
    res.status(500).send('Server error');
  }
});

// DELETE customer by id
app.delete('/customers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [message, err] = await da.deleteCustomerById(id);
    if (message) {
      res.send(message);
    } else {
      res.status(404).send(err);
    }
  } catch (error) {
    console.error('Error in DELETE /customers/:id:', error);
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const cors = require('cors');
app.use(cors());
