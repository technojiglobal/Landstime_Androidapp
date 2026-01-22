// Frontend/utils/reverseTranslation.js

// ✅ Reverse translation map: Telugu/Hindi → English
export const reverseTranslationMap = {
  // Ownership
  'ఇతర': 'Other',
  'अन्य': 'Other',
  'ఫ్రీహోల్డ్': 'Freehold',
  'फ्रीहोल्ड': 'Freehold',
  'లీజ్‌హోల్డ్': 'Leasehold',
  'लीजहोल्ड': 'Leasehold',
  'కో-ఆపరేటివ్ సొసైటీ': 'Co-operative Society',
  'सहकारी समिति': 'Co-operative Society',

  // Authority
  'స్థానిక అథారిటీ': 'Local Authority',
  'स्थानीय प्राधिकरण': 'Local Authority',

  // Flooring Types
  'కాంక్రీటు': 'Concrete',
  'कंक्रीट': 'Concrete',
  'పాలరాయి': 'Marble',
  'संगमरमर': 'Marble',
  'సిరామిక్': 'Ceramic',
  'सिरेमिक': 'Ceramic',
  'మొజాయిక్': 'Mosaic',
  'मोज़ेक': 'Mosaic',
  'సిమెంట్': 'Cement',
  'सीमेंट': 'Cement',
  'రాయి': 'Stone',
  'पत्थर': 'Stone',
  'వినైల్': 'Vinyl',
  'विनाइल': 'Vinyl',
  'స్పార్టెక్స్': 'Spartex',
  'स्पार्टेक्स': 'Spartex',
  'ఐపీఎస్': 'IPS',
  'आईपीएस': 'IPS',
  'విట్రిఫైడ్': 'Vitrified',
  'विट्रिफाइड': 'Vitrified',
  'చెక్క': 'Wooden',
  'लकड़ी': 'Wooden',
  'గ్రానైట్': 'Granite',
  'ग्रेनाइट': 'Granite',
  'ఇతరములు': 'Others',
  'अन्य': 'Others',

  // Vastu Directions
  'ఈశాన్యం': 'North-East',
  'उत्तर-पूर्व': 'North-East',
  'ఉత్తరం': 'North',
  'उत्तर': 'North',
  'తూర్పు': 'East',
  'पूर्व': 'East',
  'పడమర': 'West',
  'पश्चिम': 'West',
  'దక్షిణం': 'South',
  'दक्षिण': 'South',
  'నైరుతి': 'South-West',
  'दक्षिण-पश्चिम': 'South-West',
  'వాయువ్యం': 'North-West',
  'उत्तर-पश्चिम': 'North-West',
  'ఆగ్నేయం': 'South-East',
  'दक्षिण-पूर्व': 'South-East',

  // Vastu Options (more specific)
  'ఉత్తరం వైపు': 'Towards North',
  'उत्तर की ओर': 'Towards North',
  'సంతులిత ఓపెన్ స్పేస్': 'Balanced Open Space',
  'संतुलित खुली जगह': 'Balanced Open Space',
  'చతురస్రం': 'Square',
  'वर्ग': 'Square',
  'ఉత్తరం నీటి వనరు': 'Water Source in North',
  'उत्तर में जल स्रोत': 'Water Source in North',
  'సమాన ఎత్తు': 'Equal Height',
  'समान ऊंचाई': 'Equal Height',
  'నిర్మాణాలు లేవు': 'No Structures Above',
  'कोई संरचना नहीं': 'No Structures Above',

  // Other Rooms
  'పూజా గది': 'Pooja Room',
  'पूजा कक्ष': 'Pooja Room',
  'అధ్యయన గది': 'Study Room',
  'अध्ययन कक्ष': 'Study Room',
  'సేవకుల గది': 'Servant Room',
  'नौकर का कमरा': 'Servant Room',

  // Amenities
  '+నీటి నిల్వ': '+Water Storage',
  '+जल भंडारण': '+Water Storage',
  '+ప్రస్తుతం వాతానుకూలత': '+currently Air Conditioned',
  '+वर्तमान में एयर कंडीशनिंग': '+currently Air Conditioned',
  '+వాస్తు కాంప్లెక్స్': '+Vaastu Complex',
  '+वास्तु परिसर': '+Vaastu Complex',
  '+భద్రత అగ్ని అలారం': '+Security fire Alarm',
  '+सुरक्षा अग्नि अलार्म': '+Security fire Alarm',
  '+సందర్శకుల పార్కింగ్': '+Visitor Parking',
  '+आगंतुक पार्किंग': '+Visitor Parking',

  // Washroom Types
  'ఏదీ లేదు': 'None',
  'कोई नहीं': 'None',
  'భాగస్వామ్యం': 'Shared',
  'साझा': 'Shared',

  // Balconies
  '3 కంటే ఎక్కువ': 'More than 3',
  '3 से अधिक': 'More than 3',

  // Furnishing Types
  'అమర్చబడనిది': 'Unfurnished',
  'अस्सुसज्जित': 'Unfurnished',
  'పాక్షిక సమర్పించబడింది': 'Semi-furnished',
  'अर्ध-सुसज्जित': 'Semi-furnished',
  'అమర్చబడినది': 'Furnished',
  'सुसज्जित': 'Furnished',

  // Pre-Leased
  'అవును': 'Yes',
  'हाँ': 'Yes',
  'లేదు': 'No',
  'नहीं': 'No',

  // Add more as needed...
};

/**
 * Converts Telugu/Hindi text to English using the reverse map
 */
export const toEnglish = (text) => {
  if (!text) return text;
  if (typeof text !== 'string') return text;
  
  // Return English version if found, otherwise return original
  return reverseTranslationMap[text.trim()] || text;
};

/**
 * Recursively converts all string values in an object from Telugu/Hindi to English
 */
export const convertToEnglish = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return typeof obj === 'string' ? toEnglish(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertToEnglish(item));
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip multilingual fields - keep them as-is
    if (['propertyTitle', 'description', 'location', 'area'].includes(key)) {
      result[key] = value;
    } else {
      result[key] = convertToEnglish(value);
    }
  }
  
  return result;
};