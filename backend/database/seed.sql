USE touristguide;

-- ============================================================
-- TOURIST GUIDE - INDIA MASTER DATA
-- 28 STATES + 8 UNION TERRITORIES
-- ============================================================

-- ============================================================
-- STATES AND UNION TERRITORIES
-- ============================================================

INSERT IGNORE INTO states
(name, code, type, capital, description)
VALUES

('Andhra Pradesh', 'AP', 'STATE', 'Amaravati',
 'A state known for temples, beaches, valleys, forests and historic destinations.'),

('Arunachal Pradesh', 'AR', 'STATE', 'Itanagar',
 'A Himalayan state known for mountains, monasteries, valleys and scenic landscapes.'),

('Assam', 'AS', 'STATE', 'Dispur',
 'Known for Kaziranga, tea gardens, wildlife and the Brahmaputra River.'),

('Bihar', 'BR', 'STATE', 'Patna',
 'Known for Buddhist heritage, ancient universities and historical sites.'),

('Chhattisgarh', 'CG', 'STATE', 'Raipur',
 'Known for waterfalls, forests, tribal culture and ancient temples.'),

('Goa', 'GA', 'STATE', 'Panaji',
 'Popular for beaches, Portuguese heritage, nightlife and coastal tourism.'),

('Gujarat', 'GJ', 'STATE', 'Gandhinagar',
 'Known for heritage cities, temples, wildlife, deserts and coastal attractions.'),

('Haryana', 'HR', 'STATE', 'Chandigarh',
 'Known for historical sites, religious destinations and proximity to Delhi.'),

('Himachal Pradesh', 'HP', 'STATE', 'Shimla',
 'A Himalayan destination known for hill stations, valleys, snow and adventure tourism.'),

('Jharkhand', 'JH', 'STATE', 'Ranchi',
 'Known for waterfalls, forests, temples and natural landscapes.'),

('Karnataka', 'KA', 'STATE', 'Bengaluru',
 'Known for heritage monuments, beaches, hill stations, wildlife and technology hubs.'),

('Kerala', 'KL', 'STATE', 'Thiruvananthapuram',
 'Known for backwaters, beaches, hill stations, Ayurveda and wildlife.'),

('Madhya Pradesh', 'MP', 'STATE', 'Bhopal',
 'Known for forts, temples, wildlife reserves and UNESCO heritage sites.'),

('Maharashtra', 'MH', 'STATE', 'Mumbai',
 'Known for Mumbai, hill stations, caves, forts, beaches and cultural heritage.'),

('Manipur', 'MN', 'STATE', 'Imphal',
 'Known for Loktak Lake, cultural heritage and scenic landscapes.'),

('Meghalaya', 'ML', 'STATE', 'Shillong',
 'Known for waterfalls, caves, living root bridges and green hills.'),

('Mizoram', 'MZ', 'STATE', 'Aizawl',
 'Known for mountain landscapes, forests and vibrant local culture.'),

('Nagaland', 'NL', 'STATE', 'Kohima',
 'Known for tribal culture, mountains and the Hornbill Festival.'),

('Odisha', 'OD', 'STATE', 'Bhubaneswar',
 'Known for temples, beaches, Buddhist heritage and tribal culture.'),

('Punjab', 'PB', 'STATE', 'Chandigarh',
 'Known for Sikh heritage, the Golden Temple and historic cities.'),

('Rajasthan', 'RJ', 'STATE', 'Jaipur',
 'Known for forts, palaces, deserts, lakes and royal heritage.'),

('Sikkim', 'SK', 'STATE', 'Gangtok',
 'A Himalayan state known for monasteries, mountains, lakes and trekking.'),

('Tamil Nadu', 'TN', 'STATE', 'Chennai',
 'Known for ancient temples, beaches, heritage towns and hill stations.'),

('Telangana', 'TG', 'STATE', 'Hyderabad',
 'Known for historic monuments, forts, lakes, cuisine and modern Hyderabad.'),

('Tripura', 'TR', 'STATE', 'Agartala',
 'Known for palaces, temples, archaeological sites and natural attractions.'),

('Uttar Pradesh', 'UP', 'STATE', 'Lucknow',
 'Known for the Taj Mahal, religious destinations, heritage cities and historical monuments.'),

('Uttarakhand', 'UK', 'STATE', 'Dehradun',
 'Known for Himalayan scenery, pilgrimage destinations, rivers and wildlife.'),

('West Bengal', 'WB', 'STATE', 'Kolkata',
 'Known for Kolkata, Darjeeling, Sundarbans, cultural heritage and Himalayan landscapes.'),

