import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import WriteReviewComponent from '../../../../../components/WriteReview';

export default function WriteReview() {
  const params = useLocalSearchParams();
  const propertyId = params.propertyId;
  const entityType = params.entityType || 'property';

  return (
    <WriteReviewComponent 
      entityId={propertyId} 
      entityType={entityType}
    />
  );
}