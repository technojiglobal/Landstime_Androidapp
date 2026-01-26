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

  // Company Owned
  'కంపెనీ యాజమాన్యం': 'Company Owned',
  'कंपनी स्वामित्व': 'Company Owned',

  // Directions - Towards variants
  'పడమర వైపు': 'Towards West',
  'पश्चिम की ओर': 'Towards West',
  'దక్షిణం వైపు': 'Towards South',
  'दक्षिण की ओर': 'Towards South',

  // Office Kind
  'వెంటనే తరలించగల కార్యాలయ స్థలం': 'Ready to Move-in Office',
  'तुरंत स्थानांतरित कार्यालय स्थान': 'Ready to Move-in Office',
  
  // Located Inside
  'వ్యాపార పార్క్': 'Business Park',
  'व्यापार पार्क': 'Business Park',
  'ఐటి పార్క్': 'IT Park',
  'आईटी पार्क': 'IT Park',
  
  // Zone Types
  'ప్రజా మరియు సెమీ ప్రజా వినియోగం': 'Public and Semi Public use',
  'सार्वजनिक और अर्ध सार्वजनिक उपयोग': 'Public and Semi Public use',
  'వాణిజ్య': 'Commercial',
  'वाणिज्यिक': 'Commercial',
  
  // Fire Safety
  'అగ్నిమాపక పరికరం': 'Fire Extinguisher',
  'अग्निशामक यंत्र': 'Fire Extinguisher',
  
  // Age of Property
  '0-1 సంవత్సరాలు': '0-1 years',
  '0-1 वर्ष': '0-1 years',
  '1-5 సంవత్సరాలు': '1-5 years',
  '1-5 वर्ष': '1-5 years',
  '5-10 సంవత్సరాలు': '5-10 years',
  '5-10 वर्ष': '5-10 years',
  '10+ సంవత్సరాలు': '10+ years',
  '10+ वर्ष': '10+ years',
  
  // Previously Used For
  'వాణిజ్య': 'Commercial',
  'वाणिज्यिक': 'Commercial',
  'నివాస': 'Residential',
  'आवासीय': 'Residential',
  'గిడ్డంగి/నిల్వ': 'Warehouse/Storage',
  'गोदाम/भंडारण': 'Warehouse/Storage',
  
  // Pantry Type
  'ప్రైవేట్': 'Private',
  'निजी': 'Private',
  'షేర్డ్': 'Shared',
  'साझा': 'Shared',

  // ✅ ADD STORAGE-SPECIFIC MAPPINGS
  
  // Flooring - Storage
  'కాంక్రీటు': 'Concrete',
  'कंक्रीट': 'Concrete',
  'టైల్స్': 'Tiles',
  'टाइल्स': 'Tiles',
  'ఎపాక్సీ': 'Epoxy',
  'इपॉक्सी': 'Epoxy',
  
  // Ventilation
  'సహజ': 'Natural',
  'प्राकृतिक': 'Natural',
  'యాంత్రిక': 'Mechanical',
  'यांत्रिक': 'Mechanical',
  'రెండూ': 'Both',
  'दोनों': 'Both',
  
  // Storage Type
  'కవర్డ్': 'Covered',
  'कवर्ड': 'Covered',
  'ఓపెన్': 'Open',
  'खुला': 'Open',
  
  // Security
  'సిసిటివి': 'CCTV',
  'सीसीटीवी': 'CCTV',
  'భద్రతా గార్డు': 'Security Guard',
  'सुरक्षा गार्ड': 'Security Guard',
  'అలారం వ్యవస్థ': 'Alarm System',
  'अलार्म सिस्टम': 'Alarm System',
  'అగ్ని భద్రత': 'Fire Safety',
  'अग्नि सुरक्षा': 'Fire Safety',
  
  // Accessibility
  'డాక్ స్థాయి': 'Dock Level',
  'डॉक लेवल': 'Dock Level',
  'నేల స్థాయి': 'Ground Level',
  'जमीनी स्तर': 'Ground Level',
  'ర్యాంప్ యాక్సెస్': 'Ramp Access',
  'रैंप एक्सेस': 'Ramp Access',

  'రవాణా మరియు కమ్యూనికేషన్': 'Transport and Communication',
  'परिवहन और संचार': 'Transport and Communication',
  'నివాస': 'Residential',
  'आवासीय': 'Residential',
  'వాణిజ్య': 'Commercial',
  'वाणिज्यिक': 'Commercial',
  'ప్రజా మరియు సెమీ ప్రజా వినియోగం': 'Public and Semi Public use',
  'सार्वजनिक और अर्ध सार्वजनिक उपयोग': 'Public and Semi Public use',
  'ఓపెన్ స్పేస్': 'Open Spaces',
  'खुली जगह': 'Open Spaces',
  'వ్యవసాయ జోన్': 'Agricultural Zone',
  'कृषि क्षेत्र': 'Agricultural Zone',
  'SEZ': 'SEZ',
  'పరిరక్షణ జోన్': 'Conservation Zone',
  'संरक्षण क्षेत्र': 'Conservation Zone',
  'ప్రభుత్వ వినియోగం': 'Government Use',
  'सरकारी उपयोग': 'Government Use',

  // Amenities - Telugu to English
  '+నీటి నిల్వ': '+Water Storage',
  '+ప్రస్తుతం వాతానుకూలత': '+currently Air Conditioned',
  '+వాస్తు కాంప్లెక్స్': '+Vaastu Complex',
  '+భద్రత అగ్ని అలారం': '+Security fire Alarm',
  '+సందర్శకుల పార్కింగ్': '+Visitor Parking',

  // Location Advantages - Telugu to English
  '+మెట్రో స్టేషన్ దగ్గర': '+Close to Metro Station',
  '+పాఠశాల దగ్గర': '+Close to School',
  '+ఆసుపత్రి దగ్గర': '+Close to Hospital',
  '+మార్కెట్ దగ్గర': '+Close to Market',
  '+రైల్వే స్టేషన్ దగ్గర': '+Close to Railway Station',
  '+విమానాశ్రయం దగ్గర': '+Close to Airport',
  '+మాల్ దగ్గర': '+Close to Mall',
  '+హైవే దగ్గర': '+Close to Highway',


  // ✅ ADD HOSPITALITY TRANSLATIONS
  
  // Months
  'జనవరి': 'January',
  'जनवरी': 'January',
  'ఫిబ్రవరి': 'February',
  'फ़रवरी': 'February',
  'మార్చి': 'March',
  'मार्च': 'March',
  'ఏప్రిల్': 'April',
  'अप्रैल': 'April',
  'మే': 'May',
  'मई': 'May',
  'జూన్': 'June',
  'जून': 'June',
  'జూలై': 'July',
  'जुलाई': 'July',
  'ఆగస్టు': 'August',
  'अगस्त': 'August',
  'సెప్టెంబర్': 'September',
  'सितंबर': 'September',
  'అక్టోబర్': 'October',
  'अक्टूबर': 'October',
  'నవంబర్': 'November',
  'नवंबर': 'November',
  'డిసెంబర్': 'December',
  'दिसंबर': 'December',
  
  // Possession Timeline
  'వెంటనే': 'Immediate',
  'तुरंत': 'Immediate',
  '3 నెలల్లో': 'Within 3 months',
  '3 महीने के भीतर': 'Within 3 months',
  '6 నెలల్లో': 'Within 6 months',
  '6 महीने के भीतर': 'Within 6 months',
  '2025 నాటికి': 'By 2025',
  '2025 तक': 'By 2025',
  '2026 నాటికి': 'By 2026',
  '2026 तक': 'By 2026',
  '2027 నాటికి': 'By 2027',
  '2027 तक': 'By 2027',
  '2028 నాటికి': 'By 2028',
  '2028 तक': 'By 2028',
  '2029 నాటికి': 'By 2029',
  '2029 तक': 'By 2029',
  '2030 నాటికి': 'By 2030',
  '2030 तक': 'By 2030',
  
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
  
  // Location Advantages
  '+మెట్రో స్టేషన్ దగ్గర': '+Close to Metro Station',
  '+मेट्रो स्टेशन के पास': '+Close to Metro Station',
  '+పాఠశాల దగ్గర': '+Close to School',
  '+स्कूल के पास': '+Close to School',
  '+ఆసుపత్రి దగ్గర': '+Close to Hospital',
  '+अस्पताल के पास': '+Close to Hospital',
  '+మార్కెట్ దగ్గర': '+Close to Market',
  '+बाजार के पास': '+Close to Market',
  '+రైల్వే స్టేషన్ దగ్గర': '+Close to Railway Station',
  '+रेलवे स्टेशन के पास': '+Close to Railway Station',
  '+విమానాశ్రయం దగ్గర': '+Close to Airport',
  '+हवाई अड्डे के पास': '+Close to Airport',
  '+మాల్ దగ్గర': '+Close to Mall',
  '+मॉल के पास': '+Close to Mall',
  '+హైవే దగ్గర': '+Close to Highway',
  '+राजमार्ग के पास': '+Close to Highway',


  // Ownership (Retail)
  'ఫ్రీహోల్డ్': 'Freehold',
  'फ्रीहोल्ड': 'Freehold',
  'లీజ్‌హోల్డ్': 'Leasehold',
  'लीजहोल्ड': 'Leasehold',
  'కో-ఆపరేటివ్ సొసైటీ': 'Co-operative Society',
  'सहकारी समिति': 'Co-operative Society',
  'అధికార పత్రం': 'Power of Attorney',
  'पावर ऑफ अटॉर्नी': 'Power of Attorney',

  // Previously Used For (Retail)
  'వాణిజ్య': 'Commercial',
  'वाणिज्यिक': 'Commercial',
  'రిటైల్': 'Retail',
  'रिटेल': 'Retail',
  'గిడ్డంగి': 'Warehouse',
  'गोदाम': 'Warehouse',

  // Amenities (Retail)
  '+ సేవ/వస్తువుల లిఫ్ట్': '+ Service/Goods Lift',
  '+ सेवा/माल लिफ्ट': '+ Service/Goods Lift',
  '+ నిర్వహణ సిబ్బంది': '+ Maintenance Staff',
  '+ रखरखाव कर्मचारी': '+ Maintenance Staff',
  '+ నీటి నిల్వ': '+ Water Storage',
  '+ जल भंडारण': '+ Water Storage',
  '+ ఎటిఎం': '+ ATM',
  '+ एटीएम': '+ ATM',
  '+ నీటి పారద్రోలణ': '+ Water Disposal',
  '+ जल निपटान': '+ Water Disposal',
  '+ వర్షపు నీటి సేకరణ': '+ Rainwater Harvesting',
  '+ वर्षा जल संचयन': '+ Rainwater Harvesting',
  '+ భద్రత అగ్ని అలారం': '+ Security Fire Alarm',
  '+ सुरक्षा अग्नि अलार्म': '+ Security Fire Alarm',
  '+ బ్యాంకు దగ్గర': '+ Near Bank',
  '+ बैंक के पास': '+ Near Bank',
  '+ సందర్శకుల పార్కింగ్': '+ Visitor Parking',
  '+ आगंतुक पार्किंग': '+ Visitor Parking',
  '+ భద్రతా రక్షకుడు': '+ Security Guard',
  '+ सुरक्षा गार्ड': '+ Security Guard',
  '+ లిఫ్ట్(లు)': '+ Lift(s)',
  '+ लिफ्ट(एं)': '+ Lift(s)',

  // Location Advantages (Retail)
  '+ మెట్రో స్టేషన్ దగ్గర': '+ Close to Metro Station',
  '+ मेट्रो स्टेशन के पास': '+ Close to Metro Station',
  '+ పాఠశాల దగ్గర': '+ Close to School',
  '+ स्कूल के पास': '+ Close to School',
  '+ ఆసుపత్రి దగ్గర': '+ Close to Hospital',
  '+ अस्पताल के पास': '+ Close to Hospital',
  '+ మార్కెట్ దగ్గర': '+ Close to Market',
  '+ बाजार के पास': '+ Close to Market',
  '+ రైల్వే స్టేషన్ దగ్గర': '+ Close to Railway Station',
  '+ रेलवे स्टेशन के पास': '+ Close to Railway Station',
  '+ విమానాశ్రయం దగ్గర': '+ Close to Airport',
  '+ हवाई अड्डे के पास': '+ Close to Airport',
  '+ మాల్ దగ్గర': '+ Close to Mall',
  '+ मॉल के पास': '+ Close to Mall',
  '+ హైవే దగ్గర': '+ Close to Highway',
  '+ राजमार्ग के पास': '+ Close to Highway',

  // Vastu Directions (Retail) - Keep existing direction mappings
  // These are already in your file, just verify they exist:
  'ఉత్తరం': 'North',
  'उत्तर': 'North',
  'తూర్పు': 'East',
  'पूर्व': 'East',
  'ఈశాన్యం': 'North-East',
  'उत्तर-पूर्व': 'North-East',
  'పడమర': 'West',
  'पश्चिम': 'West',
  'దక్షిణం': 'South',
  'दक్षिण': 'South',
  'నైరుతి': 'South-West',
  'दक्षिण-पश्चिम': 'South-West',
  'వాయువ్యం': 'North-West',
  'उत्तर-पश्चिम': 'North-West',
  'ఆగ్నేయం': 'South-East',
  'दक्षिण-पूर्व': 'South-East',

  // Yes/No (keep existing)
  'అవును': 'Yes',
  'हाँ': 'Yes',
  'లేదు': 'No',
  'नहीं': 'No',

  // ADD THESE TO reverseTranslationMap object:

// Located Inside (Retail)
'మాల్': 'Mall',
'मॉल': 'Mall',
'వాణిజ్య ప్రాజెక్ట్': 'Commercial Project',
'वाणिज्यिक परियोजना': 'Commercial Project',
'నివాస ప్రాజెక్ట్': 'Residential Project',
'आवासीय परियोजना': 'Residential Project',
'రిటైల్ కాంప్లెక్స్ / భవనం': 'Retail Complex / Building',
'रिटेल कॉम्प्लेक्स / भवन': 'Retail Complex / Building',
'మార్కెట్ / హై స్ట్రీట్': 'Market / High Street',
'बाजार / हाई स्ट्रीट': 'Market / High Street',

// Washroom (Retail)
'+ ప్రైవేట్ వాష్‌రూమ్‌లు': '+ Private Washrooms',
'+ निजी वाशरूम': '+ Private Washrooms',
'+ పబ్లిక్ వాష్‌రూమ్‌లు': '+ Public Washrooms',
'+ सार्वजनिक वाशरूम': '+ Public Washrooms',
'అందుబాటులో లేదు': 'Not Available',
'उपलब्ध नहीं': 'Not Available',

// Located Near (Retail) - FIX: Remove extra '+ prefix
'+ ప్రవేశ ద్వారం సమీపంలో': '+ Entrance',
'+ प्रवेश द्वार के पास': '+ Entrance',
'+ లిఫ్ట్ సమీపంలో': '+ Elevator',
'+ लिफ्ट के पास': '+ Elevator',
'+ మెట్లు సమీపంలో': '+ Stairs',
'+ सीढ़ियों के पास': '+ Stairs',