-- UNION TERRITORIES

('Andaman and Nicobar Islands', 'AN', 'UNION TERRITORY', 'Port Blair',
 'Known for tropical beaches, coral reefs, islands and marine activities.'),

('Chandigarh', 'CH', 'UNION TERRITORY', 'Chandigarh',
 'A planned city known for modern architecture, gardens and urban tourism.'),

('Dadra and Nagar Haveli and Daman and Diu', 'DNDD', 'UNION TERRITORY', 'Daman',
 'Known for beaches, forts, Portuguese heritage and nature destinations.'),

('Delhi', 'DL', 'UNION TERRITORY', 'New Delhi',
 'India’s capital region, known for monuments, museums, markets and historical sites.'),

('Jammu and Kashmir', 'JK', 'UNION TERRITORY', 'Srinagar',
 'Known for Himalayan landscapes, lakes, valleys, gardens and adventure tourism.'),

('Ladakh', 'LA', 'UNION TERRITORY', 'Leh',
 'Known for high-altitude mountains, monasteries, lakes and dramatic landscapes.'),

('Lakshadweep', 'LD', 'UNION TERRITORY', 'Kavaratti',
 'Known for coral islands, lagoons, beaches and marine tourism.'),

('Puducherry', 'PY', 'UNION TERRITORY', 'Puducherry',
 'Known for French colonial architecture, beaches, cafes and spiritual tourism.');


-- ============================================================
-- TOURIST DESTINATIONS
-- ============================================================

-- =========================
-- ANDHRA PRADESH
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Tirupati', 'Tirupati', 'Religious',
'Famous pilgrimage destination and gateway to Tirumala Temple.',
13.6288, 79.4192, 'September to February'
FROM states WHERE code = 'AP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Visakhapatnam', 'Visakhapatnam', 'Beach',
'Coastal city known for beaches, hills and scenic viewpoints.',
17.6868, 83.2185, 'October to March'
FROM states WHERE code = 'AP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Araku Valley', 'Visakhapatnam', 'Hill Station',
'A scenic valley surrounded by Eastern Ghats and coffee plantations.',
18.3273, 82.8775, 'October to February'
FROM states WHERE code = 'AP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Amaravati', 'Amaravati', 'Heritage',
'Historic and cultural destination on the banks of the Krishna River.',
16.5745, 80.3575, 'October to March'
FROM states WHERE code = 'AP';


-- =========================
-- ARUNACHAL PRADESH
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Tawang', 'Tawang', 'Mountain',
'A high-altitude Himalayan destination known for monasteries and mountain scenery.',
27.5860, 91.8590, 'March to October'
FROM states WHERE code = 'AR';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Bomdila', 'Bomdila', 'Mountain',
'A scenic Himalayan town with monasteries and mountain views.',
27.2647, 92.4247, 'March to October'
FROM states WHERE code = 'AR';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Ziro Valley', 'Ziro', 'Nature',
'A beautiful valley famous for landscapes, forests and local culture.',
27.5440, 93.8190, 'March to October'
FROM states WHERE code = 'AR';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Itanagar', 'Itanagar', 'Heritage',
'Capital city with historical sites, museums and natural attractions.',
27.0844, 93.6053, 'October to April'
FROM states WHERE code = 'AR';


-- =========================
-- ASSAM
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Kaziranga National Park', 'Golaghat', 'Wildlife',
'World-famous wildlife destination known especially for the Indian one-horned rhinoceros.',
26.5775, 93.1711, 'November to April'
FROM states WHERE code = 'AS';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Guwahati', 'Guwahati', 'City',
'Major gateway to Northeast India with temples and river views.',
26.1445, 91.7362, 'October to April'
FROM states WHERE code = 'AS';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Majuli', 'Majuli', 'Culture',
'Large river island known for Assamese culture, monasteries and traditions.',
27.0016, 94.2243, 'October to March'
FROM states WHERE code = 'AS';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Manas National Park', 'Barpeta', 'Wildlife',
'A UNESCO-listed natural destination known for forests and wildlife.',
26.6594, 91.0011, 'November to April'
FROM states WHERE code = 'AS';


-- =========================
-- BIHAR
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Bodh Gaya', 'Gaya', 'Religious',
'Major Buddhist pilgrimage destination associated with the enlightenment of Buddha.',
24.6961, 84.9914, 'October to March'
FROM states WHERE code = 'BR';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Nalanda', 'Nalanda', 'Heritage',
'Ancient learning centre and important archaeological destination.',
25.1367, 85.4431, 'October to March'
FROM states WHERE code = 'BR';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Rajgir', 'Rajgir', 'Heritage',
'Historic city surrounded by hills and associated with Buddhist and Jain traditions.',
25.0280, 85.4208, 'October to March'
FROM states WHERE code = 'BR';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Patna', 'Patna', 'City',
'Capital city with museums, historical sites and riverfront attractions.',
25.5941, 85.1376, 'October to March'
FROM states WHERE code = 'BR';


