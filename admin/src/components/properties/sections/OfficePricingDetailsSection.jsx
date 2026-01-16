import React from 'react';
import NumberField from '../fields/NumberField';
import TextField from '../fields/TextField';
import RadioButtons from '../fields/RadioButtons';
import SelectField from '../fields/SelectField';
import TextAreaField from '../fields/TextAreaField';
import PricingSection from './PricingSection';

const OfficePricingDetailsSection = ({ formData, updateField }) => (
  <div className="space-y-6 border-t pt-6">
    <h3 className="font-semibold">Expected Price Details</h3>

    <NumberField
      label="Expected Price"
      name="expectedPrice"
      value={formData.expectedPrice}
      onChange={(value) => updateField('expectedPrice', value)}
      placeholder="₹ Expected Price"
    />

    <PricingSection formData={formData} updateField={updateField} />

    <button type="button" className="text-green-600 text-sm">
      + Add more pricing details
    </button>

    <RadioButtons
      label="Is it Pre-leased/ Pre-Reneted?"
      name="preLeased"
      value={formData.preLeased}
      onChange={(value) => updateField('preLeased', value)}
      options={['Yes', 'No']}
    />

    {formData.preLeased === 'Yes' && (
      <>
        <NumberField
          label="Current rent per month"
          name="currentRent"
          value={formData.currentRent}
          onChange={(value) => updateField('currentRent', value)}
          placeholder="₹ Current rent per month"
        />

        <NumberField
          label="Lease tenure in years"
          name="leaseTenure"
          value={formData.leaseTenure}
          onChange={(value) => updateField('leaseTenure', value)}
        />
      </>
    )}

    <RadioButtons
      label="Is your office fire NOC Certified?"
      name="fireNOC"
      value={formData.fireNOC}
      onChange={(value) => updateField('fireNOC', value)}
      options={['Yes', 'No']}
    />

    <RadioButtons
      label="Occupancy Certificate"
      name="occupancyCertificate"
      value={formData.occupancyCertificate}
      onChange={(value) => updateField('occupancyCertificate', value)}
      options={['Yes', 'No']}
    />

    <SelectField
      label="Office previously used for (optional)"
      name="previouslyUsedFor"
      value={formData.previouslyUsedFor}
      onChange={(value) => updateField('previouslyUsedFor', value)}
      options={['', 'Commercial', 'Residential', 'Industrial', 'Educational', 'Healthcare']}
    />

    <TextAreaField
      label="Description"
      name="description"
      value={formData.description}
      onChange={(value) => updateField('description', value)}
      placeholder="Write here what makes your property unique"
      rows={4}
    />
  </div>
);

export default OfficePricingDetailsSection;
