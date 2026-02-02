// admin/src/constants/propertyConstants.js
export const PROPERTY_TYPES = [
  { value: 'House/Flat', label: 'House/Flat' },
  { value: 'Site/Plot(Land)', label: 'Site/Plot(Land)' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Resort', label: 'Resort' }
];
export const RESORT_TYPES = [
  { value: 'Beachfront Resort', label: 'Beachfront Resort' },
  { value: 'Hill Station / Mountain Resort', label: 'Hill Station / Mountain Resort' },
  { value: 'Forest / Jungle Retreat', label: 'Forest / Jungle Retreat' },
  { value: 'Lakefront Resort', label: 'Lakefront Resort' },
  { value: 'Desert Resort', label: 'Desert Resort' },
  { value: 'Eco-Resort', label: 'Eco-Resort' },
  { value: 'Island Resort', label: 'Island Resort' },
  { value: 'Wellness / Spa Resort', label: 'Wellness / Spa Resort' },
  { value: 'Luxury Resort', label: 'Luxury Resort' },
  { value: 'Family Resort', label: 'Family Resort' },
  { value: 'Adventure / Activity Resort', label: 'Adventure / Activity Resort' },
  { value: 'Safari / Wildlife Resort', label: 'Safari / Wildlife Resort' },
  { value: 'Water Park Resort', label: 'Water Park Resort' },
  { value: 'Golf Resort', label: 'Golf Resort' },
    { value: 'Riverfront Resort', label: 'Riverfront Resort' },
    { value: 'Farm / Agri-Resort', label: 'Farm / Agri-Resort' },
    { value: 'Business / Conference Resort', label: 'Business / Conference Resort' },
    { value: 'City Resort', label: 'City Resort' },
    { value: 'Eco-Lodge / Nature Retreat', label: 'Eco-Lodge / Nature Retreat' }

 
];
export const COMMERCIAL_TYPES = [
  { value: 'Office', label: 'Office' },
  { value: 'Storage', label: 'Storage' },
  { value: 'Hospitality', label: 'Hospitality' },
  { value: 'Site', label: 'Site' },
  { value: 'Other', label: 'Other' }
];

export const POSSESSION_OPTIONS = [
  'Immediate',
  'Within 3 months',
  'Within 6 months',
  'By 2026',
  'By 2027',
  'By 2028',
  'By 2029',
  'By 2030'
];
export const POSSESSION_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DIRECTIONS = [
  'North', 'South', 'East', 'West',
  'North-East', 'North-West', 'South-East', 'South-West'
];

export const OTHER_ROOMS = [
  'Study Room',
  'Prayer/Pooja Room',
  'Servant Room',
  'Store Room'
];

export const AGE_OF_PROPERTY = [
  '0-1 year',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years'
];

export const FURNISHING_OPTIONS = [
  'Furnished',
  'Semi-furnished',
  'Unfurnished'
];

export const PARKING_OPTIONS = [
  'Covered parking',
  'Open parking',
  'Two wheeler parking',
  'Visitor parking'
];

export const FACILITIES = [
  'Lift',
  'Power Backup',
  'Gas Pipeline',
  'Park',
  'RO Water System',
  'Security/Watchman'
];

export const LOCATION_ADVANTAGES = [
  'Close to School',
  'Close to Hospital',
  'Close to Market',
  'Close to Railway Station',
  'Close to Airport',
  'Close to Mall',
  'Close to Highway'
];

  export const AMENITIES = [
  'Landscaping/Govt',
  'Nearby Road',
  'Park/Green Belt',
  'Children Play',
  'CCTV',
  'Pathway',
  'Avenue Tree Plantation',
  'Sewage',
  'Solar Light',
  'Compound Wall',
  'Street Light',
  'Drinking Water',
  'Rain Water',
  'Drainage',
  'Electricity',
  'Bordering'
];

export const OUTSTANDING_OPTIONS = [
  'No Outstanding',
  'Outstandings',
  'Government Outstanding',
  'Private Outstanding'
];

export const PLOT_RATING = [
  '1 Star',
  '2 Star', 
  '3 Star',
  '4 Star',
  '5 Star'
];

export const WATER_FACING_OPTIONS = [
  'Canal',
  'Stream',
  'Pond/Lake',
  'River'
];

export const ROAD_POSITION = [
  'Corner',
  'T-Junction',
  'Dead End',
  'Y-Junction',
  'Middle'
];

export const COMPOUND_WALL_TYPE = [
  'Barbed Wire',
  'Chain Link',
  'Caste Iron',
  'RCC Wall',
  'Brick Wall',
  'No Compound Wall'
];

export const LIVING_STRUCTURE = [
  'No Structure',
  'Rooms',
  'Shed',
  'Terrace'
];
export const OFFICE_TYPES = [
  'Ready to move office space',
  'Bare shell office space',
  'Co-working office space'
];
export const RETAIL_TYPES = [
  'Commercial Shops',
  'Commercial Showrooms',
  
];
export const PLOT_TYPES = [
  'commercial Land/Inst.Land',
  'Agricultural/Farm Land',
  'Industrial Lands/Plots',
  
];
export const STORAGE_TYPES = [
  'Warehouse',
  'Cold Storage',
 
  
];
export const COMMERCIAL_SUB_TYPES = [
  'Office',
  'Retail',
  'Plot/Land',
  'Storage',
  'Industry',
  'Hospitality',
  'Other'
];

// Office Setup Features
export const OFFICE_FEATURES = [
  { name: 'Conference Room', hasCount: true },
  { name: 'Wash Room', hasSubTypes: ['Public Washroom', 'Private Washroom'] },
  { name: 'Reception Area', hasCount: false },
  { name: 'Pantry', hasSubTypes: ['Private', 'Shared'] }
];

export const FURNISHING_ITEMS = [
  'Furnishing',
  'Central AC',
  'Oxygen Duct',
  'UPS'
];

export const FIRE_SAFETY = [
  'Fire Extinguisher',
  'Fire Sensors',
  'Sprinklers',
  'Fire Hose'
];

export const PARKING_TYPES = [
  'Available',
  'Not Available'
];

export const PARKING_LOCATIONS = [
  'Private Parking in Basement',
  'Private Parking Outside',
  'Public Parking'
];

export const OWNERSHIP_TYPES = [
  'Freehold',
  'Leasehold',
  'Co-operative Society',
  'Power of Attorney'
];

// Office Amenities
export const OFFICE_AMENITIES = [
  'Maintenance Staff',
  'Water Storage',
  'Water Disposal',
  'ATM',
  'Shopping Center',
  'Wheelchair Accessibility',
  'Cafeteria/Foodcourt',
  'DG Availability',
  'CCTV Surveillance',
  'Grocery shop',
  'Visitor Parking',
  'Power Backup',
  'Lift(s)'
];
// Office Amenities
export const PLOT_AMENITIES = [
  'Maintenance Staff',
  'Water Storage',
  'Water Disposal',
  'ATM',
  'Shopping Center',
  'Wheelchair Accessibility',
  'Cafeteria/Foodcourt',
  'DG Availability',
  'CCTV Surveillance',
  'Grocery shop',
  'Visitor Parking',
  'Power Backup',
  'Lift(s)'
];
// PLOT Amenities
export const STORAGE_AMENITIES = [
  'Water Storage',
  'Centrally Air Conditioned',
  'Visitor Parking ',
  
  'Vaastu Compliant',
  
  'Security Fire Alarm',
  
];
// Vaasthu Directions for Office
export const OFFICE_VAASTHU_FIELDS = [
  { name: 'officeFacing', label: 'Office Facing' },
  { name: 'mainEntranceDirection', label: 'Main Entrance Direction' },
  { name: 'ownerCabinDirection', label: 'Owner/MD/Manager Cabin Direction' },
  { name: 'workstationsDirection', label: 'Workstations/Employee Seating Direction' },
  { name: 'meetingRoomDirection', label: 'Conference/Meeting Room Direction' },
  { name: 'receptionDirection', label: 'Reception Area Direction' },
  { name: 'accountsDirection', label: 'Accounts/Finance Department Direction' },
  { name: 'pantryDirection', label: 'Pantry/Cafeteria Direction' },
  { name: 'serverRoomDirection', label: 'Server/IT/Electrical Room Direction' },
  { name: 'washroomDirection', label: 'Washrooms/Toilets Direction' },
  { name: 'staircaseDirection', label: 'Staircase/Lift Direction' },
  { name: 'storageDirection', label: 'Storage/Records Room Direction' },
  { name: 'cashLockerDirection', label: 'Cash Locker/Safe Direction' }
];

export const RETAIL_AMENITIES = [
  'Lift',
  'Fire Safety',
  'AC',
  'Parking',
  'Security',
  'Power Backup',
  'CCTV',
  'WiFi',
  'Canteen/Food Court'
];
export const INDUSTRY_TYPES = [
  'Manufacturing',
  'Factory',
];

export const INDUSTRY_AMENITIES = [
  'Water Storage',
  'Service/Goods Lift',
  'Visitor Parking',
  'Vaastu Compliant',
  'Security/Fire Alarm',
  'ATM',
  'Maintenance Staff',
  'Water Disposal',
  'Rain Water Harvesting',
  'Security Guard'
];

export const INDUSTRY_TYPES_APPROVED = [
  'Manufacturing',
  'Warehouse',
  'Processing Plant',
  'Assembly Unit',
  'Packaging Unit',
  'Cold Storage',
  'Logistics Hub',
  'Other'
];

export const ROOM_TYPES = [
  
  '1',
  '2',
  '3',
  '4+'
];
export const HOSPITALITY_TYPES = [
  'Hotel/Resorts',
  'Guest House/Banquet Halls',
  
];

export const HOSPITALITY_AMENITIES = [
  'Water Storage',
  'Conference Room',
  'Intercom Facility',
  'Cafeteria/Food Court',
  'Central Air Conditioned',
  'Lift(s)',
  'Maintenance Staff',
  'Water Disposal',
  'Rain Water Harvesting',
  'Access to High Speed Internet'
];

export const FLOORING_TYPES = [
  'Marble',
  'Vitrified',
  'Wooden',
  'Ceramic',
  'Granite',
  'Mosaic',
  'Concrete',
  'Other'
];


