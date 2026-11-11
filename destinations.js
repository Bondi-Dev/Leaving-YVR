/* DESTINATIONS, rated for a traveller starting in Vancouver, British Columbia.
   To add a place, copy a row and edit it. Columns, in order:
   name, country,
   hi, lo   = average daytime high (°C) in the warmest and coolest month (approximate)
   hem      = "N" (warmest in July) or "S" (warmest in January); add a number to override
              the warmest month, e.g. "N4" = warmest in April
   wet      = rainy / stormy / closed season as a month range, e.g. "5-10" or "11-3"; "" if none
   cost     = daily cost on the ground in CAD: 1 under $70, 2 $70-170, 3 $170-350, 4 over $350 (rough)
   far      = total travel time from Vancouver: 1 drive, ferry or short hop, 2 up to 6h,
              3 up to 11h, 4 up to 18h, 5 longer
   remote   = how hard to reach: 1 major hub, 2 one connection, 3 several legs, 4 expedition
   then scores from 0 (none) to 3 (world class):
   history, beach, nature, city, food, nightlife, adventure
   crowd    = 1 quiet, 2 moderate, 3 very popular
   blurb    = one line shown on the result card
   fare     = typical return fare from Vancouver, as a tier (see FARE_RANGES below); 0 = no flight needed
   airport  = airport code used for the Google Flights link; "" = drive or ferry
   journey  = one line describing the trip from Vancouver
*/
const DESTINATION_ROWS = [
  ["Whistler", "Canada", 24, -1, "N", "", 3, 1, 1, 0, 0, 3, 0, 2, 2, 3, 3, "World-class skiing and biking two hours up the highway.", 0, "", "A 2h drive"],
  ["Okanagan Valley", "Canada", 29, 1, "N", "", 2, 1, 1, 0, 2, 2, 0, 3, 1, 1, 2, "Lake beaches, orchards and more than 200 wineries.", 0, "", "A 4.5h drive, or a 1h flight to Kelowna"],
  ["Victoria", "Canada", 22, 8, "N", "11-2", 2, 1, 1, 2, 1, 2, 1, 2, 1, 1, 2, "A harbour city of gardens, pubs and afternoon tea.", 0, "", "About 3h by ferry"],
  ["Southern Gulf Islands", "Canada", 23, 8, "N", "11-2", 2, 1, 2, 0, 1, 3, 0, 2, 0, 2, 1, "Farm stands, quiet coves and island time.", 0, "", "A 2 to 3h ferry trip"],
  ["Sunshine Coast", "Canada", 23, 7, "N", "11-2", 2, 1, 1, 0, 2, 3, 0, 1, 0, 2, 1, "Forest trails, inlets and small towns a short ferry away.", 0, "", "A 40-minute ferry from Horseshoe Bay"],
  ["Kootenays", "Canada", 28, 0, "N", "", 2, 1, 2, 1, 1, 3, 0, 2, 1, 3, 1, "Hot springs, powder snow and the mountain town of Nelson.", 0, "", "An 8h drive, or a short flight to Castlegar"],
  ["Seattle", "United States", 25, 8, "N", "11-2", 3, 1, 1, 1, 0, 1, 3, 3, 2, 0, 2, "Coffee, seafood, music and a famous market.", 0, "", "A 2.5h drive plus the border"],
  ["Portland and the Oregon Coast", "United States", 27, 8, "N", "11-2", 3, 1, 1, 0, 2, 3, 2, 3, 2, 2, 2, "Food carts and breweries, then sea stacks and dunes.", 0, "", "A 5h drive plus the border"],
  ["Las Vegas", "United States", 40, 14, "N", "", 3, 2, 1, 0, 0, 1, 3, 3, 3, 1, 3, "Shows, casinos and desert at the edge of the city.", 1, "LAS", "About 2.5h, direct flights available"],
  ["Palm Springs", "United States", 42, 21, "N", "", 3, 2, 1, 0, 0, 2, 1, 2, 2, 1, 2, "Winter sun, pools and mid-century design.", 1, "PSP", "About 3h, direct in winter"],
  ["Southern California", "United States", 29, 20, "N9", "", 4, 2, 1, 1, 3, 2, 3, 3, 3, 1, 3, "Beaches, theme parks and sun all year.", 1, "LAX", "About 3h, direct flights available"],
  ["Athens", "Greece", 33, 13, "N", "", 2, 4, 1, 3, 1, 1, 3, 3, 2, 0, 3, "Ancient ruins above a loud, late-night city.", 3, "ATH", "1 stop, about 15h"],
  ["Crete", "Greece", 30, 15, "N", "", 2, 4, 2, 3, 3, 2, 1, 3, 1, 2, 2, "Minoan palaces, gorges and long beaches on one island.", 3, "HER", "2 stops, about 18h"],
  ["Rome", "Italy", 31, 12, "N", "", 3, 4, 1, 3, 0, 1, 3, 3, 2, 0, 3, "Two thousand years of history between plates of pasta.", 3, "FCO", "1 stop, about 14h"],
  ["Amalfi Coast", "Italy", 30, 13, "N", "", 3, 4, 2, 2, 3, 2, 1, 3, 1, 1, 3, "Cliffside villages, lemon groves and blue water.", 3, "NAP", "1 stop to Naples, about 15h, then a bus or ferry"],
  ["Sicily", "Italy", 31, 15, "N", "", 2, 4, 2, 3, 3, 2, 2, 3, 1, 1, 2, "Greek temples, a live volcano and serious street food.", 3, "CTA", "2 stops, about 17h"],
  ["Dolomites", "Italy", 24, 3, "N", "", 3, 4, 2, 1, 0, 3, 0, 3, 0, 3, 2, "Jagged peaks with hut-to-hut hiking and good food.", 3, "VCE", "1 stop to Venice, about 14h, then a 2h drive"],
  ["Paris", "France", 25, 7, "N", "", 3, 3, 1, 3, 0, 0, 3, 3, 3, 0, 3, "Museums, cafes and long walks along the river.", 3, "CDG", "About 10h, direct flights available"],
  ["Barcelona", "Spain", 29, 14, "N", "", 3, 4, 1, 2, 2, 1, 3, 3, 3, 0, 3, "Gaudi, tapas and a city beach.", 3, "BCN", "1 stop, about 13h"],
  ["Seville and Andalusia", "Spain", 36, 16, "N", "", 2, 4, 1, 3, 1, 1, 2, 3, 2, 0, 2, "Moorish palaces, flamenco and orange trees.", 3, "SVQ", "1 or 2 stops, about 15h"],
  ["Lisbon", "Portugal", 28, 15, "N", "", 2, 4, 1, 2, 2, 1, 3, 3, 3, 0, 3, "Hills, trams, tiles and custard tarts by the Atlantic.", 3, "LIS", "1 stop, about 14h"],
  ["Madeira", "Portugal", 26, 19, "N", "", 2, 4, 2, 1, 1, 3, 1, 2, 1, 3, 2, "A green volcanic island of cliff walks and mild weather.", 3, "FNC", "2 stops, about 18h"],
  ["Azores", "Portugal", 25, 17, "N", "", 2, 4, 2, 1, 1, 3, 0, 2, 0, 3, 1, "Crater lakes and hot springs in the mid-Atlantic.", 3, "PDL", "1 or 2 stops, about 14h"],
  ["London", "United Kingdom", 23, 8, "N", "", 4, 3, 1, 3, 0, 0, 3, 2, 3, 0, 3, "Free museums, theatre and pubs in every direction.", 3, "LHR", "About 9.5h, direct flights available"],
  ["Scottish Highlands", "United Kingdom", 18, 6, "N", "", 3, 4, 2, 2, 0, 3, 0, 1, 0, 3, 2, "Lochs, castles and empty single-track roads.", 3, "INV", "1 or 2 stops, about 14h"],
  ["Dublin and the west of Ireland", "Ireland", 19, 8, "N", "", 3, 4, 1, 2, 0, 3, 2, 2, 3, 1, 2, "Pub music in town, sea cliffs out west.", 3, "DUB", "Usually 1 stop, about 12h"],
  ["Amsterdam", "Netherlands", 22, 6, "N", "", 3, 3, 1, 2, 0, 0, 3, 2, 3, 0, 3, "Canals, bikes and world-class art.", 3, "AMS", "About 9.5h, direct flights available"],
  ["Berlin", "Germany", 24, 3, "N", "", 2, 4, 1, 3, 0, 0, 3, 2, 3, 0, 2, "Twentieth-century history and a famous club scene.", 3, "BER", "1 stop, about 13h"],
  ["Prague", "Czechia", 25, 2, "N", "", 2, 4, 1, 3, 0, 0, 3, 2, 3, 0, 3, "A fairytale old town with very good beer.", 3, "PRG", "1 stop, about 13h"],
  ["Budapest", "Hungary", 27, 3, "N", "", 2, 4, 1, 3, 0, 0, 3, 2, 3, 0, 2, "Thermal baths, grand architecture and ruin bars.", 3, "BUD", "1 stop, about 14h"],
  ["Krakow", "Poland", 24, 1, "N", "", 1, 4, 1, 3, 0, 1, 2, 2, 2, 0, 2, "A preserved medieval centre at gentle prices.", 3, "KRK", "1 stop, about 14h"],
  ["Copenhagen", "Denmark", 22, 3, "N", "", 4, 4, 1, 2, 0, 0, 3, 3, 2, 0, 2, "Design, cycling and some of the best restaurants in Europe.", 3, "CPH", "1 stop, about 12h"],
  ["Dubrovnik and the Dalmatian Coast", "Croatia", 29, 12, "N", "", 2, 4, 2, 3, 3, 2, 1, 2, 2, 1, 3, "Walled towns and island-hopping on clear water.", 3, "DBV", "2 stops, about 17h"],
  ["Swiss Alps", "Switzerland", 24, 3, "N", "", 4, 4, 2, 1, 0, 3, 0, 2, 0, 3, 3, "Postcard mountains reached by spotless trains.", 3, "ZRH", "1 stop to Zurich, about 13h, then a train"],
  ["Iceland", "Iceland", 14, 2, "N", "", 4, 3, 1, 1, 0, 3, 1, 1, 1, 3, 3, "Waterfalls, glaciers and hot pools on one ring road.", 3, "KEF", "About 7.5h direct in summer, otherwise 1 stop"],
  ["Norwegian Fjords", "Norway", 20, 2, "N", "", 4, 4, 2, 1, 0, 3, 0, 1, 0, 3, 2, "Deep fjords, steep hikes and long summer light.", 3, "BGO", "2 stops, about 16h"],
  ["Lofoten Islands", "Norway", 15, 1, "N", "", 4, 5, 3, 1, 1, 3, 0, 1, 0, 3, 1, "Fishing villages under sharp Arctic peaks.", 4, "BOO", "3 flights or a ferry, about 22h"],
  ["Svalbard", "Norway", 7, -13, "N", "", 4, 5, 4, 0, 0, 3, 0, 1, 0, 3, 1, "Polar bears and glaciers a short hop from the North Pole.", 4, "LYR", "3 flights, about 24h"],
  ["Lapland", "Finland", 19, -9, "N", "", 3, 4, 3, 0, 0, 3, 0, 1, 0, 3, 2, "Northern lights, reindeer and deep winter snow.", 4, "RVN", "2 stops, about 18h"],
  ["Faroe Islands", "Denmark", 13, 6, "N", "", 4, 4, 3, 1, 0, 3, 0, 1, 0, 3, 1, "Grass-roofed villages on cliffs in the North Atlantic.", 4, "FAE", "2 stops, about 18h, with limited flights"],
  ["Istanbul", "Turkey", 29, 9, "N", "", 2, 4, 1, 3, 0, 0, 3, 3, 2, 0, 3, "Bazaars, mosques and ferries between two continents.", 3, "IST", "1 stop, about 15h"],
  ["Cappadocia", "Turkey", 31, 4, "N", "", 2, 4, 2, 3, 0, 3, 0, 2, 0, 2, 2, "Cave hotels and hot-air balloons over rock spires.", 3, "NAV", "2 stops, about 18h"],
  ["Albanian Riviera", "Albania", 31, 13, "N", "", 1, 5, 3, 2, 3, 2, 0, 2, 1, 1, 1, "Mediterranean beaches without the crowds or prices.", 3, "TIA", "2 stops to Tirana, about 18h, then a 4h drive"],
  ["Tbilisi and the Caucasus", "Georgia", 31, 7, "N", "", 1, 5, 2, 3, 0, 3, 2, 3, 2, 2, 1, "Ancient wine country beneath huge mountains.", 4, "TBS", "2 stops, about 20h"],
  ["Malta", "Malta", 32, 16, "N", "", 2, 4, 2, 3, 2, 1, 1, 2, 2, 1, 2, "Fortress cities and temples older than the pyramids.", 3, "MLA", "2 stops, about 17h"],
  ["Marrakech and the Atlas Mountains", "Morocco", 37, 18, "N", "", 1, 4, 2, 3, 0, 2, 2, 3, 1, 2, 3, "Souks and riads with mountains an hour away.", 4, "RAK", "2 stops, about 18h"],
  ["Cairo and the Nile", "Egypt", 35, 19, "N", "", 1, 4, 1, 3, 0, 1, 2, 2, 1, 0, 3, "Pyramids, temples and a slow boat between them.", 4, "CAI", "1 or 2 stops, about 18h"],
  ["Jordan: Petra and Wadi Rum", "Jordan", 33, 13, "N", "", 2, 5, 2, 3, 0, 3, 1, 2, 0, 2, 2, "A rock-cut city and a red desert to sleep in.", 4, "AMM", "1 or 2 stops, about 19h"],
  ["Oman", "Oman", 38, 25, "N", "", 3, 5, 2, 2, 2, 3, 1, 2, 0, 2, 1, "Forts, wadis and dunes without the crowds.", 4, "MCT", "2 stops, about 21h"],
  ["Dubai", "United Arab Emirates", 41, 24, "N", "", 3, 4, 1, 1, 2, 1, 3, 3, 3, 1, 3, "Skyscrapers, malls and desert on the edge of town.", 4, "DXB", "About 15h, 1 stop on most routes"],
  ["Cape Town", "South Africa", 27, 18, "S", "5-8", 2, 5, 2, 2, 2, 3, 2, 3, 2, 2, 2, "A mountain in the city, penguins and wine country.", 5, "CPT", "2 stops, about 27h"],
  ["Kruger safari", "South Africa", 32, 26, "S", "11-3", 3, 5, 3, 0, 0, 3, 0, 2, 0, 3, 2, "Self-drive or guided safaris among the big five.", 5, "JNB", "2 stops to Johannesburg, about 26h, then a short flight or drive"],
  ["Serengeti and Zanzibar", "Tanzania", 30, 27, "S", "3-5", 3, 5, 3, 1, 3, 3, 0, 2, 1, 3, 2, "The great migration, then a spice-island beach.", 5, "JRO", "2 or 3 stops, about 28h"],
  ["Namibia", "Namibia", 32, 22, "S", "1-3", 3, 5, 3, 0, 0, 3, 0, 1, 0, 3, 1, "Giant red dunes and desert wildlife on empty roads.", 5, "WDH", "3 stops, about 30h"],
  ["Victoria Falls", "Zambia and Zimbabwe", 33, 25, "S", "12-3", 3, 5, 3, 1, 0, 3, 0, 1, 1, 3, 2, "One of the largest waterfalls on Earth.", 5, "VFA", "3 stops, about 30h"],
  ["Rwanda: gorilla trekking", "Rwanda", 27, 25, "N", "3-5", 4, 5, 3, 1, 0, 3, 0, 1, 0, 3, 1, "An hour face to face with mountain gorillas.", 5, "KGL", "2 stops, about 26h"],
  ["Madagascar", "Madagascar", 29, 22, "S", "1-3", 2, 5, 4, 0, 2, 3, 0, 1, 0, 3, 1, "Lemurs, baobabs and wildlife found nowhere else.", 5, "TNR", "3 stops, about 32h"],
  ["Seychelles", "Seychelles", 31, 28, "S", "12-2", 4, 5, 3, 0, 3, 3, 0, 2, 0, 2, 2, "Granite boulders on some of the best beaches anywhere.", 5, "SEZ", "2 stops, about 26h"],
  ["Tokyo", "Japan", 31, 10, "N", "6-7", 3, 3, 1, 2, 0, 1, 3, 3, 3, 0, 3, "The biggest city on Earth, and one of the best fed.", 3, "TYO", "About 10h, direct flights available"],
  ["Kyoto", "Japan", 33, 9, "N", "6-7", 3, 4, 2, 3, 0, 2, 2, 3, 1, 0, 3, "Temples, gardens and old wooden streets.", 3, "KIX", "1 stop to Osaka, about 13h, then a short train"],
  ["Hokkaido", "Japan", 26, -1, "N", "", 3, 4, 2, 1, 0, 3, 1, 3, 1, 3, 2, "Powder snow in winter, flower fields in summer.", 3, "CTS", "1 stop via Tokyo, about 14h"],
  ["Seoul", "South Korea", 30, 2, "N", "7-8", 2, 3, 1, 2, 0, 1, 3, 3, 3, 0, 2, "Palaces, street food and a city that stays up late.", 3, "ICN", "About 11h, direct flights available"],
  ["Taipei", "Taiwan", 34, 19, "N", "5-9", 2, 4, 1, 2, 0, 2, 3, 3, 2, 1, 2, "Night markets with hiking trails at the metro's end.", 3, "TPE", "About 12h, direct flights available"],
  ["Hong Kong", "China", 31, 19, "N", "5-9", 3, 4, 1, 1, 1, 1, 3, 3, 3, 0, 3, "A vertical city with dim sum and island ferries.", 3, "HKG", "About 13h, direct flights available"],
  ["Beijing and the Great Wall", "China", 31, 2, "N", "7-8", 2, 3, 1, 3, 0, 1, 3, 3, 1, 1, 3, "Imperial palaces and a wall across the mountains.", 3, "PEK", "About 11h, direct flights available"],
  ["Bangkok", "Thailand", 35, 32, "N4", "5-10", 1, 4, 1, 2, 0, 0, 3, 3, 3, 0, 3, "Temples, street food and rooftop bars.", 4, "BKK", "About 17h with 1 stop"],
  ["Chiang Mai", "Thailand", 36, 29, "N4", "5-10", 1, 5, 2, 2, 0, 2, 1, 3, 1, 2, 2, "A relaxed northern city ringed by jungle and temples.", 4, "CNX", "2 stops, about 20h"],
  ["Phuket and Krabi", "Thailand", 33, 31, "N4", "5-10", 2, 5, 2, 0, 3, 2, 1, 3, 3, 2, 3, "Limestone cliffs, island boats and beach nightlife.", 4, "HKT", "2 stops, about 21h"],
  ["Bali", "Indonesia", 31, 29, "S", "11-3", 2, 5, 2, 2, 3, 3, 1, 3, 3, 2, 3, "Rice terraces, surf and temples.", 4, "DPS", "1 or 2 stops, about 21h"],
  ["Raja Ampat", "Indonesia", 31, 30, "S", "6-9", 3, 5, 4, 0, 3, 3, 0, 1, 0, 3, 1, "Some of the richest reefs on Earth, reached by flights to Sorong and then boats.", 5, "SOQ", "3 flights to Sorong, about 30h, then a ferry and a local boat"],
  ["Komodo and Flores", "Indonesia", 32, 30, "S", "12-3", 2, 5, 3, 0, 3, 3, 0, 1, 0, 3, 1, "Dragons, pink beaches and manta rays.", 5, "LBJ", "3 flights, about 28h"],
  ["Hanoi and Ha Long Bay", "Vietnam", 33, 20, "N", "5-9", 1, 4, 2, 2, 1, 3, 2, 3, 2, 1, 3, "An old-quarter capital and a bay of limestone islands.", 4, "HAN", "1 stop, about 17h"],
  ["Hoi An and Da Nang", "Vietnam", 34, 25, "N", "9-12", 1, 5, 2, 3, 2, 1, 1, 3, 1, 1, 2, "A lantern-lit trading port beside long beaches.", 4, "DAD", "2 stops, about 20h"],
  ["Siem Reap and Angkor", "Cambodia", 35, 31, "N4", "5-10", 1, 5, 2, 3, 0, 1, 1, 2, 2, 1, 3, "The largest temple complex in the world.", 4, "SAI", "2 stops, about 21h"],
  ["Luang Prabang", "Laos", 34, 27, "N4", "5-9", 1, 5, 3, 3, 0, 3, 0, 2, 0, 2, 1, "A quiet riverside town of monasteries and waterfalls.", 4, "LPQ", "2 or 3 stops, about 23h"],
  ["Palawan", "Philippines", 33, 30, "N5", "6-11", 2, 5, 3, 0, 3, 3, 0, 2, 1, 3, 2, "Lagoons and island-hopping between limestone cliffs.", 4, "PPS", "2 flights via Manila, about 19h"],
  ["Singapore", "Singapore", 32, 30, "N", "11-1", 3, 4, 1, 1, 1, 1, 3, 3, 2, 0, 3, "A spotless city-state built around eating.", 4, "SIN", "About 16h, direct or 1 stop"],
  ["Borneo (Sabah)", "Malaysia", 32, 30, "N", "11-2", 2, 5, 3, 0, 2, 3, 0, 2, 0, 3, 1, "Orangutans, rainforest and world-class diving.", 4, "BKI", "2 stops, about 21h"],
  ["Sri Lanka", "Sri Lanka", 31, 30, "N", "5-9", 1, 5, 2, 3, 3, 3, 1, 3, 1, 2, 2, "Tea hills, ancient cities, leopards and surf.", 4, "CMB", "2 stops, about 24h"],
  ["Maldives", "Maldives", 31, 30, "N", "5-10", 4, 5, 3, 0, 3, 2, 0, 2, 0, 2, 2, "Overwater villas on coral atolls.", 5, "MLE", "2 stops, about 25h"],
  ["Rajasthan", "India", 40, 22, "N5", "7-9", 1, 5, 2, 3, 0, 1, 2, 3, 0, 1, 3, "Forts, palaces and desert towns in every colour.", 4, "JAI", "2 flights via Delhi, about 19h"],
  ["Kerala", "India", 33, 29, "N4", "6-9", 1, 5, 2, 2, 2, 3, 0, 3, 0, 1, 2, "Backwater houseboats, tea estates and spice.", 4, "COK", "2 stops, about 23h"],
  ["Ladakh", "India", 25, -2, "N", "", 1, 5, 4, 2, 0, 3, 0, 1, 0, 3, 1, "High-altitude desert and cliffside monasteries.", 4, "IXL", "2 flights via Delhi, about 20h"],
  ["Kathmandu and the Himalaya", "Nepal", 29, 18, "N", "6-9", 1, 5, 3, 3, 0, 3, 1, 2, 1, 3, 2, "Teahouse treks beneath the highest mountains on Earth.", 4, "KTM", "2 stops, about 22h"],
  ["Bhutan", "Bhutan", 25, 12, "N", "6-9", 4, 5, 4, 3, 0, 3, 0, 1, 0, 2, 1, "A Himalayan kingdom that limits its visitors.", 5, "PBH", "3 flights, about 28h"],
  ["Samarkand and Bukhara", "Uzbekistan", 36, 6, "N", "", 1, 5, 3, 3, 0, 1, 1, 2, 0, 0, 1, "Blue-tiled Silk Road cities.", 4, "SKD", "2 stops, about 22h"],
  ["Kyrgyzstan", "Kyrgyzstan", 30, 0, "N", "", 1, 5, 4, 1, 0, 3, 0, 1, 0, 3, 1, "Yurt stays and horse treks in alpine valleys.", 4, "FRU", "2 stops, about 22h"],
  ["Mongolia", "Mongolia", 25, -15, "N", "", 2, 4, 4, 2, 0, 3, 0, 1, 0, 3, 1, "Endless steppe, nomad camps and the Gobi.", 4, "UBN", "1 or 2 stops via Seoul, about 16h"],
  ["Sydney", "Australia", 26, 17, "S", "", 3, 4, 1, 1, 3, 2, 3, 3, 3, 1, 3, "Harbour, surf beaches and coastal walks.", 4, "SYD", "About 15.5h, direct flights available"],
  ["Great Barrier Reef", "Australia", 31, 26, "S", "12-3", 3, 5, 2, 0, 3, 3, 0, 2, 1, 3, 2, "The world's largest reef beside ancient rainforest.", 4, "CNS", "1 or 2 stops, about 20h"],
  ["Tasmania", "Australia", 22, 12, "S", "", 3, 5, 3, 2, 1, 3, 0, 3, 0, 3, 1, "Wild coastline, wilderness hikes and great produce.", 4, "HBA", "2 flights, about 20h"],
  ["South Island", "New Zealand", 22, 8, "S", "", 3, 4, 2, 0, 0, 3, 0, 2, 2, 3, 2, "Fjords, glaciers and every adventure sport invented.", 4, "ZQN", "About 17h with 1 stop in Auckland"],
  ["Fiji", "Fiji", 31, 27, "S", "12-3", 3, 4, 2, 0, 3, 3, 0, 1, 1, 2, 2, "Warm water, soft coral and easy island time.", 4, "NAN", "About 12h, direct flights available"],
  ["Cook Islands", "Cook Islands", 29, 25, "S", "12-3", 3, 5, 3, 0, 3, 2, 0, 1, 0, 2, 1, "A quiet lagoon with no chain hotels.", 4, "RAR", "2 stops, about 20h"],
  ["Bora Bora and Moorea", "French Polynesia", 30, 28, "S", "12-3", 4, 4, 3, 0, 3, 3, 0, 2, 0, 2, 2, "Volcanic peaks rising out of turquoise lagoons.", 5, "PPT", "1 stop to Tahiti, about 14h, then a short island flight"],
  ["Hawaii", "United States", 30, 26, "N", "", 4, 2, 1, 1, 3, 3, 1, 2, 1, 3, 3, "Volcanoes, surf and rainforest valleys.", 2, "OGG", "About 6h, direct flights available"],
  ["Mexico City", "Mexico", 27, 22, "N5", "6-9", 2, 2, 1, 3, 0, 0, 3, 3, 3, 0, 2, "Museums, markets and one of the great food cities.", 2, "MEX", "About 5.5h, direct flights available"],
  ["Oaxaca", "Mexico", 31, 25, "N4", "6-9", 1, 3, 2, 3, 0, 2, 1, 3, 2, 1, 2, "Mole, mezcal, crafts and ancient ruins.", 3, "OAX", "1 stop, about 9h"],
  ["Tulum and the Riviera Maya", "Mexico", 33, 28, "N", "6-10", 3, 2, 1, 2, 3, 2, 0, 2, 3, 2, 3, "Caribbean beaches, cenotes and Maya ruins.", 2, "CUN", "About 5.5h direct to Cancun, then a 90-minute drive"],
  ["Puerto Vallarta", "Mexico", 33, 27, "N", "7-9", 2, 2, 1, 0, 3, 2, 1, 3, 3, 1, 3, "A Pacific beach town with a proper old centre.", 2, "PVR", "About 4.5h, direct flights available"],
  ["Baja California Sur", "Mexico", 35, 24, "N", "8-9", 3, 2, 1, 0, 3, 3, 0, 2, 2, 3, 2, "Desert meets sea, with whales and whale sharks.", 2, "SJD", "About 4.5h, direct flights available"],
  ["Costa Rica", "Costa Rica", 32, 29, "N3", "5-11", 2, 3, 2, 0, 3, 3, 0, 1, 1, 3, 3, "Cloud forest, volcanoes, wildlife and two coasts.", 3, "LIR", "1 stop, about 10h"],
  ["Belize", "Belize", 31, 27, "N", "6-11", 2, 3, 2, 2, 3, 3, 0, 1, 1, 3, 2, "Barrier-reef cayes and jungle ruins.", 3, "BZE", "1 or 2 stops, about 11h"],
  ["Antigua and Lake Atitlan", "Guatemala", 26, 22, "N4", "5-10", 1, 3, 2, 3, 0, 3, 0, 2, 1, 2, 2, "A colonial town and a lake ringed by volcanoes.", 3, "GUA", "1 stop, about 10h"],
  ["Bocas del Toro and San Blas", "Panama", 31, 30, "N", "5-11", 2, 4, 3, 1, 3, 3, 1, 1, 1, 2, 1, "Caribbean islands, many of them without roads.", 3, "PTY", "1 stop to Panama City, about 11h, then a small plane or boat"],
  ["Havana", "Cuba", 32, 26, "N", "6-10", 2, 3, 2, 3, 2, 1, 2, 1, 3, 0, 2, "Faded grandeur, old cars and live music.", 3, "HAV", "1 stop, about 10h"],
  ["Jamaica", "Jamaica", 32, 29, "N", "8-10", 3, 3, 1, 1, 3, 2, 0, 2, 2, 1, 3, "Beaches, waterfalls and reggae.", 3, "MBJ", "1 stop, about 10h"],
  ["Punta Cana", "Dominican Republic", 31, 28, "N", "8-10", 2, 3, 1, 1, 3, 1, 0, 1, 2, 1, 3, "Easy all-inclusive beach time.", 3, "PUJ", "1 stop, about 10h"],
  ["Aruba and Curacao", "Dutch Caribbean", 32, 30, "N", "", 3, 4, 1, 1, 3, 1, 0, 2, 2, 2, 2, "Dry, sunny islands outside the hurricane belt.", 3, "AUA", "1 or 2 stops, about 12h"],
  ["St. Lucia", "St. Lucia", 31, 29, "N", "8-10", 4, 4, 2, 0, 3, 3, 0, 2, 1, 2, 2, "Twin volcanic peaks above quiet bays.", 3, "UVF", "1 or 2 stops, about 13h"],
  ["Cartagena", "Colombia", 32, 31, "N", "9-11", 2, 4, 1, 3, 2, 1, 2, 3, 3, 0, 3, "A walled colonial city on the Caribbean.", 3, "CTG", "1 or 2 stops, about 13h"],
  ["Medellin and the Coffee Region", "Colombia", 28, 27, "N", "4-5", 1, 4, 2, 1, 0, 3, 3, 2, 3, 2, 2, "Spring weather all year and green coffee hills.", 3, "MDE", "1 or 2 stops, about 12h"],
  ["Cusco and Machu Picchu", "Peru", 21, 19, "S", "12-3", 2, 5, 3, 3, 0, 3, 1, 3, 1, 3, 3, "The Inca heartland high in the Andes.", 4, "CUZ", "2 stops, about 19h"],
  ["Galapagos Islands", "Ecuador", 30, 24, "S", "", 4, 5, 4, 0, 2, 3, 0, 1, 0, 3, 2, "Wildlife that has never learned to fear people.", 4, "GPS", "3 flights, about 22h"],
  ["Amazon Rainforest", "Peru and Brazil", 32, 31, "S", "12-5", 2, 5, 4, 0, 0, 3, 0, 1, 0, 3, 1, "River lodges deep in the largest rainforest on Earth.", 4, "IQT", "3 flights, about 22h"],
  ["Uyuni Salt Flats", "Bolivia", 20, 13, "S", "1-3", 1, 5, 4, 1, 0, 3, 0, 1, 0, 3, 1, "A white horizon that turns into a mirror after rain.", 4, "LPB", "2 or 3 stops to La Paz, about 22h, then a short flight or night bus"],
  ["Atacama Desert", "Chile", 25, 18, "S", "", 3, 5, 3, 1, 0, 3, 0, 1, 0, 3, 1, "The driest desert on Earth, under the clearest night skies.", 4, "CJC", "2 or 3 stops, about 22h"],
  ["Easter Island", "Chile", 27, 20, "S", "", 3, 5, 4, 3, 2, 2, 0, 1, 0, 2, 1, "Stone giants on one of the most isolated islands anywhere.", 5, "IPC", "3 flights via Santiago, about 28h"],
  ["Patagonia", "Chile and Argentina", 19, 5, "S", "", 3, 5, 4, 0, 0, 3, 0, 2, 0, 3, 2, "Granite towers, glaciers and famous wind.", 5, "PUQ", "3 flights, about 28h"],
  ["Antarctica", "Antarctica", 3, -8, "S", "4-10", 4, 5, 4, 0, 0, 3, 0, 1, 0, 3, 1, "Icebergs and penguins by expedition ship from Ushuaia.", 5, "USH", "3 flights to Ushuaia, about 28h, then a ship across the Drake Passage"],
  ["Buenos Aires", "Argentina", 30, 15, "S", "", 2, 5, 1, 2, 0, 0, 3, 3, 3, 0, 2, "Steak, tango and dinner at eleven.", 4, "EZE", "1 or 2 stops, about 19h"],
  ["Rio de Janeiro", "Brazil", 31, 25, "S", "12-3", 2, 5, 1, 1, 3, 2, 3, 2, 3, 1, 3, "City beaches beneath jungle-covered peaks.", 4, "GIG", "1 or 2 stops, about 19h"],
  ["New York City", "United States", 29, 4, "N", "", 4, 2, 1, 2, 0, 0, 3, 3, 3, 0, 3, "The city that has everything, at every hour.", 2, "NYC", "About 5h, direct flights available"],
  ["New Orleans", "United States", 33, 17, "N", "", 3, 3, 1, 3, 0, 0, 2, 3, 3, 0, 3, "Live music, Creole food and a culture of its own.", 2, "MSY", "1 stop, about 7h"],
  ["California Coast", "United States", 23, 14, "N9", "", 4, 2, 1, 1, 2, 3, 2, 3, 1, 2, 3, "Big Sur cliffs, redwoods and San Francisco.", 1, "SFO", "About 2.5h direct to San Francisco"],
  ["Utah National Parks", "United States", 35, 5, "N", "", 3, 2, 2, 0, 0, 3, 0, 1, 0, 3, 3, "Arches, canyons and red rock in five parks.", 1, "SLC", "About 2.5h direct to Salt Lake City, then a 4h drive"],
  ["Alaska", "United States", 19, -5, "N", "", 4, 2, 2, 1, 0, 3, 0, 2, 0, 3, 2, "Glaciers, bears and very large mountains.", 2, "ANC", "About 3.5h, direct in summer"],
  ["Banff and the Canadian Rockies", "Canada", 23, -3, "N", "", 3, 1, 1, 0, 0, 3, 0, 2, 1, 3, 3, "Turquoise lakes in summer, ski hills in winter.", 1, "YYC", "A 90-minute flight to Calgary, or a 9h drive"],
  ["Quebec City and Montreal", "Canada", 26, -7, "N", "", 2, 2, 1, 3, 0, 1, 3, 3, 2, 0, 2, "French-speaking cities with old walls and great food.", 2, "YUL", "About 5h, direct flights available"],
  ["Newfoundland", "Canada", 20, -1, "N", "", 2, 3, 3, 2, 0, 3, 0, 2, 1, 2, 1, "Icebergs, whales and painted fishing villages.", 3, "YYT", "1 or 2 stops, about 9h"],
  ["Tofino and Vancouver Island", "Canada", 19, 8, "N", "11-2", 3, 1, 2, 0, 2, 3, 0, 3, 0, 3, 2, "Cold-water surf and old-growth rainforest.", 0, "", "A ferry and a drive, about 5h"],
  ["Haida Gwaii", "Canada", 18, 6, "N", "10-3", 3, 1, 4, 2, 1, 3, 0, 1, 0, 3, 1, "Remote misty islands with ancient Haida village sites.", 2, "YZP", "A 2h flight to Sandspit, or two days by road and ferry"],
  ["Yukon", "Canada", 21, -13, "N", "", 3, 1, 3, 1, 0, 3, 0, 1, 0, 3, 1, "Northern lights, gold-rush towns and real wilderness.", 1, "YXY", "About 2.5h, direct flights available"],
  ["Greenland", "Greenland", 12, -10, "N", "", 4, 5, 4, 1, 0, 3, 0, 1, 0, 3, 1, "Icebergs the size of buildings drifting past small towns.", 5, "GOH", "3 flights, about 24h"]
];

