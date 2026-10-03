CREATE DATABASE IF NOT EXISTS tourist_guide;

USE tourist_guide;

DROP TABLE IF EXISTS itinerary_items;
DROP TABLE IF EXISTS itineraries;
DROP TABLE IF EXISTS trip_destinations;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS destinations;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS users;


/* =========================================
   USERS
   ========================================= */

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    profile_image TEXT,
    auth_provider ENUM('local', 'google') DEFAULT 'local',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


/* =========================================
   STATES AND UNION TERRITORIES
   ========================================= */

CREATE TABLE states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    type ENUM('STATE', 'UNION TERRITORY') NOT NULL,
    capital VARCHAR(100),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* =========================================
   DESTINATIONS
   ========================================= */

CREATE TABLE destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    state_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(150),
    category VARCHAR(100),
    description TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    image_url TEXT,
    estimated_hours DECIMAL(5,2) DEFAULT 2,
    best_time VARCHAR(100),

    FOREIGN KEY (state_id)
        REFERENCES states(id)
        ON DELETE CASCADE
);


/* =========================================
   TRIPS
   ========================================= */

CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(200) NOT NULL,
    start_date DATE,
    end_date DATE,
    number_of_days INT,
    budget DECIMAL(12,2),
    travel_type VARCHAR(100),
    planning_type ENUM('normal', 'custom') DEFAULT 'normal',
    source_location VARCHAR(200),
    status ENUM('draft', 'planned', 'completed') DEFAULT 'draft',
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


/* =========================================
   TRIP DESTINATIONS
   ========================================= */

CREATE TABLE trip_destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    destination_id INT NOT NULL,
    visit_order INT NOT NULL,
    visit_date DATE,
    notes TEXT,

    FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE,

    FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE
);


/* =========================================
   ITINERARIES
   ========================================= */

CREATE TABLE itineraries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    day_number INT NOT NULL,
    title VARCHAR(200),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE
);


/* =========================================
   ITINERARY ITEMS
   ========================================= */

CREATE TABLE itinerary_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itinerary_id INT NOT NULL,
    destination_id INT,
    start_time TIME,
    end_time TIME,
    activity VARCHAR(255),
    notes TEXT,

    FOREIGN KEY (itinerary_id)
        REFERENCES itineraries(id)
        ON DELETE CASCADE,

    FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE SET NULL
);


/* =========================================
   INDIAN STATES
   ========================================= */

INSERT INTO states
(name, code, type, capital, description)
VALUES

('Andhra Pradesh', 'AP', 'STATE', 'Amaravati',
 'A coastal state known for beaches, temples and heritage sites.'),

('Arunachal Pradesh', 'AR', 'STATE', 'Itanagar',
 'Known for mountains, monasteries and Himalayan landscapes.'),

('Assam', 'AS', 'STATE', 'Dispur',
 'Known for tea gardens, wildlife and the Brahmaputra.'),

('Bihar', 'BR', 'STATE', 'Patna',
 'Known for Buddhist heritage and ancient historical sites.'),

('Chhattisgarh', 'CG', 'STATE', 'Raipur',
 'Known for waterfalls, forests and tribal culture.'),

('Goa', 'GA', 'STATE', 'Panaji',
 'Known for beaches, Portuguese heritage and nightlife.'),

('Gujarat', 'GJ', 'STATE', 'Gandhinagar',
 'Known for heritage, wildlife, temples and coastal destinations.'),

('Haryana', 'HR', 'STATE', 'Chandigarh',
 'Known for historical sites and proximity to Delhi.'),

('Himachal Pradesh', 'HP', 'STATE', 'Shimla',
 'Known for Himalayan mountains, valleys and hill stations.'),

('Jharkhand', 'JH', 'STATE', 'Ranchi',
 'Known for waterfalls, forests and natural landscapes.'),

('Karnataka', 'KA', 'STATE', 'Bengaluru',
 'Known for heritage, technology, beaches and hill stations.'),

('Kerala', 'KL', 'STATE', 'Thiruvananthapuram',
 'Known for backwaters, beaches, hill stations and culture.'),

('Madhya Pradesh', 'MP', 'STATE', 'Bhopal',
 'Known for heritage monuments, wildlife and temples.'),

('Maharashtra', 'MH', 'STATE', 'Mumbai',
 'Known for Mumbai, hill stations, forts and caves.'),

