
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ReviewComponent from '../../../../../components/Review';

export default function Review() {
  const params = useLocalSearchParams();
  const propertyId = params.propertyId;
  const entityType = params.entityType || 'property';

  return (
    <ReviewComponent 
      entityId={propertyId} 
      entityType={entityType}
    />
  );
}