// Parking (Retail)
'+ ప్రైవేట్ పార్కింగ్': '+ Private Parking',
'+ निजी पार्किंग': '+ Private Parking',
'+ పబ్లిక్ పార్కింగ్': '+ Public Parking',
'+ सार्वजनिक पार्किंग': '+ Public Parking',
'+ బహుళస్థాయి పార్కింగ్': '+ Multilevel Parking',
'+ बहुस्तरीय पार्किंग': '+ Multilevel Parking',

// Availability (Retail)
'వెంటనే తరలించడానికి సిద్ధంగా ఉంది': 'Ready to move',
'तुरंत स्थानांतरित करने के लिए तैयार': 'Ready to move',
'నిర్మాణంలో ఉంది': 'Under Construction',
'निर्माणाधीन': 'Under Construction',

// Age of Property (Retail)
'0-1 సంవత్సరాలు': '0-1 years',
'0-1 वर्ष': '0-1 years',
'1-5 సంవత్సరాలు': '1-5 years',
'1-5 वर्ष': '1-5 years',
'5-10 సంవత్సరాలు': '5-10 years',
'5-10 वर्ष': '5-10 years',
'10+ సంవత్సరాలు': '10+ years',
'10+ वर्ष': '10+ years',

// Months (Retail)
'జనవరి': 'January',
'जनवरी': 'January',
'ఫిబ్రవరి': 'February',
'फ़रवरी': 'February',
'మార్చి': 'March',
'मार्च': 'March',
'ఏప్రిల్': 'April',
'अप्रैल': 'April',
'మే': 'May',
'मई': 'May',
'జూన్': 'June',
'जून': 'June',
'జూలై': 'July',
'जुलाई': 'July',
'ఆగస్టు': 'August',
'अगस्त': 'August',
'సెప్టెంబర్': 'September',
'सितंबर': 'September',
'అక్టోబర్': 'October',
'अक्टूबर': 'October',
'నవంబర్': 'November',
'नवंबर': 'November',
'డిసెంబర్': 'December',
'दिसंबर': 'December',

