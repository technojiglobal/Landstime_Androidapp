import React from 'react';
import TextField from '../fields/TextField';
import NumberField from '../fields/NumberField';
import CounterField from '../fields/CounterField';
import ToggleButtonGroup from '../fields/ToggleButtonGroup';

const OfficeSetupSection = ({ formData, updateField }) => {
  const [showSeats, setShowSeats] = React.useState(false);

  return (
    <div className="space-y-6">
      <h3 className="font-semibold">Describe your office setup</h3>

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

      <div>
        <NumberField
          label="No of Seats(min)"
          name="noSeats"
          value={formData.noSeats}
          onChange={(value) => updateField('noSeats', value)}
        />
        <button
          type="button"
          onClick={() => setShowSeats(!showSeats)}
          className="text-green-600 text-sm mt-2"
        >
          + Add max seats
        </button>
      </div>

      {showSeats && (
        <NumberField
          label="Max Seats"
          name="maxSeats"
          value={formData.maxSeats}
          onChange={(value) => updateField('maxSeats', value)}
        />
      )}

      {/* Mark available features */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Mark the available features</h4>
        <p className="text-sm text-gray-600 mb-4">Select if your office space has below features</p>

        {/* Conference Room */}
        <div className="border-b pb-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Conference Room</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasConferenceRoom || false}
                onChange={(e) => updateField('hasConferenceRoom', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
          {formData.hasConferenceRoom && (
            <div className="flex gap-2">
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
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Wash Room</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasWashRoom || false}
                onChange={(e) => updateField('hasWashRoom', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
          {formData.hasWashRoom && (
            <>
              <div className="flex gap-2 mb-3">
                {['1', '2', '3', '4+'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => updateField('washRoomCount', num)}
                    className={`w-12 h-12 rounded-lg border ${
                      formData.washRoomCount === num
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {['Public Washroom', 'Private Washroom'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField('washRoomType', type)}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      formData.washRoomType === type
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Reception Area */}
        <div className="border-b pb-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Reception Area</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasReceptionArea || false}
                onChange={(e) => updateField('hasReceptionArea', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>

        {/* Pantry */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Pantry</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasPantry || false}
                onChange={(e) => updateField('hasPantry', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
          {formData.hasPantry && (
            <div className="flex gap-2">
              {['Private', 'Shared'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField('pantryType', type)}
                  className={`flex-1 px-4 py-2 rounded-lg border text-sm ${
                    formData.pantryType === type
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficeSetupSection;