-- =========================
-- CHHATTISGARH
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Chitrakote Falls', 'Bastar', 'Waterfall',
'A spectacular waterfall on the Indravati River.',
19.2030, 81.7010, 'July to February'
FROM states WHERE code = 'CG';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Tirathgarh Falls', 'Bastar', 'Waterfall',
'A scenic multi-level waterfall surrounded by forest.',
18.9420, 81.8730, 'July to February'
FROM states WHERE code = 'CG';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Barnawapara Wildlife Sanctuary', 'Baloda Bazar', 'Wildlife',
'A forest destination known for wildlife and biodiversity.',
21.1740, 82.4860, 'November to June'
FROM states WHERE code = 'CG';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Raipur', 'Raipur', 'City',
'Capital city and gateway to several destinations in central Chhattisgarh.',
21.2514, 81.6296, 'October to March'
FROM states WHERE code = 'CG';


-- =========================
-- GOA
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Baga Beach', 'North Goa', 'Beach',
'Popular beach known for water activities, restaurants and nightlife.',
15.5557, 73.7517, 'November to February'
FROM states WHERE code = 'GA';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Calangute Beach', 'North Goa', 'Beach',
'One of Goa’s most popular beaches with shops and water activities.',
15.5449, 73.7553, 'November to February'
FROM states WHERE code = 'GA';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Basilica of Bom Jesus', 'Old Goa', 'Heritage',
'Historic church and UNESCO World Heritage destination.',
15.5009, 73.9118, 'November to February'
FROM states WHERE code = 'GA';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Dudhsagar Falls', 'South Goa', 'Waterfall',
'Large waterfall located in the Western Ghats.',
15.3144, 74.3144, 'July to January'
FROM states WHERE code = 'GA';


-- =========================
-- GUJARAT
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Statue of Unity', 'Kevadia', 'Monument',
'One of India’s major modern monuments located near the Narmada River.',
21.8380, 73.7191, 'October to March'
FROM states WHERE code = 'GJ';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Rann of Kutch', 'Kutch', 'Nature',
'A vast salt desert famous for its white landscape and cultural festival.',
23.7337, 69.8597, 'November to February'
FROM states WHERE code = 'GJ';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Somnath Temple', 'Somnath', 'Religious',
'Historic temple located on the Arabian Sea coast.',
20.8880, 70.4010, 'October to March'
FROM states WHERE code = 'GJ';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Ahmedabad', 'Ahmedabad', 'Heritage',
'Major city known for architecture, heritage and food culture.',
23.0225, 72.5714, 'October to February'
FROM states WHERE code = 'GJ';


-- =========================
-- HARYANA
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Kurukshetra', 'Kurukshetra', 'Heritage',
'Historic and religious destination associated with the Mahabharata tradition.',
29.9695, 76.8783, 'October to March'
FROM states WHERE code = 'HR';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Sultanpur National Park', 'Gurugram', 'Wildlife',
'Important birdwatching destination near Delhi NCR.',
28.4595, 76.8920, 'October to March'
FROM states WHERE code = 'HR';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Pinjore Gardens', 'Panchkula', 'Garden',
'Historic Mughal-style garden destination.',
30.7967, 76.9182, 'October to March'
FROM states WHERE code = 'HR';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Faridabad', 'Faridabad', 'City',
'Urban destination with historical and recreational attractions.',
28.4089, 77.3178, 'October to March'
FROM states WHERE code = 'HR';


-- =========================
-- HIMACHAL PRADESH
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Shimla', 'Shimla', 'Hill Station',
'Popular Himalayan hill station known for colonial architecture and mountain views.',
31.1048, 77.1734, 'March to June'
FROM states WHERE code = 'HP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Manali', 'Manali', 'Hill Station',
'Popular mountain destination for snow, adventure and scenic landscapes.',
32.2432, 77.1892, 'March to June'
FROM states WHERE code = 'HP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Dharamshala', 'Dharamshala', 'Mountain',
'Mountain destination known for Tibetan culture and Himalayan scenery.',
32.2190, 76.3234, 'March to June'
FROM states WHERE code = 'HP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Spiti Valley', 'Lahaul and Spiti', 'Adventure',
'High-altitude cold desert valley known for monasteries and dramatic landscapes.',
32.2468, 78.0349, 'June to October'
FROM states WHERE code = 'HP';