/* Typical return economy fares from Vancouver in CAD, by tier. Rough estimates: edit freely. */
const FARE_RANGES = ["No flight needed", "$200 to $500", "$450 to $900", "$900 to $1,500", "$1,400 to $2,200", "$2,000 to $3,500"];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const DESTINATIONS = DESTINATION_ROWS.map(function (r) {
  var peak = r[4].length > 1 ? parseInt(r[4].slice(1), 10) : (r[4][0] === "S" ? 1 : 7);
  var wet = [];
  if (r[5]) {
    var p = r[5].split("-").map(Number), m = p[0];
    while (true) { wet.push(m); if (m === p[1]) break; m = m % 12 + 1; }
  }
  return {
    name: r[0], country: r[1], hi: r[2], lo: r[3], peak: peak, wet: wet,
    cost: r[6], far: r[7], remote: r[8],
    history: r[9], beach: r[10], nature: r[11], city: r[12], food: r[13], night: r[14], adventure: r[15],
    crowd: r[16], blurb: r[17], fare: r[18], airport: r[19], journey: r[20],
    slug: r[0].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  };
});

/* Approximate average daytime high for a month (1-12), from the warmest and coolest months. */
function tempIn(d, month) {
  var wave = (1 + Math.cos(2 * Math.PI * (month - d.peak) / 12)) / 2;
  return Math.round(d.lo + (d.hi - d.lo) * wave);
}

/* Link for the result card: Google Flights from Vancouver, or Google Maps directions for drive-to places. */
function travelLink(d) {
  if (d.airport) return { text: "Check flights from Vancouver on Google Flights", url: "https://www.google.com/travel/flights?q=" + encodeURIComponent("Flights to " + d.airport + " from YVR") };
  return { text: "Get directions from Vancouver", url: "https://www.google.com/maps/dir/" + encodeURIComponent("Vancouver, BC") + "/" + encodeURIComponent(d.name + ", " + d.country) };
}

if (typeof module !== "undefined") module.exports = { DESTINATIONS: DESTINATIONS, MONTHS: MONTHS, FARE_RANGES: FARE_RANGES, tempIn: tempIn, travelLink: travelLink };