('Manipur', 'MN', 'STATE', 'Imphal',
 'Known for lakes, hills and cultural heritage.'),

('Meghalaya', 'ML', 'STATE', 'Shillong',
 'Known for waterfalls, caves and scenic hills.'),

('Mizoram', 'MZ', 'STATE', 'Aizawl',
 'Known for hills, forests and scenic landscapes.'),

('Nagaland', 'NL', 'STATE', 'Kohima',
 'Known for mountain landscapes and tribal culture.'),

('Odisha', 'OD', 'STATE', 'Bhubaneswar',
 'Known for temples, beaches and ancient architecture.'),

('Punjab', 'PB', 'STATE', 'Chandigarh',
 'Known for Sikh heritage, food and historical sites.'),

('Rajasthan', 'RJ', 'STATE', 'Jaipur',
 'Known for forts, palaces, deserts and royal heritage.'),

('Sikkim', 'SK', 'STATE', 'Gangtok',
 'Known for Himalayan landscapes, monasteries and lakes.'),

('Tamil Nadu', 'TN', 'STATE', 'Chennai',
 'Known for temples, beaches, heritage and culture.'),

('Telangana', 'TS', 'STATE', 'Hyderabad',
 'Known for heritage, food, technology and historical monuments.'),

('Tripura', 'TR', 'STATE', 'Agartala',
 'Known for palaces, temples and natural attractions.'),

('Uttar Pradesh', 'UP', 'STATE', 'Lucknow',
 'Known for the Taj Mahal, religious sites and heritage cities.'),

('Uttarakhand', 'UK', 'STATE', 'Dehradun',
 'Known for Himalayas, pilgrimage sites and valleys.'),

('West Bengal', 'WB', 'STATE', 'Kolkata',
 'Known for Kolkata, Darjeeling, Sundarbans and cultural heritage.');


/* =========================================
   UNION TERRITORIES
   ========================================= */

INSERT INTO states
(name, code, type, capital, description)
VALUES

('Andaman and Nicobar Islands', 'AN', 'UNION TERRITORY',
 'Port Blair',
 'Known for tropical beaches, islands and marine activities.'),

('Chandigarh', 'CH', 'UNION TERRITORY',
 'Chandigarh',
 'Known for planned architecture, gardens and urban attractions.'),

('Dadra and Nagar Haveli and Daman and Diu', 'DD', 'UNION TERRITORY',
 'Daman',
 'Known for beaches, forts and coastal attractions.'),

('Delhi', 'DL', 'UNION TERRITORY',
 'New Delhi',
 'Known for monuments, museums and historic landmarks.'),

('Jammu and Kashmir', 'JK', 'UNION TERRITORY',
 'Srinagar',
 'Known for mountains, lakes, valleys and gardens.'),

('Ladakh', 'LA', 'UNION TERRITORY',
 'Leh',
 'Known for high-altitude landscapes, monasteries and mountains.'),

('Lakshadweep', 'LD', 'UNION TERRITORY',
 'Kavaratti',
 'Known for coral islands, beaches and marine life.'),

('Puducherry', 'PY', 'UNION TERRITORY',
 'Puducherry',
 'Known for French colonial architecture, beaches and cafes.');
 INSERT INTO destinations
(state_id, name, city, category, description, latitude, longitude, best_time)
VALUES

/* ANDHRA PRADESH */
((SELECT id FROM states WHERE code='AP'), 'Tirupati', 'Tirupati', 'Temple',
 'Famous pilgrimage destination and Sri Venkateswara Temple.', 13.6288, 79.4192, 'September-February'),

((SELECT id FROM states WHERE code='AP'), 'Visakhapatnam', 'Visakhapatnam', 'Beach',
 'Coastal city with beaches and scenic viewpoints.', 17.6868, 83.2185, 'October-March'),

((SELECT id FROM states WHERE code='AP'), 'Araku Valley', 'Araku', 'Hill Station',
 'Scenic valley surrounded by Eastern Ghats.', 18.3273, 82.8760, 'October-February'),

/* ARUNACHAL PRADESH */
((SELECT id FROM states WHERE code='AR'), 'Tawang', 'Tawang', 'Mountain',
 'Mountain destination known for monasteries and Himalayan scenery.', 27.5860, 91.8590, 'March-June'),

((SELECT id FROM states WHERE code='AR'), 'Ziro Valley', 'Ziro', 'Nature',
 'Scenic valley known for landscapes and local culture.', 27.5449, 93.8190, 'March-May'),