-- =========================
-- JHARKHAND
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Hundru Falls', 'Ranchi', 'Waterfall',
'A scenic waterfall near Ranchi.',
23.4500, 85.6000, 'July to February'
FROM states WHERE code = 'JH';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Betla National Park', 'Latehar', 'Wildlife',
'Wildlife destination known for forests and diverse fauna.',
23.8830, 84.1900, 'November to April'
FROM states WHERE code = 'JH';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Deoghar', 'Deoghar', 'Religious',
'Important pilgrimage destination known for the Baidyanath Temple.',
24.4854, 86.6947, 'October to March'
FROM states WHERE code = 'JH';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Ranchi', 'Ranchi', 'City',
'Capital city known for waterfalls, parks and nearby nature attractions.',
23.3441, 85.3096, 'October to February'
FROM states WHERE code = 'JH';


-- =========================
-- KARNATAKA
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Hampi', 'Vijayanagara', 'Heritage',
'UNESCO World Heritage site known for the ruins of the Vijayanagara Empire.',
15.3350, 76.4600, 'October to February'
FROM states WHERE code = 'KA';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Mysuru Palace', 'Mysuru', 'Heritage',
'Historic royal palace and major attraction of Mysuru.',
12.3052, 76.6552, 'October to February'
FROM states WHERE code = 'KA';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Coorg', 'Kodagu', 'Hill Station',
'Green hill destination known for coffee plantations and waterfalls.',
12.3375, 75.8069, 'October to March'
FROM states WHERE code = 'KA';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Gokarna', 'Uttara Kannada', 'Beach',
'Coastal destination known for beaches and temples.',
14.5439, 74.3188, 'October to March'
FROM states WHERE code = 'KA';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Bengaluru', 'Bengaluru', 'City',
'Major technology city known for parks, food and urban attractions.',
12.9716, 77.5946, 'October to February'
FROM states WHERE code = 'KA';


-- =========================
-- KERALA
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Munnar', 'Idukki', 'Hill Station',
'Mountain destination known for tea plantations and misty landscapes.',
10.0889, 77.0595, 'September to March'
FROM states WHERE code = 'KL';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Alappuzha Backwaters', 'Alappuzha', 'Backwaters',
'Famous backwater destination known for houseboats and waterways.',
9.4981, 76.3388, 'October to February'
FROM states WHERE code = 'KL';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Kovalam', 'Thiruvananthapuram', 'Beach',
'Popular coastal destination with beaches and resorts.',
8.4004, 76.9787, 'October to February'
FROM states WHERE code = 'KL';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Thekkady', 'Idukki', 'Wildlife',
'Known for Periyar wildlife tourism, forests and boating.',
9.6031, 77.1610, 'October to February'
FROM states WHERE code = 'KL';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Kochi', 'Ernakulam', 'Heritage',
'Historic coastal city known for Fort Kochi, culture and cuisine.',
9.9312, 76.2673, 'October to February'
FROM states WHERE code = 'KL';


-- =========================
-- MADHYA PRADESH
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Khajuraho', 'Chhatarpur', 'Heritage',
'UNESCO World Heritage site famous for historic temple architecture.',
24.8318, 79.9199, 'October to March'
FROM states WHERE code = 'MP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Sanchi Stupa', 'Sanchi', 'Heritage',
'Ancient Buddhist monument and UNESCO World Heritage site.',
23.4793, 77.7397, 'October to March'
FROM states WHERE code = 'MP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Kanha National Park', 'Mandla', 'Wildlife',
'Major tiger reserve and wildlife destination.',
22.3345, 80.6115, 'October to June'
FROM states WHERE code = 'MP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Bhopal', 'Bhopal', 'City',
'Capital city known for lakes, museums and nearby heritage sites.',
23.2599, 77.4126, 'October to March'
FROM states WHERE code = 'MP';


-- =========================
-- MAHARASHTRA
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Mumbai', 'Mumbai', 'City',
'Major metropolitan city known for Gateway of India, Marine Drive and culture.',
19.0760, 72.8777, 'October to February'
FROM states WHERE code = 'MH';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Lonavala', 'Pune', 'Hill Station',
'Popular hill station known for valleys, viewpoints and waterfalls.',
18.7546, 73.4062, 'June to February'
FROM states WHERE code = 'MH';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Ajanta Caves', 'Aurangabad', 'Heritage',
'UNESCO-listed rock-cut cave complex with ancient paintings and sculptures.',
20.5519, 75.7033, 'October to March'
FROM states WHERE code = 'MH';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Mahabaleshwar', 'Satara', 'Hill Station',
'Popular hill destination known for viewpoints and strawberry farms.',
17.9307, 73.6477, 'October to June'
FROM states WHERE code = 'MH';


