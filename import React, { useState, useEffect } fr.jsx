import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, Bar } from 'recharts';

function App() {
  const [incomingMessage, setIncomingMessage] = useState('');
  const [platform, setPlatform] = useState('');
  const [response, setResponse] = useState('');
  const [productResponses, setProductResponses] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [customersData, setCustomersData] = useState([]);

  useEffect(() => {
    // Fetch product responses when the component mounts
    async function fetchProductResponses() {
      try {
        const response = await axios.get('http://localhost:3000/product-responses');
        setProductResponses(response.data.responses);
      } catch (error) {
        console.error('Error fetching product responses:', error.message);
      }
    }

    // Fetch sales and customer data for statistics
    async function fetchStatistics() {
      try {
        const salesResponse = await axios.get('http://localhost:3000/sales-data');
        setSalesData(salesResponse.data);

        const customersResponse = await axios.get('http://localhost:3000/customers-data');
        setCustomersData(customersResponse.data);
      } catch (error) {
        console.error('Error fetching statistics:', error.message);
      }
    }

    fetchProductResponses();
    fetchStatistics();
  }, []);

  const handleProcessMessage = async () => {
    try {
      const response = await axios.post('http://localhost:3000/process-message', {
        message: incomingMessage,
        platform,
      });

      setResponse(response.data.response);
    } catch (error) {
      console.error('Error processing message:', error.message);
    }
  };

  const handleUpdateResponse = async (product, newResponse) => {
    try {
      await axios.put(`http://localhost:3000/product-responses/${product}`, {
        response: newResponse,
      });

      // Fetch updated product responses after updating
      const response = await axios.get('http://localhost:3000/product-responses');
      setProductResponses(response.data.responses);
    } catch (error) {
      console.error('Error updating product response:', error.message);
    }
  };

  return (
    <div>
      <h1>Automated Response App</h1>
      <div>
        <label>Incoming Message:</label>
        <textarea
          value={incomingMessage}
          onChange={(e) => setIncomingMessage(e.target.value)}
          placeholder="Enter the incoming message here"
        />
        <label>Platform (e.g., instagram, whatsapp):</label>
        <input
          type="text"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          placeholder="Enter the platform (e.g., instagram, whatsapp)"
        />
        <button onClick={handleProcessMessage}>Process Message</button>
      </div>
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
      <div>
        <h2>Product Responses:</h2>
        <ul>
          {Object.entries(productResponses).map(([product, productResponse]) => (
            <li key={product}>
              <strong>{product}:</strong> {productResponse}
              <button onClick={() => handleUpdateResponse(product, prompt('Enter new response:'))}>
                Update Response
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Sales Statistics:</h2>
        <ResponsiveContainer width="80%" height={300}>
          <LineChart data={salesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h2>Customers Statistics:</h2>
        <ResponsiveContainer width="80%" height={300}>
          <BarChart data={customersData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="newCustomers" fill="#82ca9d" />
            <Bar dataKey="returningCustomers" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