((SELECT id FROM states WHERE code='AR'), 'Bomdila', 'Bomdila', 'Mountain',
 'Mountain town with Himalayan views.', 27.2645, 92.4247, 'April-June'),

/* ASSAM */
((SELECT id FROM states WHERE code='AS'), 'Guwahati', 'Guwahati', 'City',
 'Major city and gateway to Northeast India.', 26.1445, 91.7362, 'October-April'),

((SELECT id FROM states WHERE code='AS'), 'Kaziranga National Park', 'Kohora', 'Wildlife',
 'Famous wildlife destination and UNESCO World Heritage Site.', 26.5775, 93.1711, 'November-April'),

((SELECT id FROM states WHERE code='AS'), 'Majuli', 'Majuli', 'Culture',
 'River island known for culture and satras.', 27.0016, 94.2243, 'October-March'),

/* BIHAR */
((SELECT id FROM states WHERE code='BR'), 'Bodh Gaya', 'Bodh Gaya', 'Buddhist',
 'Important Buddhist pilgrimage destination.', 24.6950, 84.9914, 'October-March'),

((SELECT id FROM states WHERE code='BR'), 'Patna', 'Patna', 'City',
 'Capital city with museums and historical attractions.', 25.5941, 85.1376, 'October-March'),

((SELECT id FROM states WHERE code='BR'), 'Nalanda', 'Nalanda', 'Heritage',
 'Ancient university and archaeological site.', 25.1357, 85.4436, 'October-March'),

/* CHHATTISGARH */
((SELECT id FROM states WHERE code='CG'), 'Raipur', 'Raipur', 'City',
 'Capital city and commercial center.', 21.2514, 81.6296, 'October-February'),

((SELECT id FROM states WHERE code='CG'), 'Chitrakote Falls', 'Jagdalpur', 'Waterfall',
 'Major waterfall surrounded by forest.', 19.2031, 81.6995, 'July-February'),

((SELECT id FROM states WHERE code='CG'), 'Bastar', 'Jagdalpur', 'Nature',
 'Region known for forests, waterfalls and tribal culture.', 19.0748, 82.0310, 'October-February'),

/* GOA */
((SELECT id FROM states WHERE code='GA'), 'Panaji', 'Panaji', 'City',
 'Goa capital with Portuguese heritage.', 15.4909, 73.8278, 'November-February'),

((SELECT id FROM states WHERE code='GA'), 'Baga Beach', 'Baga', 'Beach',
 'Popular beach destination.', 15.5557, 73.7517, 'November-February'),

((SELECT id FROM states WHERE code='GA'), 'Dudhsagar Falls', 'Mollem', 'Waterfall',
 'Famous waterfall surrounded by forest.', 15.3144, 74.3140, 'October-February'),

/* GUJARAT */
((SELECT id FROM states WHERE code='GJ'), 'Ahmedabad', 'Ahmedabad', 'City',
 'Historic city with architecture, food and culture.', 23.0225, 72.5714, 'November-February'),

((SELECT id FROM states WHERE code='GJ'), 'Gir National Park', 'Sasan Gir', 'Wildlife',
 'Famous for Asiatic lions.', 21.1243, 70.8242, 'December-March'),

((SELECT id FROM states WHERE code='GJ'), 'Rann of Kutch', 'Kutch', 'Desert',
 'Large salt desert famous for its landscapes.', 23.7337, 69.8597, 'November-February'),

/* HARYANA */
((SELECT id FROM states WHERE code='HR'), 'Gurugram', 'Gurugram', 'City',
 'Modern business and entertainment destination.', 28.4595, 77.0266, 'October-March'),

((SELECT id FROM states WHERE code='HR'), 'Kurukshetra', 'Kurukshetra', 'Heritage',
 'Historical and religious destination.', 29.9695, 76.8783, 'October-March'),

((SELECT id FROM states WHERE code='HR'), 'Sultanpur National Park', 'Gurugram', 'Wildlife',
 'Birdwatching destination.', 28.4597, 76.8844, 'October-March'),

/* HIMACHAL PRADESH */
((SELECT id FROM states WHERE code='HP'), 'Shimla', 'Shimla', 'Hill Station',
 'Popular Himalayan hill station.', 31.1048, 77.1734, 'March-June'),