-- =========================
-- MANIPUR
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Loktak Lake', 'Moirang', 'Lake',
'Famous freshwater lake known for floating phumdis.',
24.5500, 93.7500, 'October to March'
FROM states WHERE code = 'MN';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Imphal', 'Imphal', 'City',
'Capital city with museums, markets and cultural attractions.',
24.8170, 93.9368, 'October to March'
FROM states WHERE code = 'MN';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Kangla Fort', 'Imphal', 'Heritage',
'Historic fort complex and important cultural site.',
24.8060, 93.9400, 'October to March'
FROM states WHERE code = 'MN';


-- =========================
-- MEGHALAYA
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Shillong', 'Shillong', 'Hill Station',
'Hill city known for waterfalls, viewpoints and pleasant weather.',
25.5788, 91.8933, 'October to April'
FROM states WHERE code = 'ML';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Cherrapunji', 'Sohra', 'Nature',
'Famous for heavy rainfall, waterfalls, caves and living root bridges.',
25.2700, 91.7300, 'October to April'
FROM states WHERE code = 'ML';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Dawki', 'West Jaintia Hills', 'Nature',
'Known for the clear waters of the Umngot River and scenic surroundings.',
25.1840, 92.0240, 'October to April'
FROM states WHERE code = 'ML';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Mawlynnong', 'East Khasi Hills', 'Village',
'Scenic village known for greenery and living root bridge attractions.',
25.2050, 91.8780, 'October to April'
FROM states WHERE code = 'ML';


-- =========================
-- MIZORAM
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Aizawl', 'Aizawl', 'City',
'Hilly capital city known for views and local culture.',
23.7271, 92.7176, 'October to March'
FROM states WHERE code = 'MZ';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Vantawng Falls', 'Serchhip', 'Waterfall',
'One of Mizoram’s prominent waterfalls surrounded by forested hills.',
23.2550, 92.9200, 'October to March'
FROM states WHERE code = 'MZ';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Reiek', 'Aizawl', 'Mountain',
'Mountain destination offering panoramic views.',
23.6830, 92.6150, 'October to March'
FROM states WHERE code = 'MZ';


-- =========================
-- NAGALAND
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Kohima', 'Kohima', 'City',
'Hilly capital city known for heritage and cultural attractions.',
25.6751, 94.1086, 'October to May'
FROM states WHERE code = 'NL';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Dzukou Valley', 'Kohima', 'Trekking',
'Scenic valley known for seasonal flowers and trekking trails.',
25.5900, 94.0700, 'October to April'
FROM states WHERE code = 'NL';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Kisama Heritage Village', 'Kohima', 'Culture',
'Cultural village associated with the Hornbill Festival.',
25.6520, 94.0900, 'December'
FROM states WHERE code = 'NL';


-- =========================
-- ODISHA
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Jagannath Temple', 'Puri', 'Religious',
'Major pilgrimage destination and important temple complex.',
19.8049, 85.8179, 'October to February'
FROM states WHERE code = 'OD';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Konark Sun Temple', 'Konark', 'Heritage',
'UNESCO World Heritage temple famous for its stone architecture.',
19.8876, 86.0945, 'October to February'
FROM states WHERE code = 'OD';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Chilika Lake', 'Odisha', 'Lake',
'Large coastal lagoon known for birds, boating and marine life.',
19.7000, 85.3000, 'November to February'
FROM states WHERE code = 'OD';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Bhubaneswar', 'Bhubaneswar', 'Heritage',
'Temple city known for ancient architecture and museums.',
20.2961, 85.8245, 'October to March'
FROM states WHERE code = 'OD';


-- =========================
-- PUNJAB
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Golden Temple', 'Amritsar', 'Religious',
'Important Sikh pilgrimage site and architectural landmark.',
31.6200, 74.8765, 'October to March'
FROM states WHERE code = 'PB';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Jallianwala Bagh', 'Amritsar', 'History',
'Historic memorial site in Amritsar.',
31.6200, 74.8800, 'October to March'
FROM states WHERE code = 'PB';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Wagah Border', 'Amritsar', 'Culture',
'Border ceremony destination near Amritsar.',
31.6048, 74.5730, 'October to March'
FROM states WHERE code = 'PB';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Patiala', 'Patiala', 'Heritage',
'Historic city known for palaces, forts and Punjabi culture.',
30.3398, 76.3869, 'October to March'
FROM states WHERE code = 'PB';


