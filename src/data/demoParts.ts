/**
 * 100 Realistic Heavy Machinery Spare Parts for Demo/Testing
 * All prices in PKR (Pakistani Rupees)
 */

interface DemoPartData {
  name: string;
  sku: string;
  category: string;
  brand: string;
  buyingPrice: number;
  sellingPrice: number;
  quantity: number;
  minStockLevel: number;
  location: string;
  notes: string;
}

export const DEMO_CATEGORIES = [
  'Engine Parts', 'Hydraulic Parts', 'Electrical Components', 'Filters',
  'Bearings', 'Belts', 'Cooling System', 'Fuel System', 'Transmission', 'Brakes',
];

export const DEMO_BRANDS = [
  'CAT', 'Komatsu', 'Hitachi', 'Volvo', 'John Deere',
  'Cummins', 'FP Diesel', 'ITR', 'Highgasket', 'Bosch',
  'Denso', 'Parker', 'SKF', 'Gates', 'Donaldson',
];

export const DEMO_PARTS: DemoPartData[] = [
  // Engine Parts (15)
  { name: 'Oil Filter CAT 320D', sku: 'ENG-OIL-001', category: 'Engine Parts', brand: 'CAT', buyingPrice: 1500, sellingPrice: 2500, quantity: 50, minStockLevel: 10, location: 'Shelf A1', notes: 'Fits CAT 320D/320E excavator' },
  { name: 'Piston Ring Set 6D102', sku: 'ENG-PIS-002', category: 'Engine Parts', brand: 'Komatsu', buyingPrice: 8500, sellingPrice: 14000, quantity: 20, minStockLevel: 5, location: 'Shelf A2', notes: 'For Komatsu PC200-6 engine' },
  { name: 'Cylinder Head Gasket C9', sku: 'ENG-GAS-003', category: 'Engine Parts', brand: 'Highgasket', buyingPrice: 12000, sellingPrice: 19500, quantity: 8, minStockLevel: 3, location: 'Shelf A3', notes: 'CAT C9 engine gasket set' },
  { name: 'Crankshaft Bearing Set 6BT', sku: 'ENG-BRG-004', category: 'Engine Parts', brand: 'Cummins', buyingPrice: 6500, sellingPrice: 11000, quantity: 15, minStockLevel: 5, location: 'Shelf A4', notes: 'Main bearing set for 6BT 5.9L' },
  { name: 'Connecting Rod 4D95', sku: 'ENG-CON-005', category: 'Engine Parts', brand: 'Komatsu', buyingPrice: 9800, sellingPrice: 16000, quantity: 12, minStockLevel: 4, location: 'Shelf A5', notes: 'OEM spec connecting rod' },
  { name: 'Camshaft Assembly S6D125', sku: 'ENG-CAM-006', category: 'Engine Parts', brand: 'Komatsu', buyingPrice: 35000, sellingPrice: 55000, quantity: 4, minStockLevel: 2, location: 'Shelf A6', notes: 'Complete camshaft for D65 dozer' },
  { name: 'Intake Valve Set 3306', sku: 'ENG-VAL-007', category: 'Engine Parts', brand: 'CAT', buyingPrice: 4200, sellingPrice: 7000, quantity: 25, minStockLevel: 8, location: 'Shelf A7', notes: 'Set of 6 intake valves' },
  { name: 'Exhaust Valve Set 3306', sku: 'ENG-EXV-008', category: 'Engine Parts', brand: 'CAT', buyingPrice: 4800, sellingPrice: 7800, quantity: 22, minStockLevel: 8, location: 'Shelf A7', notes: 'Set of 6 exhaust valves' },
  { name: 'Water Pump 6CT8.3', sku: 'ENG-WPM-009', category: 'Engine Parts', brand: 'Cummins', buyingPrice: 7500, sellingPrice: 12500, quantity: 10, minStockLevel: 3, location: 'Shelf A8', notes: 'OEM water pump assembly' },
  { name: 'Oil Pump 4TNV98', sku: 'ENG-OPM-010', category: 'Engine Parts', brand: 'Hitachi', buyingPrice: 14000, sellingPrice: 22000, quantity: 6, minStockLevel: 2, location: 'Shelf A9', notes: 'For ZX200 excavator' },
  { name: 'Turbocharger TD06 49179', sku: 'ENG-TUR-011', category: 'Engine Parts', brand: 'CAT', buyingPrice: 45000, sellingPrice: 72000, quantity: 5, minStockLevel: 2, location: 'Shelf A10', notes: 'CAT 320C turbo assembly' },
  { name: 'Flywheel Housing 3116', sku: 'ENG-FLY-012', category: 'Engine Parts', brand: 'CAT', buyingPrice: 18000, sellingPrice: 28000, quantity: 3, minStockLevel: 1, location: 'Shelf A11', notes: 'SAE #1 flywheel housing' },
  { name: 'Engine Mount Rubber D6R', sku: 'ENG-MNT-013', category: 'Engine Parts', brand: 'CAT', buyingPrice: 3500, sellingPrice: 5800, quantity: 16, minStockLevel: 4, location: 'Shelf A12', notes: 'Anti-vibration mount' },
  { name: 'Liner Kit 6D105', sku: 'ENG-LNR-014', category: 'Engine Parts', brand: 'Komatsu', buyingPrice: 28000, sellingPrice: 45000, quantity: 6, minStockLevel: 2, location: 'Shelf A13', notes: 'Complete liner kit with pistons' },
  { name: 'Rocker Arm Assembly NT855', sku: 'ENG-ROC-015', category: 'Engine Parts', brand: 'Cummins', buyingPrice: 5500, sellingPrice: 9000, quantity: 14, minStockLevel: 4, location: 'Shelf A14', notes: 'Complete rocker assembly' },

  // Hydraulic Parts (15)
  { name: 'Hydraulic Pump Komatsu PC200', sku: 'HYD-PMP-001', category: 'Hydraulic Parts', brand: 'Komatsu', buyingPrice: 75000, sellingPrice: 120000, quantity: 4, minStockLevel: 2, location: 'Shelf B1', notes: 'Main hydraulic pump assembly' },
  { name: 'Hydraulic Cylinder Seal Kit 320D', sku: 'HYD-SEL-002', category: 'Hydraulic Parts', brand: 'CAT', buyingPrice: 3200, sellingPrice: 5500, quantity: 30, minStockLevel: 10, location: 'Shelf B2', notes: 'Boom cylinder seal kit' },
  { name: 'Control Valve Assembly PC200-8', sku: 'HYD-CVA-003', category: 'Hydraulic Parts', brand: 'Komatsu', buyingPrice: 65000, sellingPrice: 105000, quantity: 3, minStockLevel: 1, location: 'Shelf B3', notes: 'Main control valve' },
  { name: 'Hydraulic Hose 1 inch 3000PSI', sku: 'HYD-HSE-004', category: 'Hydraulic Parts', brand: 'Parker', buyingPrice: 2800, sellingPrice: 4500, quantity: 40, minStockLevel: 15, location: 'Shelf B4', notes: '1 meter length, R2AT' },
  { name: 'Swing Motor ZX200', sku: 'HYD-SWM-005', category: 'Hydraulic Parts', brand: 'Hitachi', buyingPrice: 55000, sellingPrice: 88000, quantity: 3, minStockLevel: 1, location: 'Shelf B5', notes: 'Swing drive motor' },
  { name: 'Hydraulic Filter Element', sku: 'HYD-FIL-006', category: 'Hydraulic Parts', brand: 'Donaldson', buyingPrice: 1800, sellingPrice: 3000, quantity: 45, minStockLevel: 15, location: 'Shelf B6', notes: 'Return line filter' },
  { name: 'Pilot Valve Joystick PC200', sku: 'HYD-PIL-007', category: 'Hydraulic Parts', brand: 'Komatsu', buyingPrice: 18000, sellingPrice: 29000, quantity: 6, minStockLevel: 2, location: 'Shelf B7', notes: 'Left hand pilot valve' },
  { name: 'Hydraulic Gear Pump D65', sku: 'HYD-GPM-008', category: 'Hydraulic Parts', brand: 'Komatsu', buyingPrice: 32000, sellingPrice: 52000, quantity: 4, minStockLevel: 2, location: 'Shelf B8', notes: 'Steering pump assembly' },
  { name: 'Boom Cylinder Rod 320C', sku: 'HYD-ROD-009', category: 'Hydraulic Parts', brand: 'CAT', buyingPrice: 22000, sellingPrice: 35000, quantity: 5, minStockLevel: 2, location: 'Shelf B9', notes: 'Chrome plated rod' },
  { name: 'Hydraulic Quick Coupler 1/2"', sku: 'HYD-QCK-010', category: 'Hydraulic Parts', brand: 'Parker', buyingPrice: 1200, sellingPrice: 2000, quantity: 60, minStockLevel: 20, location: 'Shelf B10', notes: 'Flat face coupler' },
  { name: 'Track Adjuster Cylinder PC200', sku: 'HYD-TRK-011', category: 'Hydraulic Parts', brand: 'Komatsu', buyingPrice: 15000, sellingPrice: 24000, quantity: 8, minStockLevel: 3, location: 'Shelf B11', notes: 'Recoil spring assembly' },
  { name: 'Hydraulic Breaker Seal Kit', sku: 'HYD-BRK-012', category: 'Hydraulic Parts', brand: 'CAT', buyingPrice: 5500, sellingPrice: 9000, quantity: 12, minStockLevel: 4, location: 'Shelf B12', notes: 'For H120 breaker' },
  { name: 'Suction Strainer 320D', sku: 'HYD-STR-013', category: 'Hydraulic Parts', brand: 'CAT', buyingPrice: 2200, sellingPrice: 3800, quantity: 18, minStockLevel: 6, location: 'Shelf B13', notes: 'Hydraulic tank strainer' },
  { name: 'Relief Valve Cartridge', sku: 'HYD-RLF-014', category: 'Hydraulic Parts', brand: 'Parker', buyingPrice: 4800, sellingPrice: 7800, quantity: 10, minStockLevel: 3, location: 'Shelf B14', notes: '350 bar rated' },
  { name: 'Swivel Joint Assembly EX200', sku: 'HYD-SWJ-015', category: 'Hydraulic Parts', brand: 'Hitachi', buyingPrice: 28000, sellingPrice: 45000, quantity: 3, minStockLevel: 1, location: 'Shelf B15', notes: 'Center swivel joint' },

  // Electrical Components (10)
  { name: 'Alternator 24V Heavy Duty', sku: 'ELC-ALT-001', category: 'Electrical Components', brand: 'Bosch', buyingPrice: 12000, sellingPrice: 19500, quantity: 8, minStockLevel: 3, location: 'Shelf C1', notes: '24V 70A alternator' },
  { name: 'Starter Motor 24V 320D', sku: 'ELC-STR-002', category: 'Electrical Components', brand: 'Denso', buyingPrice: 18000, sellingPrice: 28000, quantity: 6, minStockLevel: 2, location: 'Shelf C2', notes: 'OEM replacement starter' },
  { name: 'Glow Plug Set 6D102', sku: 'ELC-GLW-003', category: 'Electrical Components', brand: 'Denso', buyingPrice: 3800, sellingPrice: 6200, quantity: 20, minStockLevel: 6, location: 'Shelf C3', notes: 'Set of 6 glow plugs' },
  { name: 'ECU Controller PC200-8', sku: 'ELC-ECU-004', category: 'Electrical Components', brand: 'Komatsu', buyingPrice: 85000, sellingPrice: 135000, quantity: 2, minStockLevel: 1, location: 'Shelf C4', notes: 'Engine control unit' },
  { name: 'Wiring Harness 320D Main', sku: 'ELC-WRH-005', category: 'Electrical Components', brand: 'CAT', buyingPrice: 25000, sellingPrice: 40000, quantity: 4, minStockLevel: 1, location: 'Shelf C5', notes: 'Main chassis harness' },
  { name: 'Pressure Sensor 344-7391', sku: 'ELC-PRS-006', category: 'Electrical Components', brand: 'CAT', buyingPrice: 8500, sellingPrice: 14000, quantity: 10, minStockLevel: 3, location: 'Shelf C6', notes: 'Hydraulic pressure sensor' },
  { name: 'Temperature Sender Unit', sku: 'ELC-TMP-007', category: 'Electrical Components', brand: 'Bosch', buyingPrice: 2200, sellingPrice: 3800, quantity: 25, minStockLevel: 8, location: 'Shelf C7', notes: 'Coolant temp sensor' },
  { name: 'Fuel Injector Solenoid', sku: 'ELC-SOL-008', category: 'Electrical Components', brand: 'Denso', buyingPrice: 6500, sellingPrice: 10500, quantity: 15, minStockLevel: 5, location: 'Shelf C8', notes: 'Common rail solenoid valve' },
  { name: 'Battery Relay 24V', sku: 'ELC-RLY-009', category: 'Electrical Components', brand: 'Bosch', buyingPrice: 3500, sellingPrice: 5800, quantity: 12, minStockLevel: 4, location: 'Shelf C9', notes: 'Heavy duty disconnect relay' },
  { name: 'Monitor Display Panel ZX200', sku: 'ELC-DSP-010', category: 'Electrical Components', brand: 'Hitachi', buyingPrice: 35000, sellingPrice: 55000, quantity: 3, minStockLevel: 1, location: 'Shelf C10', notes: 'LCD instrument cluster' },

  // Filters (10)
  { name: 'Air Filter Outer CAT 320D', sku: 'FIL-AIR-001', category: 'Filters', brand: 'Donaldson', buyingPrice: 2500, sellingPrice: 4200, quantity: 35, minStockLevel: 10, location: 'Shelf D1', notes: 'Primary air filter element' },
  { name: 'Air Filter Inner CAT 320D', sku: 'FIL-AIN-002', category: 'Filters', brand: 'Donaldson', buyingPrice: 1800, sellingPrice: 3000, quantity: 35, minStockLevel: 10, location: 'Shelf D1', notes: 'Safety air filter element' },
  { name: 'Fuel Filter Water Separator', sku: 'FIL-FWS-003', category: 'Filters', brand: 'Donaldson', buyingPrice: 2200, sellingPrice: 3600, quantity: 40, minStockLevel: 12, location: 'Shelf D2', notes: '10 micron fuel water separator' },
  { name: 'Fuel Filter Primary PC200', sku: 'FIL-FPR-004', category: 'Filters', brand: 'Komatsu', buyingPrice: 1200, sellingPrice: 2000, quantity: 50, minStockLevel: 15, location: 'Shelf D3', notes: 'Spin-on fuel filter' },
  { name: 'Hydraulic Return Filter 320D', sku: 'FIL-HRF-005', category: 'Filters', brand: 'CAT', buyingPrice: 3500, sellingPrice: 5800, quantity: 25, minStockLevel: 8, location: 'Shelf D4', notes: 'Return line filter element' },
  { name: 'Transmission Oil Filter D65', sku: 'FIL-TRN-006', category: 'Filters', brand: 'Komatsu', buyingPrice: 2800, sellingPrice: 4500, quantity: 18, minStockLevel: 6, location: 'Shelf D5', notes: 'Torque converter filter' },
  { name: 'Pilot Filter Element PC200', sku: 'FIL-PLT-007', category: 'Filters', brand: 'Komatsu', buyingPrice: 1500, sellingPrice: 2500, quantity: 30, minStockLevel: 10, location: 'Shelf D6', notes: 'Pilot line filter' },
  { name: 'AC Cabin Filter 320D', sku: 'FIL-CAB-008', category: 'Filters', brand: 'CAT', buyingPrice: 1800, sellingPrice: 3200, quantity: 20, minStockLevel: 6, location: 'Shelf D7', notes: 'Cab air conditioner filter' },
  { name: 'Bypass Oil Filter 3306', sku: 'FIL-BYP-009', category: 'Filters', brand: 'CAT', buyingPrice: 1600, sellingPrice: 2800, quantity: 28, minStockLevel: 8, location: 'Shelf D8', notes: 'Full flow bypass filter' },
  { name: 'Strainer Fuel Tank PC200', sku: 'FIL-STF-010', category: 'Filters', brand: 'Komatsu', buyingPrice: 900, sellingPrice: 1500, quantity: 22, minStockLevel: 8, location: 'Shelf D9', notes: 'In-tank fuel strainer' },

  // Bearings (10)
  { name: 'Slewing Ring Bearing 320D', sku: 'BRG-SLW-001', category: 'Bearings', brand: 'SKF', buyingPrice: 95000, sellingPrice: 150000, quantity: 2, minStockLevel: 1, location: 'Shelf E1', notes: 'Swing bearing assembly' },
  { name: 'Track Roller Bearing PC200', sku: 'BRG-TRK-002', category: 'Bearings', brand: 'ITR', buyingPrice: 8500, sellingPrice: 14000, quantity: 20, minStockLevel: 6, location: 'Shelf E2', notes: 'Bottom track roller' },
  { name: 'Carrier Roller Bearing ZX200', sku: 'BRG-CRR-003', category: 'Bearings', brand: 'ITR', buyingPrice: 6500, sellingPrice: 10500, quantity: 16, minStockLevel: 4, location: 'Shelf E3', notes: 'Top carrier roller' },
  { name: 'Idler Wheel Bearing D65', sku: 'BRG-IDL-004', category: 'Bearings', brand: 'ITR', buyingPrice: 12000, sellingPrice: 19500, quantity: 8, minStockLevel: 2, location: 'Shelf E4', notes: 'Front idler assembly' },
  { name: 'Thrust Bearing Set 6D102', sku: 'BRG-THR-005', category: 'Bearings', brand: 'SKF', buyingPrice: 4500, sellingPrice: 7500, quantity: 14, minStockLevel: 4, location: 'Shelf E5', notes: 'Engine thrust washer set' },
  { name: 'Pilot Bearing Flywheel 3306', sku: 'BRG-PLT-006', category: 'Bearings', brand: 'SKF', buyingPrice: 1800, sellingPrice: 3000, quantity: 18, minStockLevel: 6, location: 'Shelf E6', notes: 'Flywheel pilot bearing' },
  { name: 'Swing Pinion Bearing 320C', sku: 'BRG-SPN-007', category: 'Bearings', brand: 'SKF', buyingPrice: 7500, sellingPrice: 12000, quantity: 8, minStockLevel: 3, location: 'Shelf E7', notes: 'Tapered roller bearing' },
  { name: 'Bucket Pin Bushing 45mm', sku: 'BRG-BPN-008', category: 'Bearings', brand: 'ITR', buyingPrice: 2200, sellingPrice: 3800, quantity: 40, minStockLevel: 12, location: 'Shelf E8', notes: 'Hardened steel bushing' },
  { name: 'King Pin Bearing Set EC210', sku: 'BRG-KPN-009', category: 'Bearings', brand: 'Volvo', buyingPrice: 5500, sellingPrice: 9000, quantity: 10, minStockLevel: 3, location: 'Shelf E9', notes: 'Steering knuckle bearing' },
  { name: 'Final Drive Bearing Kit PC200', sku: 'BRG-FNL-010', category: 'Bearings', brand: 'Komatsu', buyingPrice: 18000, sellingPrice: 29000, quantity: 4, minStockLevel: 2, location: 'Shelf E10', notes: 'Complete travel motor bearing set' },

  // Belts (10)
  { name: 'Fan Belt V-Ribbed 320D', sku: 'BLT-FAN-001', category: 'Belts', brand: 'Gates', buyingPrice: 1800, sellingPrice: 3000, quantity: 25, minStockLevel: 8, location: 'Shelf F1', notes: '6PK1420 serpentine belt' },
  { name: 'Alternator Belt 6BT', sku: 'BLT-ALT-002', category: 'Belts', brand: 'Gates', buyingPrice: 1200, sellingPrice: 2000, quantity: 30, minStockLevel: 10, location: 'Shelf F2', notes: 'V-belt for Cummins 6BT' },
  { name: 'AC Compressor Belt 320C', sku: 'BLT-ACC-003', category: 'Belts', brand: 'Gates', buyingPrice: 1500, sellingPrice: 2500, quantity: 20, minStockLevel: 6, location: 'Shelf F3', notes: 'Air conditioning belt' },
  { name: 'Timing Belt Kit 4D95', sku: 'BLT-TMG-004', category: 'Belts', brand: 'Gates', buyingPrice: 4500, sellingPrice: 7500, quantity: 10, minStockLevel: 3, location: 'Shelf F4', notes: 'Timing belt with tensioner' },
  { name: 'Water Pump Belt 3306', sku: 'BLT-WPM-005', category: 'Belts', brand: 'CAT', buyingPrice: 1100, sellingPrice: 1800, quantity: 28, minStockLevel: 8, location: 'Shelf F5', notes: 'Cogged V-belt' },
  { name: 'Power Steering Belt D65', sku: 'BLT-PWR-006', category: 'Belts', brand: 'Komatsu', buyingPrice: 1400, sellingPrice: 2300, quantity: 15, minStockLevel: 5, location: 'Shelf F6', notes: 'Steering pump drive belt' },
  { name: 'Track Chain Link PC200', sku: 'BLT-TCH-007', category: 'Belts', brand: 'ITR', buyingPrice: 85000, sellingPrice: 135000, quantity: 4, minStockLevel: 2, location: 'Shelf F7', notes: 'Complete track chain 49 links' },
  { name: 'Fan Drive Belt EC210', sku: 'BLT-FDB-008', category: 'Belts', brand: 'Volvo', buyingPrice: 2200, sellingPrice: 3600, quantity: 12, minStockLevel: 4, location: 'Shelf F8', notes: 'Multi-ribbed fan belt' },
  { name: 'Generator Belt NT855', sku: 'BLT-GEN-009', category: 'Belts', brand: 'Cummins', buyingPrice: 1300, sellingPrice: 2200, quantity: 18, minStockLevel: 6, location: 'Shelf F9', notes: 'Heavy duty generator belt' },
  { name: 'Tensioner Pulley Assembly 320D', sku: 'BLT-TNS-010', category: 'Belts', brand: 'CAT', buyingPrice: 5500, sellingPrice: 9000, quantity: 8, minStockLevel: 3, location: 'Shelf F10', notes: 'Automatic tensioner with pulley' },

  // Cooling System (10)
  { name: 'Radiator Assembly PC200-8', sku: 'COL-RAD-001', category: 'Cooling System', brand: 'Komatsu', buyingPrice: 45000, sellingPrice: 72000, quantity: 3, minStockLevel: 1, location: 'Shelf G1', notes: 'Complete aluminum radiator' },
  { name: 'Radiator Hose Upper 320D', sku: 'COL-HSU-002', category: 'Cooling System', brand: 'CAT', buyingPrice: 2500, sellingPrice: 4200, quantity: 15, minStockLevel: 5, location: 'Shelf G2', notes: 'Upper coolant hose' },
  { name: 'Radiator Hose Lower 320D', sku: 'COL-HSL-003', category: 'Cooling System', brand: 'CAT', buyingPrice: 2200, sellingPrice: 3800, quantity: 15, minStockLevel: 5, location: 'Shelf G3', notes: 'Lower coolant hose' },
  { name: 'Thermostat 82°C 6D102', sku: 'COL-THR-004', category: 'Cooling System', brand: 'Komatsu', buyingPrice: 1800, sellingPrice: 3000, quantity: 20, minStockLevel: 6, location: 'Shelf G4', notes: '82 degree thermostat' },
  { name: 'Coolant Pump Impeller 3306', sku: 'COL-IMP-005', category: 'Cooling System', brand: 'FP Diesel', buyingPrice: 3500, sellingPrice: 5800, quantity: 12, minStockLevel: 4, location: 'Shelf G5', notes: 'Water pump impeller' },
  { name: 'Oil Cooler Core 320D', sku: 'COL-OCC-006', category: 'Cooling System', brand: 'CAT', buyingPrice: 18000, sellingPrice: 28000, quantity: 4, minStockLevel: 1, location: 'Shelf G6', notes: 'Engine oil cooler' },
  { name: 'Radiator Cap 0.9 Bar', sku: 'COL-RCP-007', category: 'Cooling System', brand: 'Denso', buyingPrice: 600, sellingPrice: 1000, quantity: 35, minStockLevel: 10, location: 'Shelf G7', notes: 'Pressure cap 13 PSI' },
  { name: 'Intercooler Assembly PC200', sku: 'COL-ITC-008', category: 'Cooling System', brand: 'Komatsu', buyingPrice: 25000, sellingPrice: 40000, quantity: 3, minStockLevel: 1, location: 'Shelf G8', notes: 'Charge air cooler' },
  { name: 'Fan Clutch Assembly 320D', sku: 'COL-FNC-009', category: 'Cooling System', brand: 'CAT', buyingPrice: 15000, sellingPrice: 24000, quantity: 4, minStockLevel: 2, location: 'Shelf G9', notes: 'Viscous fan coupling' },
  { name: 'Expansion Tank 320D', sku: 'COL-EXP-010', category: 'Cooling System', brand: 'CAT', buyingPrice: 3200, sellingPrice: 5200, quantity: 8, minStockLevel: 3, location: 'Shelf G10', notes: 'Coolant reservoir tank' },

  // Fuel System (10)
  { name: 'Fuel Injection Pump 6BT', sku: 'FUL-INJ-001', category: 'Fuel System', brand: 'Bosch', buyingPrice: 65000, sellingPrice: 105000, quantity: 3, minStockLevel: 1, location: 'Shelf H1', notes: 'Bosch VP44 injection pump' },
  { name: 'Fuel Injector Nozzle 320D', sku: 'FUL-NZL-002', category: 'Fuel System', brand: 'Denso', buyingPrice: 8500, sellingPrice: 14000, quantity: 18, minStockLevel: 6, location: 'Shelf H2', notes: 'Common rail injector' },
  { name: 'Fuel Transfer Pump 6CT', sku: 'FUL-TRP-003', category: 'Fuel System', brand: 'Cummins', buyingPrice: 5500, sellingPrice: 9000, quantity: 8, minStockLevel: 3, location: 'Shelf H3', notes: 'Mechanical lift pump' },
  { name: 'Fuel Tank Cap Locking', sku: 'FUL-CAP-004', category: 'Fuel System', brand: 'CAT', buyingPrice: 1200, sellingPrice: 2000, quantity: 20, minStockLevel: 6, location: 'Shelf H4', notes: 'Locking fuel cap with keys' },
  { name: 'Fuel Line Assembly PC200', sku: 'FUL-LNE-005', category: 'Fuel System', brand: 'Komatsu', buyingPrice: 3800, sellingPrice: 6200, quantity: 10, minStockLevel: 3, location: 'Shelf H5', notes: 'High pressure fuel line set' },
  { name: 'Priming Pump Manual', sku: 'FUL-PRM-006', category: 'Fuel System', brand: 'Bosch', buyingPrice: 1500, sellingPrice: 2500, quantity: 22, minStockLevel: 8, location: 'Shelf H6', notes: 'Hand priming pump' },
  { name: 'Fuel Rail Assembly 320D', sku: 'FUL-RAL-007', category: 'Fuel System', brand: 'Denso', buyingPrice: 22000, sellingPrice: 35000, quantity: 3, minStockLevel: 1, location: 'Shelf H7', notes: 'Common rail assembly' },
  { name: 'Fuel Pressure Regulator', sku: 'FUL-REG-008', category: 'Fuel System', brand: 'Bosch', buyingPrice: 7500, sellingPrice: 12000, quantity: 8, minStockLevel: 3, location: 'Shelf H8', notes: 'Pressure limiting valve' },
  { name: 'Throttle Position Sensor', sku: 'FUL-TPS-009', category: 'Fuel System', brand: 'Bosch', buyingPrice: 4500, sellingPrice: 7500, quantity: 12, minStockLevel: 4, location: 'Shelf H9', notes: 'Accelerator pedal sensor' },
  { name: 'Fuel Water Separator Bowl', sku: 'FUL-WSB-010', category: 'Fuel System', brand: 'Donaldson', buyingPrice: 2800, sellingPrice: 4500, quantity: 15, minStockLevel: 5, location: 'Shelf H10', notes: 'Transparent collection bowl' },

  // Transmission (10)
  { name: 'Torque Converter D65', sku: 'TRN-TQC-001', category: 'Transmission', brand: 'Komatsu', buyingPrice: 120000, sellingPrice: 190000, quantity: 2, minStockLevel: 1, location: 'Shelf I1', notes: 'Complete torque converter' },
  { name: 'Transmission Oil Seal Kit', sku: 'TRN-SEL-002', category: 'Transmission', brand: 'CAT', buyingPrice: 4500, sellingPrice: 7500, quantity: 10, minStockLevel: 3, location: 'Shelf I2', notes: 'Power shift seal kit' },
  { name: 'Clutch Disc Set D65', sku: 'TRN-CLC-003', category: 'Transmission', brand: 'Komatsu', buyingPrice: 15000, sellingPrice: 24000, quantity: 6, minStockLevel: 2, location: 'Shelf I3', notes: 'Steering clutch plates' },
  { name: 'Planetary Gear Set Final Drive', sku: 'TRN-PLN-004', category: 'Transmission', brand: 'CAT', buyingPrice: 35000, sellingPrice: 55000, quantity: 3, minStockLevel: 1, location: 'Shelf I4', notes: 'Sun and planet gear set' },
  { name: 'Travel Motor Assembly PC200', sku: 'TRN-TRV-005', category: 'Transmission', brand: 'Komatsu', buyingPrice: 85000, sellingPrice: 135000, quantity: 2, minStockLevel: 1, location: 'Shelf I5', notes: 'Final drive travel motor' },
  { name: 'Drive Sprocket PC200', sku: 'TRN-SPR-006', category: 'Transmission', brand: 'ITR', buyingPrice: 12000, sellingPrice: 19500, quantity: 8, minStockLevel: 3, location: 'Shelf I6', notes: 'Drive sprocket with hub' },
  { name: 'Propeller Shaft D65', sku: 'TRN-PRP-007', category: 'Transmission', brand: 'Komatsu', buyingPrice: 18000, sellingPrice: 28000, quantity: 4, minStockLevel: 1, location: 'Shelf I7', notes: 'Drive shaft assembly' },
  { name: 'Universal Joint Cross', sku: 'TRN-UNI-008', category: 'Transmission', brand: 'SKF', buyingPrice: 3500, sellingPrice: 5800, quantity: 15, minStockLevel: 5, location: 'Shelf I8', notes: 'Heavy duty U-joint' },
  { name: 'Parking Brake Band D65', sku: 'TRN-PRK-009', category: 'Transmission', brand: 'Komatsu', buyingPrice: 8500, sellingPrice: 14000, quantity: 6, minStockLevel: 2, location: 'Shelf I9', notes: 'Parking brake assembly' },
  { name: 'Transmission Control Valve', sku: 'TRN-CVL-010', category: 'Transmission', brand: 'CAT', buyingPrice: 28000, sellingPrice: 45000, quantity: 3, minStockLevel: 1, location: 'Shelf I10', notes: 'Power shift control valve' },

  // Brakes (10)
  { name: 'Brake Pad Industrial Grade', sku: 'BRK-PAD-001', category: 'Brakes', brand: 'CAT', buyingPrice: 5500, sellingPrice: 9000, quantity: 20, minStockLevel: 6, location: 'Shelf J1', notes: 'Heavy duty brake pads set' },
  { name: 'Brake Disc Rotor D65', sku: 'BRK-DSC-002', category: 'Brakes', brand: 'Komatsu', buyingPrice: 15000, sellingPrice: 24000, quantity: 6, minStockLevel: 2, location: 'Shelf J2', notes: 'Ventilated brake disc' },
  { name: 'Master Cylinder Brake', sku: 'BRK-MST-003', category: 'Brakes', brand: 'Bosch', buyingPrice: 8500, sellingPrice: 14000, quantity: 5, minStockLevel: 2, location: 'Shelf J3', notes: 'Tandem master cylinder' },
  { name: 'Brake Shoe Set Rear WA320', sku: 'BRK-SHO-004', category: 'Brakes', brand: 'Komatsu', buyingPrice: 6500, sellingPrice: 10500, quantity: 12, minStockLevel: 4, location: 'Shelf J4', notes: 'Rear axle brake shoes' },
  { name: 'Brake Caliper Assembly', sku: 'BRK-CAL-005', category: 'Brakes', brand: 'CAT', buyingPrice: 22000, sellingPrice: 35000, quantity: 4, minStockLevel: 1, location: 'Shelf J5', notes: 'Front brake caliper' },
  { name: 'Brake Fluid DOT 4 1L', sku: 'BRK-FLD-006', category: 'Brakes', brand: 'Bosch', buyingPrice: 800, sellingPrice: 1400, quantity: 30, minStockLevel: 10, location: 'Shelf J6', notes: 'High performance brake fluid' },
  { name: 'Brake Hose Flexible 500mm', sku: 'BRK-HSE-007', category: 'Brakes', brand: 'Parker', buyingPrice: 1500, sellingPrice: 2500, quantity: 18, minStockLevel: 6, location: 'Shelf J7', notes: 'Braided flex hose' },
  { name: 'Parking Brake Cable EC210', sku: 'BRK-CBL-008', category: 'Brakes', brand: 'Volvo', buyingPrice: 3800, sellingPrice: 6200, quantity: 8, minStockLevel: 3, location: 'Shelf J8', notes: 'Parking brake wire cable' },
  { name: 'Brake Spring Kit D65', sku: 'BRK-SPR-009', category: 'Brakes', brand: 'Komatsu', buyingPrice: 2200, sellingPrice: 3800, quantity: 14, minStockLevel: 5, location: 'Shelf J9', notes: 'Return spring set' },
  { name: 'Wheel Cylinder Repair Kit', sku: 'BRK-WCR-010', category: 'Brakes', brand: 'Bosch', buyingPrice: 1200, sellingPrice: 2000, quantity: 20, minStockLevel: 6, location: 'Shelf J10', notes: 'Seals and pistons kit' },
];
