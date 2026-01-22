import React from 'react';
import NumberField from '../fields/NumberField';
import TextField from '../fields/TextField';
import CounterField from '../fields/CounterField';
import { FIRE_SAFETY } from '../../../constants/propertyConstants';

const OfficeDetailsSection = ({ formData, updateField }) => {
  return (
    <div className="space-y-6">
      
      {/* ==================== OFFICE SETUP ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Describe your office setup</h3>

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="No of Cabins"
            name="noCabins"
            value={formData.noCabins}
            onChange={(value) => updateField('noCabins', value)}
          />

          <NumberField
            label="No of Meeting Rooms"
            name="noMeetingRooms"
            value={formData.noMeetingRooms}
            onChange={(value) => updateField('noMeetingRooms', value)}
          />
        </div>

        <div className="mt-4">
          <NumberField
            label="No of Seats(min)"
            name="noSeats"
            value={formData.noSeats}
            onChange={(value) => updateField('noSeats', value)}
          />
        </div>

        <button type="button" className="text-green-600 text-sm mt-2">
          + Add max seats
        </button>

        {/* Mark available features */}
        <div className="mt-6">
          <h4 className="font-medium mb-2">Mark the available features</h4>
          <p className="text-sm text-gray-600 mb-4">Select if your office space has below features</p>

          {/* Conference Room */}
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="hasConferenceRoom"
                checked={formData.hasConferenceRoom || false}
                onChange={(e) => updateField('hasConferenceRoom', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-green-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="hasConferenceRoom" className="ml-2 font-medium">
                Conference Room
              </label>
            </div>
            {formData.hasConferenceRoom && (
              <div className="flex gap-2 ml-6">
                {['1', '2', '3', '4+'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => updateField('conferenceRoomCount', num)}
                    className={`w-12 h-12 rounded-lg border ${
                      formData.conferenceRoomCount === num
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wash Room */}
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="hasWashRoom"
                checked={formData.hasWashRoom || false}
                onChange={(e) => updateField('hasWashRoom', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-green-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="hasWashRoom" className="ml-2 font-medium">
                Wash Room
              </label>
            </div>
            {formData.hasWashRoom && (
              <div className="ml-6 space-y-3">
                {/* Public Washroom */}
                <div>
                  <p className="text-sm mb-2">Public Washroom</p>
                  <div className="flex gap-2">
                    {['1', '2', '3', '4+'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => updateField('publicWashRoomCount', num)}
                        className={`w-12 h-12 rounded-lg border ${
                          formData.publicWashRoomCount === num
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Private Washroom */}
                <div>
                  <p className="text-sm mb-2">Private Washrooms</p>
                  <div className="flex gap-2">
                    {['1', '2', '3', '4+'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => updateField('privateWashRoomCount', num)}
                        className={`w-12 h-12 rounded-lg border ${
                          formData.privateWashRoomCount === num
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reception Area */}
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasReceptionArea"
                checked={formData.hasReceptionArea || false}
                onChange={(e) => updateField('hasReceptionArea', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-green-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="hasReceptionArea" className="ml-2 font-medium">
                Reception Area
              </label>
            </div>
          </div>

          {/* Pantry */}
          <div className="border-b pb-4">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="hasPantry"
                checked={formData.hasPantry || false}
                onChange={(e) => updateField('hasPantry', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-green-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="hasPantry" className="ml-2 font-medium">
                Pantry
              </label>
            </div>
            {formData.hasPantry && (
              <div className="ml-6 space-y-3">
                <div className="flex gap-2">
                  {['Private', 'Shared'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateField('pantryType', type)}
                      className={`px-4 py-2 rounded-full border text-sm ${
                        formData.pantryType === type
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.pantrySize || ''}
                    onChange={(e) => updateField('pantrySize', e.target.value)}
                    placeholder="Pantry Size(optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
      
       

        <div className="mt-6">
          <h4 className="font-medium mb-3">Fire safety measures include</h4>
          <div className="flex flex-wrap gap-2">
            {FIRE_SAFETY.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  const current = formData.fireSafety || [];
                  if (current.includes(item)) {
                    updateField('fireSafety', current.filter(i => i !== item));
                  } else {
                    updateField('fireSafety', [...current, item]);
                  }
                }}
                className={`px-3 py-1 rounded-full border text-xs ${
                  (formData.fireSafety || []).includes(item)
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                + {item}
              </button>
            ))}
          </div>
        </div>
      

      {/* ==================== FLOOR DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Floor Details</h3>

        <div className="space-y-4">
          <NumberField
            label="Floor Number"
            name="floorNumber"
            value={formData.floorNumber}
            onChange={(value) => updateField('floorNumber', value)}
            placeholder="2"
          />

          <TextField
            label="Your Floor No (optional)"
            name="yourFloorNo"
            value={formData.yourFloorNo}
            onChange={(value) => updateField('yourFloorNo', value)}
          />

          <div>
            <label className="block text-sm font-medium mb-2">No of stair cases (optional)</label>
            <div className="flex gap-2">
              {['1', '2', '3', '4+'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => updateField('noStairCases', num)}
                  className={`w-12 h-12 rounded-lg border ${
                    formData.noStairCases === num
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Lifts */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Lifts</h4>
            
            <div className="flex gap-2 mb-4">
              {['Available', 'Not Available'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateField('liftsAvailable', option)}
                  className={`px-4 py-2 rounded-full border text-sm ${
                    formData.liftsAvailable === option
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {formData.liftsAvailable === 'Available' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <CounterField
                    label="Passenger Lifts"
                    value={formData.passengerLifts || 0}
                    onChange={(value) => updateField('passengerLifts', value)}
                  />
                </div>
                <div className="border rounded-lg p-4">
                  <CounterField
                    label="Service Lifts"
                    value={formData.serviceLifts || 0}
                    onChange={(value) => updateField('serviceLifts', value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== PARKING ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Parking</h3>

        <div className="flex gap-2 mb-4">
          {['Available', 'Not Available'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => updateField('parkingAvailable', option)}
              className={`px-4 py-2 rounded-full border text-sm ${
                formData.parkingAvailable === option
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {formData.parkingAvailable === 'Available' && (
          <>
            <div className="space-y-2 mb-4">
              {['Private Parking in Basement', 'Private Parking Outside', 'Public Parking'].map((location) => (
                <div key={location} className="flex items-center">
                  <input
                    type="checkbox"
                    id={location.replace(/\s+/g, '')}
                    checked={(formData.parkingLocations || []).includes(location)}
                    onChange={(e) => {
                      const current = formData.parkingLocations || [];
                      if (e.target.checked) {
                        updateField('parkingLocations', [...current, location]);
                      } else {
                        updateField('parkingLocations', current.filter(l => l !== location));
                      }
                    }}
                    className="w-4 h-4 text-green-600 bg-green-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor={location.replace(/\s+/g, '')} className="ml-2 text-sm">
                    {location}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <NumberField
                label="No of Parking(Optional)"
                name="noParking"
                value={formData.noParking}
                onChange={(value) => updateField('noParking', value)}
              />
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default OfficeDetailsSection;