-- =========================
-- RAJASTHAN
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Jaipur', 'Jaipur', 'Heritage',
'The Pink City known for forts, palaces and historic architecture.',
26.9124, 75.7873, 'October to March'
FROM states WHERE code = 'RJ';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Udaipur', 'Udaipur', 'Heritage',
'City of lakes known for palaces and scenic landscapes.',
24.5854, 73.7125, 'October to March'
FROM states WHERE code = 'RJ';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Jaisalmer', 'Jaisalmer', 'Desert',
'Golden city known for its fort and Thar Desert experiences.',
26.9157, 70.9083, 'October to February'
FROM states WHERE code = 'RJ';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Jodhpur', 'Jodhpur', 'Heritage',
'Blue City known for Mehrangarh Fort and historic architecture.',
26.2389, 73.0243, 'October to March'
FROM states WHERE code = 'RJ';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Pushkar', 'Pushkar', 'Religious',
'Historic town known for its lake, temples and annual fair.',
26.4897, 74.5511, 'October to March'
FROM states WHERE code = 'RJ';


-- =========================
-- SIKKIM
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Gangtok', 'Gangtok', 'Mountain',
'Capital city with Himalayan views, monasteries and viewpoints.',
27.3389, 88.6065, 'March to May'
FROM states WHERE code = 'SK';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Tsomgo Lake', 'East Sikkim', 'Lake',
'High-altitude glacial lake surrounded by mountains.',
27.3740, 88.7620, 'April to June'
FROM states WHERE code = 'SK';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Nathula Pass', 'East Sikkim', 'Mountain',
'High-altitude mountain pass near the international border.',
27.3860, 88.8300, 'April to June'
FROM states WHERE code = 'SK';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Pelling', 'West Sikkim', 'Mountain',
'Scenic destination with views of the Himalayas.',
27.3050, 88.2370, 'March to May'
FROM states WHERE code = 'SK';


-- =========================
-- TAMIL NADU
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Chennai', 'Chennai', 'City',
'Major coastal city known for temples, beaches and culture.',
13.0827, 80.2707, 'October to February'
FROM states WHERE code = 'TN';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Ooty', 'Nilgiris', 'Hill Station',
'Popular hill station known for tea gardens and cool weather.',
11.4064, 76.6932, 'October to June'
FROM states WHERE code = 'TN';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Madurai', 'Madurai', 'Heritage',
'Historic city famous for Meenakshi Amman Temple.',
9.9252, 78.1198, 'October to March'
FROM states WHERE code = 'TN';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Rameswaram', 'Ramanathapuram', 'Religious',
'Important pilgrimage destination and island town.',
9.2876, 79.3129, 'October to April'
FROM states WHERE code = 'TN';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Mahabalipuram', 'Chengalpattu', 'Heritage',
'Coastal heritage destination famous for ancient monuments.',
12.6208, 80.1945, 'October to March'
FROM states WHERE code = 'TN';


-- =========================
-- TELANGANA
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Charminar', 'Hyderabad', 'Heritage',
'Iconic monument and historic landmark in the heart of Hyderabad.',
17.3616, 78.4747, 'October to February'
FROM states WHERE code = 'TG';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Golconda Fort', 'Hyderabad', 'Heritage',
'Historic fort complex known for architecture and panoramic views.',
17.3833, 78.4011, 'October to February'
FROM states WHERE code = 'TG';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Ramoji Film City', 'Hyderabad', 'Entertainment',
'Large film studio complex and popular tourist attraction.',
17.2543, 78.6808, 'October to February'
FROM states WHERE code = 'TG';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Hussain Sagar Lake', 'Hyderabad', 'Lake',
'Historic lake known for the Buddha statue and waterfront attractions.',
17.4239, 78.4738, 'October to February'
FROM states WHERE code = 'TG';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Warangal Fort', 'Warangal', 'Heritage',
'Historic fort complex associated with the Kakatiya dynasty.',
17.9689, 79.5941, 'October to February'
FROM states WHERE code = 'TG';


-- =========================
-- TRIPURA
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Ujjayanta Palace', 'Agartala', 'Heritage',
'Historic palace and museum in Agartala.',
23.8315, 91.2868, 'October to March'
FROM states WHERE code = 'TR';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Neermahal', 'Melaghar', 'Heritage',
'Beautiful palace located in the middle of Rudrasagar Lake.',
23.4950, 91.3500, 'October to March'
FROM states WHERE code = 'TR';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Unakoti', 'Unakoti', 'Heritage',
'Ancient rock-cut sculptures and archaeological site.',
24.3200, 92.0500, 'October to March'
FROM states WHERE code = 'TR';


