// vastuFields.js

export const normalVaasthuFields = [
  { label: "Plot Facing", name: "plotFacing" },
  { label: "Main Door/Step Direction", name: "mainDoorDirection" },
  { label: "Master Bedroom", name: "masterBedroom" },
  { label: "Children Bedroom", name: "childrenBedroom" },
  { label: "Living Room", name: "livingRoom" },
  { label: "Kitchen Room", name: "kitchenRoom" },
  { label: "Pooja Room", name: "poojaRoom" },
  { label: "Balcony", name: "balconyDirection" },
];

export const resortVaasthuFields = [
  { label: "Property Facing", name: "propertyFacing" },
  { label: "Entrance Direction", name: "entranceDirection" },
  { label: "Reception Area Facing", name: "receptionAreaFacing" },
  { label: "Main Lobby Direction", name: "mainLobbyDirection" },
  { label: "Master Suite Room Direction", name: "masterSuitroom" },
  { label: "Guest Room Direction", name: "guestRoom" },
  { label: "Restaurant Direction", name: "restaurantDirection" },
  { label: "VIP Suite Direction", name: "vipSuite" },
  { label: "Conference/Banquet Hall Direction", name: "conferenceDirection" },
  { label: "Spa/Wellness Center Direction", name: "spaRoom" },
  { label: "Swimming Pool Direction", name: "swimmingPool" },
  { label: "Yoga/Meditation Area Direction", name: "yoga" },
  { label: "Kitchen Direction", name: "kitchenRoom" },
  { label: "Prayer Room Direction", name: "poojaRoom" },
  { label: "Office/Admin Room Direction", name: "office" },
  { label: "Recreation Area Direction", name: "recreation" },
  { label: "Balcony/Deck/Veranda", name: "balcony" },
  { label: "Garden/Open Space/Lawn", name: "garden" },
];


export const sitePlotVaasthuFields = [
  { label: "Plot Facing", name: "plotFacing" },
  { label: "Main Entry/Gate Direction", name: "mainEntryDirection" },
  { label: "Plot Slope Direction", name: "plotSlopeDirection" },
  { label: "Open Space as per Vastu", name: "openSpaceVastu" },
  { label: "Shape", name: "shape" },
  { label: "Road Position", name: "roadPosition" },
  { label: "Water Source Location", name: "waterSourceLocation" },
  { label: "Drainage Direction", name: "drainageDirection" },
  { label: "Compound Wall Height", name: "compoundWallHeight" },
  { label: "Existing Structures", name: "existingStructures" },
];

export const officeVaasthuFields = [
  { label: "Office Facing", name: "officeFacing" },
  { label: "Main Entrance Direction", name: "mainEntranceDirection" },
  { label: "Reception Area Direction", name: "receptionDirection" },
  { label: "Manager/Owner Cabin Direction", name: "managerCabinDirection" },
  { label: "Conference Room Direction", name: "conferenceRoomDirection" },
  { label: "Employee Seating Area Direction", name: "employeeSeatingDirection" },
  { label: "Pantry/Kitchen Direction", name: "pantryDirection" },
  { label: "Server Room Direction", name: "serverRoomDirection" },
  { label: "Storage/File Room Direction", name: "storageDirection" },
  { label: "Washroom Direction", name: "washroomDirection" },
];

export const retailVaasthuFields = [
  { label: "Shop Facing(Mandatory)", name: "mainFacing" },
  { label: "Main Entrance Direction", name: "mainEntranceDirection" },
  { label: "Cash Counter/Billing Area Direction", name: "cashCounterDirection" },
  { label: "Cash Locker/Safe Keeping Direction", name: "cashLockerDirection" },
  { label: "Owner/Manager Seating Direction", name: "ownerSeatingDirection" },
  { label: "Staff Seating Direction", name: "staffSeatingDirection" },
  { label: "Storage/Stock Room Direction", name: "storageDirection" },
  { label: "Electrical/Inverter/Generator Direction", name: "electricityDirection" }, 
  { label: "Pantry/Wash Area Direction(if any)", name: "pantryDirection" },
  { label: "Staircase/Lift Direction(If inside shop)", name: "Staircase/Lift Direction(If inside shop)" },
];
 export const industrialVaasthuFields = [
  { label: "Industry Facing", name: "industryFacing" },
  { label: "Main Entrance Direction", name: "mainEntranceDirection" },
  { label: "Heavy Machinery Placement Direction", name: "machineryDirection" },
  { label: "Production/Manufacturing Area Direction", name: "productionAreaDirection" },
  { label: "Raw Material Storage/Warehouse Direction", name: "storageDirection" },
  { label: "Finished Goods Storage Direction", name: "finishedGoodsDirection" },
  { label: "Office/Admin Area Direction", name: "officeAreaDirection" },
  { label: "Washroom Direction", name: "washroomDirection" },
  { label: "Electrical/Generator/Boiler Area Direction", name: "electricityDirection" },
  { label: "Water Source/Tank Direction", name: "waterSourceDirection" },
  { label: "Waste/Scrap Area Direction", name: "wasteAreaDirection" },
 
 
  { label: "Staircase/Lift Direction(If inside shop)", name: "staircaseDirection" },
];

export const storageVaasthuFields = [
  { label: "Storage Building Facing", name: "storageBuildingFacing" },
  { label: "Main Entrance/Shutter Direction", name: "mainEntranceDirection" },
  { label: "Storage Area Direction(Heavy Goods)", name: "storageAreaDirection" },
  { label: "Light Goods/Empty Space Direction", name: "lightGoodsDirection" },
  { label: "Loading/Unloading Area Direction", name: "loadingUnloadingDirection" },
  { label: "Office/Admin Area Direction(If any)", name: "officeAreaDirection" },
  { label: "Electrical/Generator/Equipment Direction", name: "electricalDirection" },
  { label: "Water Source Direction(If any)", name: "waterSourceDirection" },
  { label: "Washroom/Toilet Direction(If any)", name: "washroomDirection" },
  { label: "Height & Level", name: "heightLevel" },
];
export const hospitalityVaasthuFields = [
  { key: 'buildingFacing', label: 'Building/Property Facing' },
  { key: 'entrance', label: 'Main Entrance Direction' },
  { key: 'reception', label: 'Lobby/Reception Direction' },
  { key: 'adminOffice', label: 'Owner/Manager/Admin Office Direction' },
  { key: 'guestRooms', label: 'Guest Rooms/Stay Area Direction' },
  { key: 'banquet', label: 'Banquet/Function Hall Direction' },
  { key: 'kitchen', label: 'Kitchen/Cooking Area Direction' },
  { key: 'dining', label: 'Dining Area Direction' },
  { key: 'cashCounter', label: 'Cash Counter/Billing Desk Direction' },
  { key: 'electrical', label: 'Electrical/Generator/Equipment Area Direction' },
  { key: 'waterStructure', label: 'Water Source/Swimming Pool Direction (If Any)' },
  { key: 'washroom', label: 'Washrooms/Toilets Direction' },
  { key: 'storage', label: 'Storage/Housekeeping Area Direction' }
];