// Business Types (Retail)
'ఎటిఎం': 'ATM',
'एटीएम': 'ATM',
'బేకరీ': 'Bakery',
'बेकरी': 'Bakery',
'బోటిక్': 'Boutique',
'बुटीक': 'Boutique',
'క్లినిక్': 'Clinic',
'क्लिनिक': 'Clinic',
'బట్టలు': 'Clothes',
'कपड़े': 'Clothes',
'క్లౌడ్ కిచెన్': 'Cloud Kitchen',
'क्लाउड किचन': 'Cloud Kitchen',
'కాఫీ': 'Coffee',
'कॉफ़ी': 'Coffee',
'ఫాస్ట్ ఫుడ్': 'Fast Food',
'फास्ट फूड': 'Fast Food',
'చెప్పులు': 'Footwear',
'जूते': 'Footwear',
'కిరాణా': 'Grocery',
'किराना': 'Grocery',
'జిమ్': 'Gym',
'जिम': 'Gym',
'ఆభరణాలు': 'Jewellery',
'आभूषण': 'Jewellery',
'మెడికల్': 'Medical',
'चिकित्सा': 'Medical',
'మొబైల్': 'Mobile',
'मोबाइल': 'Mobile',
'రెస్టారెంట్': 'Restaurant',
'रेस्तरां': 'Restaurant',
'సెలూన్/స్పా': 'Salon/Spa',
'सैलून/स्पा': 'Salon/Spa',
'స్వీట్ షాప్': 'Sweet Shop',
'मिठाई की दुकान': 'Sweet Shop',