-- =========================
-- UTTAR PRADESH
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Taj Mahal', 'Agra', 'Heritage',
'World-famous marble monument and UNESCO World Heritage site.',
27.1751, 78.0421, 'October to March'
FROM states WHERE code = 'UP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Varanasi', 'Varanasi', 'Religious',
'Historic city on the Ganges known for ghats and spiritual traditions.',
25.3176, 82.9739, 'October to March'
FROM states WHERE code = 'UP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Lucknow', 'Lucknow', 'Heritage',
'Capital city known for Nawabi architecture and cuisine.',
26.8467, 80.9462, 'October to March'
FROM states WHERE code = 'UP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Ayodhya', 'Ayodhya', 'Religious',
'Historic religious destination associated with the Ramayana tradition.',
26.7997, 82.2043, 'October to March'
FROM states WHERE code = 'UP';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Mathura', 'Mathura', 'Religious',
'Important pilgrimage destination associated with Krishna traditions.',
27.4924, 77.6737, 'October to March'
FROM states WHERE code = 'UP';


-- =========================
-- UTTARAKHAND
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Rishikesh', 'Rishikesh', 'Adventure',
'Known for yoga, rafting, temples and Himalayan gateway experiences.',
30.0869, 78.2676, 'September to November'
FROM states WHERE code = 'UK';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Haridwar', 'Haridwar', 'Religious',
'Major pilgrimage city on the Ganges.',
29.9457, 78.1642, 'October to March'
FROM states WHERE code = 'UK';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Nainital', 'Nainital', 'Hill Station',
'Popular lake town surrounded by Himalayan hills.',
29.3919, 79.4542, 'March to June'
FROM states WHERE code = 'UK';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Mussoorie', 'Dehradun', 'Hill Station',
'Popular hill station known for mountain views and colonial-era attractions.',
30.4598, 78.0664, 'March to June'
FROM states WHERE code = 'UK';


-- =========================
-- WEST BENGAL
-- =========================

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Kolkata', 'Kolkata', 'City',
'Major cultural city known for heritage buildings, museums and cuisine.',
22.5726, 88.3639, 'October to March'
FROM states WHERE code = 'WB';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Darjeeling', 'Darjeeling', 'Hill Station',
'Famous Himalayan hill station known for tea gardens and mountain views.',
27.0410, 88.2663, 'March to May'
FROM states WHERE code = 'WB';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Sundarbans', 'South 24 Parganas', 'Wildlife',
'Mangrove ecosystem famous for wildlife and river channels.',
21.9497, 88.9826, 'November to February'
FROM states WHERE code = 'WB';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Digha', 'Purba Medinipur', 'Beach',
'Popular coastal destination in West Bengal.',
21.6280, 87.5070, 'October to March'
FROM states WHERE code = 'WB';


-- ============================================================
-- UNION TERRITORIES
-- ============================================================

-- ANDAMAN AND NICOBAR

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Havelock Island', 'Swaraj Dweep', 'Beach',
'Tropical island known for beaches, diving and marine activities.',
11.9760, 92.9876, 'October to May'
FROM states WHERE code = 'AN';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Radhanagar Beach', 'Swaraj Dweep', 'Beach',
'Popular tropical beach known for scenic surroundings.',
11.9850, 92.9510, 'October to May'
FROM states WHERE code = 'AN';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Cellular Jail', 'Port Blair', 'History',
'Historic colonial-era prison and national memorial.',
11.6736, 92.7461, 'October to May'
FROM states WHERE code = 'AN';


-- CHANDIGARH

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Rock Garden', 'Chandigarh', 'Garden',
'Unique sculpture garden created from industrial and household waste.',
30.7525, 76.8055, 'October to March'
FROM states WHERE code = 'CH';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Sukhna Lake', 'Chandigarh', 'Lake',
'Popular urban lake and recreation destination.',
30.7425, 76.8173, 'October to March'
FROM states WHERE code = 'CH';


-- DADRA AND NAGAR HAVELI AND DAMAN AND DIU

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Diu Fort', 'Diu', 'Heritage',
'Historic fort overlooking the Arabian Sea.',
20.7141, 70.9875, 'October to March'
FROM states WHERE code = 'DNDD';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Jampore Beach', 'Daman', 'Beach',
'Popular sandy beach in Daman.',
20.3850, 72.8410, 'October to March'
FROM states WHERE code = 'DNDD';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Silvassa', 'Silvassa', 'Nature',
'Capital town known for gardens, museums and natural surroundings.',
20.2736, 72.9967, 'October to March'
FROM states WHERE code = 'DNDD';