((SELECT id FROM states WHERE code='HP'), 'Manali', 'Manali', 'Mountain',
 'Mountain destination with valleys and adventure activities.', 32.2396, 77.1887, 'March-June'),

((SELECT id FROM states WHERE code='HP'), 'Dharamshala', 'Dharamshala', 'Mountain',
 'Mountain destination known for Tibetan culture.', 32.2190, 76.3234, 'March-June'),

/* JHARKHAND */
((SELECT id FROM states WHERE code='JH'), 'Ranchi', 'Ranchi', 'City',
 'Capital city known for waterfalls.', 23.3441, 85.3096, 'October-February'),

((SELECT id FROM states WHERE code='JH'), 'Dassam Falls', 'Ranchi', 'Waterfall',
 'Scenic waterfall near Ranchi.', 23.1980, 85.4480, 'October-February'),

((SELECT id FROM states WHERE code='JH'), 'Deoghar', 'Deoghar', 'Temple',
 'Important religious destination.', 24.4920, 86.6950, 'October-March'),

/* KARNATAKA */
((SELECT id FROM states WHERE code='KA'), 'Bengaluru', 'Bengaluru', 'City',
 'Technology hub with parks and cultural attractions.', 12.9716, 77.5946, 'October-February'),

((SELECT id FROM states WHERE code='KA'), 'Mysuru Palace', 'Mysuru', 'Heritage',
 'Famous royal palace.', 12.3052, 76.6552, 'October-February'),

((SELECT id FROM states WHERE code='KA'), 'Hampi', 'Hampi', 'Heritage',
 'Ancient city and UNESCO World Heritage destination.', 15.3350, 76.4600, 'October-February'),

/* KERALA */
((SELECT id FROM states WHERE code='KL'), 'Kochi', 'Kochi', 'City',
 'Coastal city with heritage and cultural attractions.', 9.9312, 76.2673, 'October-March'),

((SELECT id FROM states WHERE code='KL'), 'Munnar', 'Munnar', 'Hill Station',
 'Tea plantations and mountain scenery.', 10.0889, 77.0595, 'September-May'),

((SELECT id FROM states WHERE code='KL'), 'Alappuzha', 'Alappuzha', 'Backwaters',
 'Famous for Kerala backwaters and houseboats.', 9.4981, 76.3388, 'October-February'),

/* MADHYA PRADESH */
((SELECT id FROM states WHERE code='MP'), 'Bhopal', 'Bhopal', 'City',
 'Capital city with lakes and museums.', 23.2599, 77.4126, 'October-March'),

((SELECT id FROM states WHERE code='MP'), 'Khajuraho', 'Khajuraho', 'Heritage',
 'Famous temple complex and UNESCO World Heritage Site.', 24.8318, 79.9199, 'October-February'),

((SELECT id FROM states WHERE code='MP'), 'Kanha National Park', 'Kanha', 'Wildlife',
 'Major tiger reserve and wildlife destination.', 22.3345, 80.6115, 'October-June'),

/* MAHARASHTRA */
((SELECT id FROM states WHERE code='MH'), 'Mumbai', 'Mumbai', 'City',
 'Major coastal metropolitan city.', 19.0760, 72.8777, 'October-February'),

((SELECT id FROM states WHERE code='MH'), 'Pune', 'Pune', 'City',
 'City known for education, culture and nearby forts.', 18.5204, 73.8567, 'October-February'),

((SELECT id FROM states WHERE code='MH'), 'Ajanta Caves', 'Aurangabad', 'Heritage',
 'Ancient rock-cut caves and UNESCO World Heritage Site.', 20.5519, 75.7033, 'October-March'),

/* MANIPUR */
((SELECT id FROM states WHERE code='MN'), 'Imphal', 'Imphal', 'City',
 'Capital city with cultural and historical attractions.', 24.8170, 93.9368, 'October-March'),

((SELECT id FROM states WHERE code='MN'), 'Loktak Lake', 'Moirang', 'Lake',
 'Largest freshwater lake in Northeast India.', 24.5500, 93.7800, 'October-March'),

((SELECT id FROM states WHERE code='MN'), 'Kangla Fort', 'Imphal', 'Heritage',
 'Historical fort complex.', 24.8074, 93.9410, 'October-March'),

/* MEGHALAYA */
((SELECT id FROM states WHERE code='ML'), 'Shillong', 'Shillong', 'Hill Station',
 'Hill station known for scenic landscapes.', 25.5788, 91.8933, 'October-April'),

