import React, { useState } from 'react';

const PricingDetailsModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    maintenance: '',
    maintenanceFrequency: 'Monthly',
    expectedRental: '',
    bookingAmount: '',
    annualDuesPayable: '',
    membershipCharge: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">More Pricing Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Fill in more pricing details</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Maintenance
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="maintenance"
                value={formData.maintenance}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
              <select
                name="maintenanceFrequency"
                value={formData.maintenanceFrequency}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Expected rental
            </label>
            <input
              type="text"
              name="expectedRental"
              value={formData.expectedRental}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Booking Amount
            </label>
            <input
              type="text"
              name="bookingAmount"
              value={formData.bookingAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Annual dues payable
            </label>
            <input
              type="text"
              name="annualDuesPayable"
              value={formData.annualDuesPayable}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Membership charge
            </label>
            <input
              type="text"
              name="membershipCharge"
              value={formData.membershipCharge}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PricingDetailsModal;