// Previously Used (Retail)
'రిటైల్': 'Retail',
'रिटेल': 'Retail',
'గిడ్డంగి': 'Warehouse',
'गोदाम': 'Warehouse',

// Ownership (Retail)
'అధికార పత్రం': 'Power of Attorney',
'पावर ऑफ अटॉर्नी': 'Power of Attorney',

// Amenities (Retail)
'+ సేవ/వస్తువుల లిఫ్ట్': '+ Service/Goods Lift',
'+ सेवा/माल लिफ्ट': '+ Service/Goods Lift',
'+ నిర్వహణ సిబ్బంది': '+ Maintenance Staff',
'+ रखरखाव कर्मचारी': '+ Maintenance Staff',
'+ నీటి పారవేయడం': '+ Water Disposal',
'+ जल निपटान': '+ Water Disposal',
'+ వర్షపు నీటి సేకరణ': '+ Rainwater Harvesting',
'+ वर्षा जल संचयन': '+ Rainwater Harvesting',
'+ భద్రత అగ్ని అలారం': '+ Security Fire Alarm',
'+ सुरक्षा अग्नि अलार्म': '+ Security Fire Alarm',
'+ బ్యాంకు సమీపంలో': '+ Near Bank',
'+ बैंक के पास': '+ Near Bank',
'+ లిఫ్ట్(లు)': '+ Lift(s)',
'+ लिफ्ट(एं)': '+ Lift(s)',