((SELECT id FROM states WHERE code='ML'), 'Cherrapunji', 'Sohra', 'Nature',
 'Famous for waterfalls and rainfall.', 25.2702, 91.7323, 'October-May'),

((SELECT id FROM states WHERE code='ML'), 'Dawki', 'Dawki', 'Nature',
 'Known for the Umngot River and scenic views.', 25.1926, 92.0246, 'October-April'),

/* MIZORAM */
((SELECT id FROM states WHERE code='MZ'), 'Aizawl', 'Aizawl', 'Hill Station',
 'Hill city with scenic views.', 23.7271, 92.7176, 'October-March'),

((SELECT id FROM states WHERE code='MZ'), 'Reiek', 'Aizawl', 'Mountain',
 'Scenic mountain destination.', 23.6878, 92.5738, 'October-March'),

((SELECT id FROM states WHERE code='MZ'), 'Phawngpui', 'Saiha', 'Nature',
 'Blue Mountain National Park region.', 22.6865, 93.0445, 'October-March'),

/* NAGALAND */
((SELECT id FROM states WHERE code='NL'), 'Kohima', 'Kohima', 'Hill Station',
 'Capital city surrounded by hills.', 25.6751, 94.1086, 'October-May'),

((SELECT id FROM states WHERE code='NL'), 'Dzukou Valley', 'Kohima', 'Nature',
 'Scenic valley known for seasonal flowers.', 25.5381, 94.0152, 'October-April'),

((SELECT id FROM states WHERE code='NL'), 'Dimapur', 'Dimapur', 'City',
 'Major city and gateway to Nagaland.', 25.8629, 93.7537, 'October-April'),

/* ODISHA */
((SELECT id FROM states WHERE code='OD'), 'Bhubaneswar', 'Bhubaneswar', 'Temple',
 'Temple city known for ancient architecture.', 20.2961, 85.8245, 'October-March'),

((SELECT id FROM states WHERE code='OD'), 'Puri', 'Puri', 'Beach',
 'Famous pilgrimage and beach destination.', 19.8135, 85.8312, 'October-February'),

((SELECT id FROM states WHERE code='OD'), 'Konark', 'Konark', 'Heritage',
 'Home of the famous Sun Temple.', 19.8876, 86.0945, 'October-March'),

/* PUNJAB */
((SELECT id FROM states WHERE code='PB'), 'Amritsar', 'Amritsar', 'Heritage',
 'Home of the Golden Temple.', 31.6340, 74.8723, 'October-March'),

((SELECT id FROM states WHERE code='PB'), 'Jallianwala Bagh', 'Amritsar', 'History',
 'Historic memorial site.', 31.6200, 74.8800, 'October-March'),

((SELECT id FROM states WHERE code='PB'), 'Patiala', 'Patiala', 'Heritage',
 'Known for royal heritage and architecture.', 30.3398, 76.3869, 'October-March'),

/* RAJASTHAN */
((SELECT id FROM states WHERE code='RJ'), 'Jaipur', 'Jaipur', 'Heritage',
 'Known for forts, palaces and the Pink City.', 26.9124, 75.7873, 'October-March'),

((SELECT id FROM states WHERE code='RJ'), 'Udaipur', 'Udaipur', 'Heritage',
 'Known for lakes and royal palaces.', 24.5854, 73.7125, 'October-March'),

((SELECT id FROM states WHERE code='RJ'), 'Jaisalmer', 'Jaisalmer', 'Desert',
 'Desert city known for its fort and sand dunes.', 26.9157, 70.9083, 'October-February'),

/* SIKKIM */
((SELECT id FROM states WHERE code='SK'), 'Gangtok', 'Gangtok', 'Hill Station',
 'Capital city surrounded by Himalayan landscapes.', 27.3389, 88.6065, 'March-May'),

((SELECT id FROM states WHERE code='SK'), 'Tsomgo Lake', 'Gangtok', 'Lake',
 'High-altitude lake near Gangtok.', 27.3740, 88.7590, 'April-June'),

((SELECT id FROM states WHERE code='SK'), 'Nathula Pass', 'Gangtok', 'Mountain',
 'High-altitude mountain pass.', 27.3860, 88.8300, 'April-June'),