-- DELHI

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'India Gate', 'New Delhi', 'Monument',
'Major war memorial and landmark in central Delhi.',
28.6129, 77.2295, 'October to March'
FROM states WHERE code = 'DL';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Red Fort', 'Delhi', 'Heritage',
'Historic Mughal fort and UNESCO World Heritage site.',
28.6562, 77.2410, 'October to March'
FROM states WHERE code = 'DL';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Qutub Minar', 'Delhi', 'Heritage',
'Historic tower complex and UNESCO World Heritage site.',
28.5244, 77.1855, 'October to March'
FROM states WHERE code = 'DL';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Lotus Temple', 'Delhi', 'Architecture',
'Distinctive lotus-shaped modern temple open to visitors of all faiths.',
28.5535, 77.2588, 'October to March'
FROM states WHERE code = 'DL';


-- JAMMU AND KASHMIR

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Srinagar', 'Srinagar', 'Lake',
'Famous for Dal Lake, houseboats, gardens and Himalayan scenery.',
34.0837, 74.7973, 'April to October'
FROM states WHERE code = 'JK';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Gulmarg', 'Baramulla', 'Mountain',
'Mountain destination known for skiing and scenic landscapes.',
34.0484, 74.3805, 'December to April'
FROM states WHERE code = 'JK';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Pahalgam', 'Anantnag', 'Mountain',
'Scenic valley destination surrounded by mountains and rivers.',
34.0161, 75.3150, 'April to October'
FROM states WHERE code = 'JK';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Sonamarg', 'Ganderbal', 'Mountain',
'High-altitude valley known for glaciers and mountain scenery.',
34.3032, 75.2931, 'April to October'
FROM states WHERE code = 'JK';


-- LADAKH

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Leh', 'Leh', 'Mountain',
'Main town of Ladakh and base for exploring the high-altitude region.',
34.1526, 77.5771, 'May to September'
FROM states WHERE code = 'LA';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Pangong Lake', 'Ladakh', 'Lake',
'High-altitude lake famous for its changing blue shades and mountain backdrop.',
33.7595, 78.6670, 'May to September'
FROM states WHERE code = 'LA';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Nubra Valley', 'Ladakh', 'Mountain',
'High-altitude valley known for sand dunes, monasteries and dramatic scenery.',
35.6100, 77.6000, 'May to September'
FROM states WHERE code = 'LA';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Khardung La', 'Ladakh', 'Adventure',
'High mountain pass traditionally associated with routes north of Leh.',
34.2820, 77.6040, 'May to September'
FROM states WHERE code = 'LA';


-- LAKSHADWEEP

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Kavaratti', 'Kavaratti', 'Beach',
'Capital island known for lagoons and water activities.',
10.5669, 72.6420, 'October to May'
FROM states WHERE code = 'LD';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Agatti Island', 'Agatti', 'Beach',
'Tropical island known for coral reefs and lagoons.',
10.8560, 72.1950, 'October to May'
FROM states WHERE code = 'LD';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Bangaram Island', 'Bangaram', 'Beach',
'Remote tropical island surrounded by clear lagoons.',
10.9450, 72.2870, 'October to May'
FROM states WHERE code = 'LD';


-- PUDUCHERRY

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Puducherry French Quarter', 'Puducherry', 'Heritage',
'Historic district known for French colonial architecture and cafes.',
11.9341, 79.8302, 'October to March'
FROM states WHERE code = 'PY';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Promenade Beach', 'Puducherry', 'Beach',
'Popular waterfront promenade along the Bay of Bengal.',
11.9310, 79.8330, 'October to March'
FROM states WHERE code = 'PY';

INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
SELECT id, 'Auroville', 'Viluppuram', 'Culture',
'International township known for its community and experimental architecture.',
12.0069, 79.8100, 'October to March'
FROM states WHERE code = 'PY';


-- ============================================================
-- END OF INDIA TOURISM DATA
-- ============================================================


-- ============================================================
-- VERIFICATION
-- ============================================================

SELECT COUNT(*) AS total_regions
FROM states;

SELECT COUNT(*) AS total_destinations
FROM destinations;

SELECT
    s.name AS state_or_ut,
    COUNT(d.id) AS destination_count
FROM states s
LEFT JOIN destinations d
    ON s.id = d.state_id
GROUP BY s.id, s.name
ORDER BY s.name;