// Location Advantages (Retail)
'+ మార్కెట్ సమీపంలో': '+ Close to Market',
'+ बाजार के पास': '+ Close to Market',
'+ పాఠశాల సమీపంలో': '+ Close to School',
'+ स्कूल के पास': '+ Close to School',

// ✅ ADD THESE to reverseTranslationMap object:

// Located Near (FIX: Remove duplicate '+ prefix)
"+ లిఫ్ట్ సమీపంలో": "+ Elevator",
"+ लिफ्ट के पास": "+ Elevator",
"+ మెట్లు సమీపంలో": "+ Stairs",
"+ सीढ़ियों के पास": "+ Stairs",
"+ ప్రవేశ ద్వారం సమీపంలో": "+ Entrance",
"+ प्रवेश द्वार के पास": "+ Entrance",

// Availability (FIX: Your current Telugu text)
"తరలించడానికి సిద్ధంగా ఉంది": "Ready to move",
"स्थानांतरित करने के लिए तैयार": "Ready to move",

// Amenities (FIX: Remove quote prefix)
"+ భద్రతా అగ్ని అలారం": "+ Security Fire Alarm",
"+ सुरक्षा अग्नि अलार्म": "+ Security Fire Alarm",
"+ నీటి పారవేయడం": "+ Water Disposal",
"+ जल निपटान": "+ Water Disposal",
"+ నీటి నిల్వ": "+ Water Storage",
"+ जल भंडारण": "+ Water Storage",
"+ వర్షపు నీటి సేకరణ": "+ Rainwater Harvesting",
"+ वर्षा जल संचयन": "+ Rainwater Harvesting",
"+ సేవ/వస్తువుల లిఫ్ట్": "+ Service/Goods Lift",
"+ सेवा/माल लिफ्ट": "+ Service/Goods Lift",
"+ నిర్వహణ సిబ్బంది": "+ Maintenance Staff",
"+ रखरखाव कर्मचारी": "+ Maintenance Staff",
"+ ఎటిఎం": "+ ATM",
"+ एटीएम": "+ ATM",
"+ బ్యాంకు సమీపంలో": "+ Near Bank",
"+ बैंक के पास": "+ Near Bank",
"+ సందర్శకుల పార్కింగ్": "+ Visitor Parking",
"+ आगंतुक पार्किंग": "+ Visitor Parking",
"+ భద్రతా గార్డు": "+ Security Guard",
"+ सुरक्षा गार्ड": "+ Security Guard",
"+ లిఫ్ట్(లు)": "+ Lift(s)",
"+ लिफ्ट(एं)": "+ Lift(s)",

// Location Advantages (FIX: Remove quote prefix)
"+ మార్కెట్ సమీపంలో": "+ Close to Market",
"+ बाजार के पास": "+ Close to Market",
"+ ఆసుపత్రి సమీపంలో": "+ Close to Hospital",
"+ अस्पताल के पास": "+ Close to Hospital",
"+ పాఠశాల సమీపంలో": "+ Close to School",
"+ स्कूल के पास": "+ Close to School",
"+ మెట్రో స్టేషన్ సమీపంలో": "+ Close to Metro Station",
"+ मेट्रो स्टेशन के पास": "+ Close to Metro Station",
"+ రైల్వే స్టేషన్ సమీపంలో": "+ Close to Railway Station",
"+ रेलवे स्टेशन के पास": "+ Close to Railway Station",
"+ విమానాశ్రయం సమీపంలో": "+ Close to Airport",
"+ हवाई अड्डे के पास": "+ Close to Airport",
"+ మాల్ సమీపంలో": "+ Close to Mall",
"+ मॉल के पास": "+ Close to Mall",
"+ హైవే సమీపంలో": "+ Close to Highway",
"+ राजमार्ग के पास": "+ Close to Highway",

// Vastu Directions (FIX: Remove quote prefix)
"తూర్పు": "East",
"पूर्व": "East",
"వాయువ్యం": "North-West",
"उत्तर-पश्चिम": "North-West",



 
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