/* TAMIL NADU */
((SELECT id FROM states WHERE code='TN'), 'Chennai', 'Chennai', 'City',
 'Major coastal city with temples and beaches.', 13.0827, 80.2707, 'November-February'),

((SELECT id FROM states WHERE code='TN'), 'Ooty', 'Ooty', 'Hill Station',
 'Popular hill station in the Nilgiris.', 11.4064, 76.6932, 'October-June'),

((SELECT id FROM states WHERE code='TN'), 'Madurai', 'Madurai', 'Temple',
 'Historic temple city.', 9.9252, 78.1198, 'October-March'),

/* TELANGANA */
((SELECT id FROM states WHERE code='TS'), 'Hyderabad', 'Hyderabad', 'City',
 'Capital city known for heritage, food and technology.', 17.3850, 78.4867, 'October-February'),

((SELECT id FROM states WHERE code='TS'), 'Charminar', 'Hyderabad', 'Heritage',
 'Iconic historical monument in Hyderabad.', 17.3616, 78.4747, 'October-February'),

((SELECT id FROM states WHERE code='TS'), 'Golconda Fort', 'Hyderabad', 'Fort',
 'Historic fort complex.', 17.3833, 78.4011, 'October-February'),

/* TRIPURA */
((SELECT id FROM states WHERE code='TR'), 'Agartala', 'Agartala', 'City',
 'Capital city with historical attractions.', 23.8315, 91.2868, 'October-March'),

((SELECT id FROM states WHERE code='TR'), 'Ujjayanta Palace', 'Agartala', 'Heritage',
 'Historic palace and museum.', 23.8315, 91.2868, 'October-March'),

((SELECT id FROM states WHERE code='TR'), 'Neermahal', 'Melaghar', 'Palace',
 'Water palace located in Rudrasagar Lake.', 23.4915, 91.2705, 'October-March'),

/* UTTAR PRADESH */
((SELECT id FROM states WHERE code='UP'), 'Agra', 'Agra', 'Heritage',
 'Home to the Taj Mahal.', 27.1767, 78.0081, 'October-March'),

((SELECT id FROM states WHERE code='UP'), 'Varanasi', 'Varanasi', 'Religious',
 'Historic city on the Ganges.', 25.3176, 82.9739, 'October-March'),

((SELECT id FROM states WHERE code='UP'), 'Lucknow', 'Lucknow', 'Heritage',
 'City known for Nawabi architecture and cuisine.', 26.8467, 80.9462, 'October-March'),

/* UTTARAKHAND */
((SELECT id FROM states WHERE code='UK'), 'Dehradun', 'Dehradun', 'City',
 'Capital city surrounded by hills.', 30.3165, 78.0322, 'March-June'),

((SELECT id FROM states WHERE code='UK'), 'Rishikesh', 'Rishikesh', 'Adventure',
 'Known for yoga, rafting and the Ganges.', 30.0869, 78.2676, 'September-November'),

((SELECT id FROM states WHERE code='UK'), 'Nainital', 'Nainital', 'Hill Station',
 'Popular lake town in the Himalayas.', 29.3919, 79.4542, 'March-June'),

/* WEST BENGAL */
((SELECT id FROM states WHERE code='WB'), 'Kolkata', 'Kolkata', 'City',
 'Cultural capital known for heritage and food.', 22.5726, 88.3639, 'October-March'),

((SELECT id FROM states WHERE code='WB'), 'Darjeeling', 'Darjeeling', 'Hill Station',
 'Famous Himalayan hill station and tea region.', 27.0410, 88.2663, 'March-May'),

((SELECT id FROM states WHERE code='WB'), 'Sundarbans', 'South 24 Parganas', 'Wildlife',
 'Mangrove forest and wildlife destination.', 21.9497, 89.1833, 'November-February'),

/* ANDAMAN */
((SELECT id FROM states WHERE code='AN'), 'Port Blair', 'Port Blair', 'Island',
 'Gateway to the Andaman Islands.', 11.6234, 92.7265, 'October-May'),

((SELECT id FROM states WHERE code='AN'), 'Havelock Island', 'Swaraj Dweep', 'Beach',
 'Island known for beaches and marine activities.', 12.0000, 92.9500, 'October-May'),

((SELECT id FROM states WHERE code='AN'), 'Neil Island', 'Shaheed Dweep', 'Beach',
 'Quiet island with beaches and coral reefs.', 11.8500, 93.0000, 'October-May'),

