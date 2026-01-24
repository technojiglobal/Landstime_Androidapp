// utils/googleMapsConfig.js

/**
 * Extract address components from Google Maps geocoding result
 */
export const extractAddressComponents = (addressComponents) => {
  const components = {
    streetNumber: '',
    route: '',
    area: '',
    sublocality: '',
    locality: '',
    district: '',
    state: '',
    country: '',
    pincode: '',
    village: '',
    mandal: '',
    neighborhood: ''
  };

  if (!addressComponents || !Array.isArray(addressComponents)) {
    return components;
  }

  addressComponents.forEach((component) => {
    const types = component.types;

    if (types.includes('street_number')) {
      components.streetNumber = component.long_name;
    }
    if (types.includes('route')) {
      components.route = component.long_name;
    }
    if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
      components.area = component.long_name;
      components.sublocality = component.long_name;
    }
    if (types.includes('sublocality_level_2')) {
      components.neighborhood = component.long_name;
    }
    if (types.includes('locality')) {
      components.locality = component.long_name;
    }
    if (types.includes('administrative_area_level_3')) {
      components.mandal = component.long_name;
    }
    if (types.includes('administrative_area_level_2')) {
      components.district = component.long_name;
    }
    if (types.includes('administrative_area_level_1')) {
      components.state = component.long_name;
    }
    if (types.includes('country')) {
      components.country = component.long_name;
    }
    if (types.includes('postal_code')) {
      components.pincode = component.long_name;
    }
    if (types.includes('political') && component.long_name.includes('Village')) {
      components.village = component.long_name;
    }
  });

  return components;
};

/**
 * Format full address from components
 */
export const formatFullAddress = (components) => {
  const parts = [];

  if (components.streetNumber) parts.push(components.streetNumber);
  if (components.route) parts.push(components.route);
  if (components.area) parts.push(components.area);
  if (components.locality) parts.push(components.locality);
  if (components.district) parts.push(components.district);
  if (components.state) parts.push(components.state);
  if (components.pincode) parts.push(components.pincode);

  return parts.filter(Boolean).join(', ');
};