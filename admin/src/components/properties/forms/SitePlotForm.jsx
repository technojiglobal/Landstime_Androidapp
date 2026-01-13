 import React from 'react';
import NumberField from '../fields/NumberField';
import TextField from '../fields/TextField';
import RadioButtons from '../fields/RadioButtons';
import NumberButtonGroup from '../fields/NumberButtonGroup';
import CheckboxGroup from '../fields/CheckboxGroup';
import SelectField from '../fields/SelectField';
import { 
  LOCATION_ADVANTAGES,
  AMENITIES,
  OUTSTANDING_OPTIONS,
  PLOT_RATING,
  DIRECTIONS,
  WATER_FACING_OPTIONS,
  ROAD_POSITION,
  COMPOUND_WALL_TYPE,
  LIVING_STRUCTURE
} from '../../../constants/propertyConstants';

const SitePlotForm = ({ formData, updateField }) => (
  <div className="space-y-6 border-t pt-6">
    <h3 className="font-semibold">Basic Details</h3>

    {/* Property Type Dropdown */}
    <SelectField
      label="Property Type"
      name="propertySubType"
      value={formData.propertySubType}
      onChange={(value) => updateField('propertySubType', value)}
      options={['', 'Surya Teja Sites']}
      placeholder="-- Select --"
    />

    {/* Price and Area Grid */}
    <div className="grid grid-cols-2 gap-4">
      <NumberField
        label="Price ₹ (per cent)"
        name="pricePerCent"
        value={formData.pricePerCent}
        onChange={(value) => updateField('pricePerCent', value)}
      />
      <NumberField
        label="Area (sqft)"
        name="area"
        value={formData.area}
        onChange={(value) => updateField('area', value)}
      />
      <NumberField
        label="Price ₹ (per acre)"
        name="pricePerAcre"
        value={formData.pricePerAcre}
        onChange={(value) => updateField('pricePerAcre', value)}
      />
      <TextField
        label="Length (optional)"
        name="length"
        value={formData.length}
        onChange={(value) => updateField('length', value)}
        placeholder="in ft."
      />
      <TextField
        label="Breadth (optional)"
        name="breadth"
        value={formData.breadth}
        onChange={(value) => updateField('breadth', value)}
        placeholder="in ft."
      />
      <TextField
        label="Floors Allowed for Construction"
        name="floorsAllowed"
        value={formData.floorsAllowed}
        onChange={(value) => updateField('floorsAllowed', value)}
        placeholder="No of floors"
      />
    </div>

    {/* Questions */}
    <RadioButtons
      label="Is there a boundary wall around the property?"
      name="boundaryWall"
      value={formData.boundaryWall}
      onChange={(value) => updateField('boundaryWall', value)}
      options={['Yes', 'No']}
    />

    <NumberButtonGroup
      label="No. of open sides"
      name="openSides"
      value={formData.openSides}
      onChange={(value) => updateField('openSides', value)}
      options={['1', '2', '3', '3+']}
    />

    <RadioButtons
      label="Any construction done on this property?"
      name="construction"
      value={formData.construction}
      onChange={(value) => updateField('construction', value)}
      options={['Yes', 'No']}
    />

    {/* If construction is done, show this */}
    {formData.construction === 'Yes' && (
      <TextField
        label="What sort of construction has been done?"
        name="constructionDetails"
        value={formData.constructionDetails}
        onChange={(value) => updateField('constructionDetails', value)}
        placeholder="Describe construction"
      />
    )}

    {/* Amenities */}
    <div className="border-t pt-6">
      <h3 className="font-semibold mb-4">Amenities</h3>
      <CheckboxGroup
        name="amenities"
        selected={formData.amenities || []}
        onChange={(value) => updateField('amenities', value)}
        options={AMENITIES}
      />
    </div>

    {/* Outstanding */}
    <div className="border-t pt-6">
      <h3 className="font-semibold mb-4">Outstanding</h3>
      <CheckboxGroup
        name="outstanding"
        selected={formData.outstanding || []}
        onChange={(value) => updateField('outstanding', value)}
        options={OUTSTANDING_OPTIONS}
      />
    </div>

    {/* Plot Rating */}
    <div className="border-t pt-6">
      <h3 className="font-semibold mb-4">Plot Rating</h3>
      <CheckboxGroup
        name="plotRating"
        selected={formData.plotRating || []}
        onChange={(value) => updateField('plotRating', value)}
        options={PLOT_RATING}
      />
    </div>

    {/* Water Facing Count */}
    <div className="border-t pt-6">
      <NumberField
        label="Water Facing Count"
        name="waterFacingCount"
        value={formData.waterFacingCount}
        onChange={(value) => updateField('waterFacingCount', value)}
        placeholder="0"
      />
    </div>

    {/* Location Advantages */}
    <div className="border-t pt-6">
      <h3 className="font-semibold mb-4">Location Advantages</h3>
      <CheckboxGroup
        name="locationAdvantages"
        selected={formData.locationAdvantages || []}
        onChange={(value) => updateField('locationAdvantages', value)}
        options={LOCATION_ADVANTAGES}
      />
    </div>

    {/* Vaasthu Details */}
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Vaasthu Details</h3>
        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm">
          😊
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Plot Facing"
          name="plotFacing"
          value={formData.plotFacing}
          onChange={(value) => updateField('plotFacing', value)}
          options={DIRECTIONS}
          placeholder="North-East"
        />
        
        <SelectField
          label="Main Door/Step Direction"
          name="mainDoorDirection"
          value={formData.mainDoorDirection}
          onChange={(value) => updateField('mainDoorDirection', value)}
          options={DIRECTIONS}
          placeholder="Complete North"
        />
        
        <SelectField
          label="Plot Stage Direction"
          name="plotStageDirection"
          value={formData.plotStageDirection}
          onChange={(value) => updateField('plotStageDirection', value)}
          options={DIRECTIONS}
          placeholder="Complete North"
        />
        
        <SelectField
          label="Open Well/Bore well"
          name="openWell"
          value={formData.openWell}
          onChange={(value) => updateField('openWell', value)}
          options={DIRECTIONS}
          placeholder="South-East"
        />
        
        <SelectField
          label="Storage"
          name="storage"
          value={formData.storage}
          onChange={(value) => updateField('storage', value)}
          options={DIRECTIONS}
        />
        
        <SelectField
          label="Road Position"
          name="roadPosition"
          value={formData.roadPosition}
          onChange={(value) => updateField('roadPosition', value)}
          options={ROAD_POSITION}
        />
        
        <SelectField
          label="Water Source Location"
          name="waterSourceLocation"
          value={formData.waterSourceLocation}
          onChange={(value) => updateField('waterSourceLocation', value)}
          options={DIRECTIONS}
        />
        
        <SelectField
          label="Drainage Direction"
          name="drainageDirection"
          value={formData.drainageDirection}
          onChange={(value) => updateField('drainageDirection', value)}
          options={DIRECTIONS}
        />
        
        <SelectField
          label="Compound Wall Height"
          name="compoundWallHeight"
          value={formData.compoundWallHeight}
          onChange={(value) => updateField('compoundWallHeight', value)}
          options={['', '3 feet', '4 feet', '5 feet', '6 feet', '7+ feet']}
        />
        
        <SelectField
          label="Compound Wall Length"
          name="compoundWallLength"
          value={formData.compoundWallLength}
          onChange={(value) => updateField('compoundWallLength', value)}
          options={['', 'All Sides', 'North-East', 'North-West', 'South-East', 'South-West']}
        />
      </div>
    </div>

    {/* Living Structure */}
    <div className="border-t pt-6">
      <h3 className="font-semibold mb-4">Living Structure</h3>
      <p className="text-sm text-gray-600 mb-4">
        Structure present in plots such as room, roof, shade, etc
      </p>
      <CheckboxGroup
        name="livingStructure"
        selected={formData.livingStructure || []}
        onChange={(value) => updateField('livingStructure', value)}
        options={LIVING_STRUCTURE}
      />
    </div>
  </div>
);

export default SitePlotForm;