/* CHANDIGARH */
((SELECT id FROM states WHERE code='CH'), 'Rock Garden', 'Chandigarh', 'Garden',
 'Unique sculpture garden.', 30.7525, 76.8050, 'October-March'),

((SELECT id FROM states WHERE code='CH'), 'Sukhna Lake', 'Chandigarh', 'Lake',
 'Popular recreational lake.', 30.7421, 76.8173, 'October-March'),

((SELECT id FROM states WHERE code='CH'), 'Rose Garden', 'Chandigarh', 'Garden',
 'Large botanical garden.', 30.7500, 76.7900, 'October-March'),

/* DAMAN AND DIU */
((SELECT id FROM states WHERE code='DD'), 'Daman', 'Daman', 'Beach',
 'Coastal destination with beaches and forts.', 20.3974, 72.8328, 'October-March'),

((SELECT id FROM states WHERE code='DD'), 'Diu Fort', 'Diu', 'Fort',
 'Historic coastal fort.', 20.7141, 70.9874, 'October-March'),

((SELECT id FROM states WHERE code='DD'), 'Nagoa Beach', 'Diu', 'Beach',
 'Popular beach destination.', 20.7030, 70.9200, 'October-March'),

/* DELHI */
((SELECT id FROM states WHERE code='DL'), 'India Gate', 'New Delhi', 'Monument',
 'Iconic war memorial.', 28.6129, 77.2295, 'October-March'),

((SELECT id FROM states WHERE code='DL'), 'Red Fort', 'New Delhi', 'Fort',
 'Historic Mughal fort and UNESCO World Heritage Site.', 28.6562, 77.2410, 'October-March'),

((SELECT id FROM states WHERE code='DL'), 'Qutub Minar', 'New Delhi', 'Heritage',
 'Historic tower and UNESCO World Heritage Site.', 28.5244, 77.1855, 'October-March'),

/* JAMMU AND KASHMIR */
((SELECT id FROM states WHERE code='JK'), 'Srinagar', 'Srinagar', 'Lake',
 'Known for Dal Lake and houseboats.', 34.0837, 74.7973, 'April-October'),

((SELECT id FROM states WHERE code='JK'), 'Gulmarg', 'Gulmarg', 'Mountain',
 'Mountain resort and skiing destination.', 34.0484, 74.3805, 'December-March'),

((SELECT id FROM states WHERE code='JK'), 'Pahalgam', 'Pahalgam', 'Valley',
 'Scenic valley destination.', 34.0161, 75.3150, 'April-June'),

/* LADAKH */
((SELECT id FROM states WHERE code='LA'), 'Leh', 'Leh', 'Mountain',
 'High-altitude Himalayan town.', 34.1526, 77.5771, 'May-September'),

((SELECT id FROM states WHERE code='LA'), 'Pangong Lake', 'Leh', 'Lake',
 'High-altitude lake known for scenic landscapes.', 33.7595, 78.6670, 'May-September'),

((SELECT id FROM states WHERE code='LA'), 'Nubra Valley', 'Nubra', 'Valley',
 'High-altitude valley with dramatic landscapes.', 35.4670, 77.5840, 'May-September'),

/* LAKSHADWEEP */
((SELECT id FROM states WHERE code='LD'), 'Kavaratti', 'Kavaratti', 'Island',
 'Capital island known for beaches and lagoons.', 10.5669, 72.6420, 'October-March'),

((SELECT id FROM states WHERE code='LD'), 'Agatti Island', 'Agatti', 'Beach',
 'Island known for coral reefs and lagoons.', 10.8505, 72.1936, 'October-March'),

((SELECT id FROM states WHERE code='LD'), 'Bangaram Island', 'Bangaram', 'Beach',
 'Tropical island destination.', 10.9500, 72.2870, 'October-March'),

/* PUDUCHERRY */
((SELECT id FROM states WHERE code='PY'), 'Puducherry', 'Puducherry', 'Heritage',
 'French colonial architecture and coastal destination.', 11.9416, 79.8083, 'October-March'),

((SELECT id FROM states WHERE code='PY'), 'Auroville', 'Auroville', 'Culture',
 'International township known for sustainable living.', 12.0069, 79.8100, 'October-March'),

((SELECT id FROM states WHERE code='PY'), 'Paradise Beach', 'Puducherry', 'Beach',
 'Popular coastal destination.', 11.9000, 79.8300, 'October-March');