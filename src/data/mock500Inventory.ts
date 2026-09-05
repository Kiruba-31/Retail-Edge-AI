// Realistic Product Catalog for 500 SKUs across Aisles A to H
const REAL_PRODUCTS_DATA: Record<string, string[]> = {
  Vegetables: [
    "Country Red Tomatoes (1 kg)", "Hybrid Organic Red Onions (1 kg)", "Farm Fresh Russet Potatoes (2 kg)",
    "Tender Palak Spinach (Bunch)", "Organic Baby Carrots (500g)", "Crisp Green Capsicum (500g)",
    "White Button Mushrooms (200g)", "English Sliced Cucumbers (500g)", "Fresh Snowball Cauliflower (1 pc)",
    "Green Cabbage (1 pc)", "Raw Ginger & Garlic Combo (250g)", "Fresh Mint & Coriander Bunch",
    "Tender Lady's Finger / Okra (500g)", "Long Green Bottle Gourd (1 pc)", "Small Bitter Gourd (500g)",
    "Crisp Iceberg Lettuce (1 pc)", "Purple Brinjal / Eggplant (500g)", "Fresh Green Peas (500g)",
    "Beetroot Pack (500g)", "Sweet Corn Cobs (Pack of 2)", "Fresh French Beans (250g)",
    "Red Radish Bunch", "Yellow Bell Peppers (500g)", "Red Bell Peppers (500g)",
    "Broccoli Crown (1 pc)", "Fresh Curry Leaves (100g)", "Green Chillies Pack (200g)",
    "Raw Green Banana (Pack of 3)", "Snake Gourd (500g)", "Ridge Gourd (500g)",
    "Drumsticks / Moringa (Pack of 4)", "Ash Gourd Slices (500g)", "Sweet Potatoes (1 kg)",
    "Colocasia / Arbi (500g)", "Fresh Fenugreek / Methi (Bunch)", "Spring Onions (Bunch)",
    "Zucchini Green (500g)", "Zucchini Yellow (500g)", "Cherry Tomatoes (250g)",
    "Baby Corn Pack (200g)", "Chinese Cabbage (1 pc)", "Celery Sticks (250g)",
    "Fresh Lemons (Pack of 6)", "Raw Turmeric Root (200g)", "Shallots / Sambar Onions (500g)",
    "Kohlrabi / Knol Khol (500g)", "Green Plantain / Raw Cooking Banana", "Fresh Dill Leaves (Bunch)",
    "Elephant Foot Yam (500g)", "Ivy Gourd / Tindora (250g)", "Chow Chow / Chayote (1 pc)",
    "Turnip White (500g)", "Raw Papaya for Cooking (1 pc)", "Cluster Beans / Gawar (250g)",
    "Cowpea / Lobia Pods (250g)", "Spotted Pointed Gourd / Parwal (250g)", "Fresh Basil Leaves (100g)",
    "Rosemary Fresh Herb Pack (50g)", "Thyme Fresh Herb Pack (50g)", "Oregano Fresh Herb Pack (50g)",
    "Red Cabbage (1 pc)", "Green Asparagus Spears (200g)", "Avocado Indian (1 pc)",
    "Imported Hass Avocado (1 pc)", "Shiitake Mushrooms (150g)"
  ],

  Fruits: [
    "Royal Gala Apples (1 kg)", "Robusta Cavendish Bananas (1 Dozen)", "Sweet Valencia Oranges (1 kg)",
    "Red Globe Seedless Grapes (500g)", "Semi-Ripe Honey Papaya (1 pc)", "Alphonso Mangoes (Box of 6)",
    "Kesar Premium Mangoes (1 kg)", "Banganapalli Mangoes (1 kg)", "Kashmir Golden Delicious Apples (1 kg)",
    "Washington Red Delicious Apples (1 kg)", "Green Granny Smith Apples (1 kg)", "Nagpur Sweet Mandarins (1 kg)",
    "Kinnow Oranges (1 kg)", "Ruby Red Pomegranate (Pack of 4)", "Sweet Pineapple (1 pc)",
    "Fresh Green Coconut (1 pc)", "Yelakki Small Bananas (1 Dozen)", "Red Banana Organic (Pack of 4)",
    "Imported Kiwi Fruit (Pack of 3)", "Crisp Asian Brown Pears (500g)", "Green Indian Pears (1 kg)",
    "Sweet Chikoo / Sapota (1 kg)", "Fresh Guava White Flesh (1 kg)", "Pink Guava (1 kg)",
    "Sweet Green Seedless Grapes (500g)", "Black Seedless Grapes (500g)", "Imported Blueberries (125g)",
    "Fresh Strawberries (200g)", "Raspberries Fresh Box (125g)", "Blackberries Fresh Box (125g)",
    "Dragon Fruit Red Flesh (1 pc)", "Dragon Fruit White Flesh (1 pc)", "Ripe Watermelon Striped (1 pc)",
    "Kiran Watermelon (1 pc)", "Sweet Musk Melon / Cantaloupe (1 pc)", "Honeydew Green Melon (1 pc)",
    "Thai Fresh Custard Apple (1 kg)", "Sweet Passion Fruit (Pack of 4)", "Mangosteen Pack (250g)",
    "Rambutan Fresh Box (200g)", "Sweet Tamarind Box (250g)", "Grapefruit Pink (Pack of 2)",
    "Fresh Figs / Anjeer (250g)", "Plums Red Sweet (500g)", "Imported Sweet Cherries (250g)",
    "Peaches Imported (500g)", "Apricots Fresh (250g)", "Lychee Fresh Bunch (500g)",
    "Star Fruit (Pack of 3)", "Cape Gooseberries / Rasbhari (100g)", "Wood Apple / Bael (1 pc)",
    "Jambul / Black Plum (250g)", "Amla / Indian Gooseberry (500g)", "Mulberries Fresh (100g)",
    "Persimmon Sweet (Pack of 2)", "Pomelo Citrus (1 pc)", "Longan Fresh Box (250g)",
    "Medjool Fresh Dates (500g)", "Kimia Iranian Soft Dates (500g)", "Dry Coconut / Copra (1 pc)",
    "Tender Coconut Water Ready Cup", "Valencia Juicing Oranges (2 kg)", "Mini Watermelon (1 pc)",
    "Baby Pineapples (Pack of 2)", "Sweet Green Sweet Lime / Mosambi (1 kg)"
  ],

  Bakeries: [
    "Britannia 100% Whole Wheat Bread (400g)", "Modern Multigrain Sandwich Bread (400g)", "English Oven Milk Bread (400g)",
    "Butter Brioche Burger Buns (Pack of 4)", "Garlic Herb French Baguette (250g)", "Traditional Sourdough Artisan Loaf (400g)",
    "Harvest Gold Brown Bread (400g)", "Garlic Breadsticks with Herb Butter (150g)", "Focaccia Bread with Olives & Rosemary",
    "Sweet Cinnamon Buns (Pack of 2)", "Chocolate Croissant Pastry (Pack of 2)", "Butter Croissant French Style (Pack of 2)",
    "Vanilla Sponge Tea Cake (250g)", "Rich Fruit & Nut Plum Cake (350g)", "Blueberry Muffins (Pack of 2)",
    "Double Choco-Chip Muffins (Pack of 2)", "Pita Bread White Pocket (Pack of 4)", "Whole Wheat Pita Pockets (Pack of 4)",
    "Thin Crust Pizza Base 8-inch (Pack of 2)", "Whole Wheat Pizza Base (Pack of 2)", "Pav Buns for Vada Pav (Pack of 6)",
    "Sweet Fruit Bun with Tutti Frutti (Pack of 2)", "Dinner Rolls White Butter (Pack of 6)", "Brioche Hot Dog Rolls (Pack of 4)",
    "Crisp Baked Garlic Toasties (150g)", "Multigrain Panini Loaf (300g)", "Ciabatta Italian Bread (250g)",
    "Almond Biscotti Coffee Crunch (150g)", "Walnut Banana Loaf (250g)", "Eggless Red Velvet Cupcakes (Pack of 2)",
    "Belgian Dark Chocolate Brownie (Pack of 2)", "Cream Cheese Danish Pastry (1 pc)", "Apple Cinnamon Pie (Slice)",
    "Nutty Granola Energy Loaf (300g)", "Gluten-Free Almond Bread (350g)", "Keto Low-Carb Coconut Bread (300g)",
    "Rusk Toast Crispy Suji (300g)", "Britannia Premium Bake Rusk (400g)", "Butter Milk Rusks with Cardamom (200g)",
    "French Toast Sliced Brioche (350g)", "Cheese Garlic Pull-Apart Loaf (250g)", "Rye Sourdough German Loaf (400g)",
    "Sesame Bagels (Pack of 2)", "Plain New York Bagels (Pack of 2)", "Multigrain Bagels (Pack of 2)",
    "Lavash Crispy Herb Flatbread (150g)", "Breadcrumbs Golden Crispy (200g)", "Panko Japanese Breadcrumbs (200g)",
    "Choco Chip Cookies Tin (300g)", "Butter Pista Cookies (250g)", "Oatmeal Raisin Cookies (200g)",
    "Coconut Crunch Macaroons (150g)", "Sugar-Free Multigrain Biscuits (200g)", "Jeera Salty Tea Biscuits (250g)",
    "Cashew Butter Cookies (200g)", "Cheese Straws Puff Pastry (150g)", "Khari Puff Biscuits Plain (200g)",
    "Methi Khari Puff Biscuits (200g)", "Chocolate Swiss Roll (150g)", "Vanilla Swiss Roll (150g)"
  ],

  "Juices & Beverages": [
    "Real Fruit Power 100% Orange Juice (1L)", "Tropicana 100% Mixed Fruit Juice (1L)", "Real Pomegranate Nectar Juice (1L)",
    "Tropicana Apple Juice Delight (1L)", "Raw Pressery Cold Pressed Guava (250ml)", "Raw Pressery Valencia Orange (250ml)",
    "Raw Pressery Cold Pressed Sugarcane Juice", "Tender Coconut Water Bottle (200ml)", "Paper Boat Aam Panna Drink (250ml)",
    "Paper Boat Jaljeera Spice Drink (250ml)", "Paper Boat Alphonso Aamras (250ml)", "Frooti Fresh Mango Drink (1L)",
    "Maaza Mango Pulp Juice (1.2L)", "Slice Mango Nectar Drink (1.2L)", "Minute Maid Pulpy Orange (1L)",
    "Amul Kool Kesar Flavoured Milk (200ml)", "Amul Kool Rose Flavoured Milk (200ml)", "Amul Kool Chocolate Milk (200ml)",
    "Hershey's Milkshake Chocolate (200ml)", "Hershey's Milkshake Strawberry (200ml)", "Cavins Chocolate Milkshake (200ml)",
    "Cavins Vanilla Milkshake (200ml)", "Nescafe Cold Coffee Can (250ml)", "Sleepy Owl Cold Brew Iced Coffee (250ml)",
    "Red Bull Energy Drink Can (250ml)", "Monster Energy Ultra Zero Can (350ml)", "Sting Energy Drink (250ml)",
    "Ocean Fruit Water Peach & Passion (500ml)", "Ocean Fruit Water Crispy Apple (500ml)", "Tata Gluco Plus Orange Drink (200ml)",
    "Coca-Cola Original Taste Can (330ml)", "Diet Coke Zero Sugar Can (300ml)", "Coca-Cola Zero Sugar Bottle (750ml)",
    "Pepsi Black Zero Calories Can (330ml)", "Sprite Lemon Lime Soda (750ml)", "Thums Up Charged Cola (750ml)",
    "Limca Lemon Fizzy Drink (750ml)", "Fanta Orange Sparkling Drink (750ml)", "7UP Nimbooz Masala Soda (250ml)",
    "Schweppes Tonic Water Can (300ml)", "Schweppes Ginger Ale Can (300ml)", "Schweppes Club Soda (750ml)",
    "Kinley Sparkling Soda Water (750ml)", "Bisleri Mineral Water Bottle (1L)", "Aquafina Pure Water Bottle (1L)",
    "Himalayan Natural Mineral Water (1L)", "Lipton Green Tea Lemon Zest (250ml)", "Arizona Iced Tea Green Tea & Honey (500ml)",
    "Nestea Lemon Iced Tea Tetrapak (1L)", "Chaayos Masala Chai Premix Cup", "Girnar Detox Green Tea Ready Mix (10pk)",
    "Yakult Probiotic Fermented Drink (5pk)", "Yakult Light Probiotic Drink (5pk)", "Epigamia Greek Yogurt Smoothie Mango",
    "Epigamia Strawberry Smoothie Bottle", "Sula Non-Alcoholic Grape Drink (750ml)", "Appy Fizz Sparkling Apple Juice (600ml)",
    "B Natural Cranberry Juice Delight (1L)", "B Natural Guava Juice Tetra (1L)", "B Natural Litchi Juice (1L)",
    "AloFrut Aloe Vera Mango Juice (300ml)", "AloFrut Aloe Vera Kiwi Juice (300ml)", "Storia 100% Tender Coconut Water (1L)",
    "Paper Boat Coconut Water Bottle (200ml)", "Gatorade Blue Bolt Electrolyte (500ml)"
  ],

  "Snacks & Packaged Foods": [
    "Lay's Classic Salted Potato Chips (100g)", "Lay's India's Magic Masala Chips (100g)", "Lay's American Style Cream & Onion (100g)",
    "Lay's Spanish Tomato Tango Chips (100g)", "Pringles Original Potato Crisps (107g)", "Pringles Sour Cream & Onion (107g)",
    "Pringles Cheesy Cheese Crisps (107g)", "Doritos Nacho Cheese Tortilla Chips (150g)", "Doritos Sweet Chilli Tortilla Chips (150g)",
    "Kurkure Masala Munch Crispy Puffs (90g)", "Kurkure Green Chutney Style (90g)", "Bingo! Mad Angles Achaari Masti (130g)",
    "Bingo! Tedhe Medhe Masala Tadka (90g)", "Haldiram's Bhujia Sev Namkeen (400g)", "Haldiram's Aloo Bhujia Namkeen (400g)",
    "Haldiram's All-in-One Mixture (400g)", "Haldiram's Khatta Meetha Mixture (400g)", "Haldiram's Moong Dal Fried Snack (200g)",
    "Haldiram's Salted Roasted Cashews (150g)", "Haldiram's Peri Peri Roasted Almonds (150g)", "Bikaji Subkuch All-in-One Namkeen (400g)",
    "Maggi 2-Minute Masala Noodles (4-pack)", "Maggi Special Masala Spicy Noodles (4-pack)", "Yippee! Magic Masala Noodles (4-pack)",
    "Knorr Soupy Mast Masala Noodles (4-pack)", "Nissin Top Ramen Curry Noodles (4-pack)", "Ching's Secret Schezwan Instant Noodles",
    "Bamy Korean Spicy 2X Hot Ramen Pack", "Nongshim Shin Ramyun Gourmet Spicy (120g)", "Wai Wai Ready to Eat Chicken Noodles",
    "Knorr Classic Mixed Vegetable Soup (4pk)", "Knorr Sweet Corn Chicken Soup (4pk)", "Knorr Tomato Herb Soup (4pk)",
    "Oreo Original Vanilla Cream Biscuits (120g)", "Oreo Chocolate Cream Sandwich Biscuits (120g)", "Bourbon Chocolate Sandwich Biscuits (150g)",
    "Hide & Seek Chocolate Chip Cookies (120g)", "Parle-G Gold Glucose Biscuits (1 kg)", "Britannia Good Day Butter Cookies (200g)",
    "Britannia Good Day Cashew Cookies (200g)", "Britannia Treat Jim Jam Cream Biscuits", "Sunfeast Dark Fantasy Choco Fills (300g)",
    "Cadbury Dairy Milk Silk Chocolate (150g)", "Cadbury Dairy Milk Fruit & Nut (150g)", "Cadbury Dairy Milk Roast Almond (150g)",
    "KitKat 4-Finger Crisp Wafer Bar (38g)", "Snickers Peanut Caramel Chocolate Bar (45g)", "Nestle Munch Crisp Crunch Bar (32g)",
    "Ferrero Rocher Hazelnut Chocolate (Box of 16)", "Amul Dark Chocolate 75% Cocoa (150g)", "Lindt Excellence 85% Dark Cocoa Bar",
    "Nutella Hazelnut Cocoa Spread (350g)", "Skippy Creamy Peanut Butter (462g)", "Pintola All-Natural Peanut Butter (1 kg)",
    "Kellogg's Corn Flakes Original (500g)", "Kellogg's Chocos Chocolate Cereal (375g)", "Quaker Rolled Oats Wholegrain (1 kg)",
    "Saffola Masala Oats Veggie Twist (500g)", "Kellogg's Crunchy Muesli Fruit & Nut (750g)", "Act II Butter Lovers Microwave Popcorn",
    "Act II Golden Sizzle Popcorn Pack (150g)", "Urban Platter Roasted Peri Peri Makhana", "Too Yumm! Multigrain Veggie Stix (75g)"
  ],

  "Groceries & Staples": [
    "India Gate Classic Aged Basmati Rice (5 kg)", "Daawat Rozana Gold Basmati Rice (5 kg)", "Fortune Everyday Full-Grain Basmati Rice",
    "Aashirvaad Superior MP Sharbati Whole Wheat Atta (5 kg)", "Fortune Chakki Fresh Whole Wheat Atta (5 kg)", "Pillsbury Chakki Fresh Atta (5 kg)",
    "Tata Sampann Unpolished Toor / Arhar Dal (1 kg)", "Tata Sampann Moong Dal Split (1 kg)", "Tata Sampann Chana Dal (1 kg)",
    "Organic Kabuli Chana / Big Chickpeas (1 kg)", "Tata Sampann Rajma Red Kidney Beans (1 kg)", "Black Urad Dal Whole for Dal Makhani (1 kg)",
    "Fortune Sunlite Refined Sunflower Oil (1L Pouch)", "Saffola Gold Pro Healthy Blend Cooking Oil (1L)", "Fortune Kachi Ghani Mustard Oil (1L Bottle)",
    "Dhara Cold Pressed Groundnut / Peanut Oil (1L)", "Borges Extra Virgin Olive Oil for Salads (1L)", "Figaro Pure Olive Cooking Oil Tin (1L)",
    "Tata Iodized Vacuum Evaporated Salt (1 kg)", "Tata Rock Salt / Pink Himalayan Salt (1 kg)", "Madhur Pure & Hygienic Refined Sugar (1 kg)",
    "Trust Classic Sulphur-Free White Sugar (1 kg)", "Organic Certified Jaggery / Gur Powder (1 kg)", "Catch Turmeric / Haldi Powder Pack (500g)",
    "Catch Kashmiri Red Chilli Powder (500g)", "Catch Coriander / Dhaniya Powder (500g)", "MDH Kitchen King All-Purpose Masala (100g)",
    "MDH Garam Masala Powder (100g)", "MDH Chana Masala Spice Mix (100g)", "MDH Sambhar Masala Powder (100g)",
    "Everest Pav Bhaji Masala (100g)", "Everest Biryani Masala Spice Blend (100g)", "Everest Chaat Masala Powder (100g)",
    "Tata Sampann Whole Black Pepper / Kali Mirch (100g)", "Tata Sampann Green Cardamom / Elaichi (50g)", "Tata Sampann Cloves / Laung (50g)",
    "Tata Sampann Cinnamon Sticks / Dalchini (50g)", "Nutraj California Raw Whole Almonds (500g)", "Nutraj Whole Premium Cashew Nuts (500g)",
    "Nutraj Golden Long Raisins / Kishmish (500g)", "Nutraj Whole Walnut Kernels (250g)", "Nutraj California Roasted Pistachios (250g)",
    "Samyang Red Chilli Paste / Gochujang (200g)", "Kikkoman Naturally Brewed Soy Sauce (150ml)", "Ching's Secret Dark Soy Sauce (200g)",
    "Ching's Secret Green Chilli Sauce (200g)", "Ching's Secret Schezwan Stir Fry Chutney (250g)", "Kissan Fresh Tomato Ketchup Bottle (1 kg)",
    "Maggi Rich Tomato Ketchup Squeezy (1 kg)", "Veeba Truly Tomato Ketchup (900g)", "Veeba Classic Mayonnaise Eggless (250g)",
    "Dr. Oetker FunFoods Burger Mayonnaise (250g)", "Veeba Thousand Island Salad Dressing (300g)", "Kissan Mixed Fruit Jam Glass Jar (500g)",
    "Mother's Recipe Mango Pickle Jar (400g)", "Mother's Recipe Mixed Pickle (400g)", "Priya Andhra Style Avakaya Pickle (300g)"
  ],

  "Dairy & Chilled": [
    "Amul Taaza Homogenised Toned Milk (1L)", "Amul Gold Full Cream Fresh Milk (1L)", "Mother Dairy Full Cream Milk (1L)",
    "Nestle Everyday Dairy Whitener Milk Powder (1 kg)", "Amul Salted Pasteurized Table Butter (500g)", "Amul Unsalted White Cooking Butter (500g)",
    "Britannia Delicious Salted Table Butter (500g)", "Nutralite DoodhShakti Probiotic Butter (500g)", "Amul Pure Cow Desi Ghee Tin (1L)",
    "Mother Dairy Pure Buffalo Ghee (1L)", "Aashirvaad Svasti Pure Cow Ghee (1L)", "Amul Fresh Malai Paneer Block (200g)",
    "Mother Dairy Classic Soft Paneer (200g)", "Milky Mist Fresh Paneer Premium Block (200g)", "Amul Processed Cheese Block (500g)",
    "Amul Processed Cheese Slices (10 Slices - 200g)", "Britannia Cheezza Mozzarella Pizza Cheese (200g)", "Amul Diced Mozzarella Blend Cheese (200g)",
    "Go Cheese Processed Cheese Cubes (200g)", "D'lecta Cream Cheese Tub for Baking (200g)", "Amul Fresh Cream 25% Milk Fat (250ml)",
    "Nestle Milkmaid Sweetened Condensed Milk (400g)", "Amul Masti Dahi Fresh Curd Tub (400g)", "Mother Dairy Classic Dahi Tub (400g)",
    "Milky Mist Greek Yogurt Natural Unsweetened (400g)", "Epigamia Greek Yogurt Natural Unsweetened (100g)", "Epigamia Greek Yogurt Alphonso Mango (100g)",
    "Epigamia Greek Yogurt Wild Blueberry (100g)", "Amul Masti Spiced Buttermilk Pouch (200ml)", "Mother Dairy Masala Chaach (200ml)",
    "ID Fresh Ready Idli & Dosa Batter (1 kg)", "ID Natural Malabar Parota (Pack of 5 - 400g)", "ID Whole Wheat Homestyle Parathas (Pack of 5)",
    "McCain French Fries Classic Salted (420g)", "McCain Smiles Crispy Mashed Potatoes (375g)", "McCain Aloo Tikki Classic Crisps (400g)",
    "McCain Veggie Burger Patties (360g)", "Sumeru Green Peas Frozen Pack (500g)", "Sumeru Sweet Corn Frozen Pack (500g)",
    "Sumeru Frozen Mixed Vegetables (500g)", "Godrej Yummiez Chicken Nuggets (500g)", "Godrej Yummiez Crispy Chicken Fries (400g)",
    "Venky's Chicken Sausages with Herbs (500g)", "Zorabian Fresh Chicken Breast Boneless (500g)", "Farm Fresh Brown Organic Eggs (Pack of 6)",
    "Farm Fresh White Table Eggs (Pack of 30 Tray)", "Suguna Probiotic Enrich White Eggs (Pack of 6)", "Eggoz Nutra Plus Brown Eggs (Pack of 10)",
    "Tofu Organic Soya Paneer Block (200g)", "Silk Unsweetened Almond Milk (1L)", "So Good Soy Milk Vanilla Flavour (1L)",
    "Oatly Barista Edition Oat Milk (1L)", "Milky Mist Desi White Butter Cubes (200g)", "Amul Salted Masti Butter Spread (100g)",
    "Britannia Pure Cow Ghee Pouch (1L)", "Patanjali Cow Ghee Tin (1L)", "Nestle A+ Slim Skimmed Milk (1L)",
    "Amul Sugar Free Ice Cream Vanilla (500ml)", "Kwality Walls Cornetto Double Chocolate (105ml)", "Amul Epic Belgian Chocolate Chocobar (80ml)"
  ],

  "Household & Cleaning": [
    "Vim Dishwash Gel Lemon Active (750ml)", "Pril Lime Active Grease Cutting Gel (750ml)", "Vim Dishwash Bar with Polycoat (300g)",
    "Surf Excel Matic Front Load Liquid Detergent (1L)", "Surf Excel Matic Top Load Liquid Detergent (1L)", "Ariel Matic 3-in-1 Detergent Pods (18pk)",
    "Ariel Matic Top Load Washing Powder (2 kg)", "Tide Plus Double Power Detergent Powder (2 kg)", "Comfort After Wash Morning Fresh Fabric Conditioner (860ml)",
    "Comfort Blue Fabric Softener Bottle (1L)", "Harpic Power Plus Original Toilet Cleaner (1L)", "Harpic Disinfectant Bathroom Cleaner Citrus (1L)",
    "Lizol Disinfectant Surface Floor Cleaner Citrus (1L)", "Lizol Floral Floor Cleaner Disinfectant (1L)", "Dettol Antiseptic Liquid for First Aid (1L)",
    "Savlon Antiseptic Disinfectant Liquid (1L)", "Colin Glass & Surface Cleaner Spray (500ml)", "Mr Muscle Kitchen Cleaner Deep Action (500ml)",
    "Dettol Original Liquid Handwash Refill (750ml)", "Lifebuoy Total 10 Handwash Pump (200ml)", "Godrej Protekt Germ Protection Handwash (750ml)",
    "Dettol Original Bathing Soap Bar (Pack of 4)", "Dove Cream Beauty Bathing Bar (Pack of 3)", "Pears Pure & Gentle Glycerin Soap (Pack of 3)",
    "Origami Soft 3-Ply Toilet Tissue Rolls (Pack of 4)", "Origami 2-Ply Kitchen Paper Towel Rolls (Twin Pack)", "Premier Face Tissues Box Soft White (200 pulls)",
    "Scotch-Brite Sponge Scrubbers for Utensils (Pack of 3)", "Scotch-Brite Heavy Duty Scrub Pad (Pack of 5)", "Scotch-Brite Stainless Steel Scrubber (Pack of 2)",
    "Gala Dustpan with Hand Broom Set", "Gala King Kong Microfiber Floor Wiper Mop", "Gala Quick Spin Mop with Bucket & Wheels",
    "GoodKnight Gold Flash Liquid Mosquito Vaporizer (45ml)", "All Out Ultra Power+ Mosquito Refill (45ml)", "HIT Mosquito & Fly Spray Aerosol Can (400ml)",
    "HIT Cockroach Control Spray with Deep Reach Nozzle (400ml)", "Odonil Room Air Freshener Lavender Block (50g)", "Godrej Aer Pocket Bathroom Fragrance Gel (Pack of 3)",
    "Godrej Aer Click Car Vent Air Freshener", "Ambipur Air Effects Spray Lavender Vanilla (275g)", "Duracell Ultra Alkaline AA Batteries (Pack of 4)",
    "Duracell Ultra Alkaline AAA Batteries (Pack of 4)", "Eveready Heavy Duty 9V Transistor Battery", "Hindalco Freshwrap Heavy Aluminium Kitchen Foil (18m)",
    "Glad Cling Wrap Food Preservation Film (30m)", "Oddy Uniwraps Non-Stick Baking & Wrapping Paper", "Shalimar Oxo-Biodegradable Garbage Bags Medium (30 bags)",
    "Shalimar Heavy Duty Black Garbage Bags Large (15 bags)", "Colgate Total 12 Whole Mouth Health Toothpaste (150g)", "Sensodyne Fresh Mint Sensitive Toothpaste (150g)",
    "Oral-B Pro-Health Soft Bristles Toothbrush (Pack of 4)", "Listerine Cool Mint Mouthwash (500ml)", "Head & Shoulders Anti-Dandruff Smooth Shampoo (650ml)",
    "Dove Intense Damage Repair Hair Conditioner (180ml)", "Nivea Soft Light Moisturizing Cream (200ml)", "Vaseline Intensive Care Deep Moisture Body Lotion (400ml)",
    "Gillette Mach3 Turbo Razor Blades (Pack of 4)", "Dettol Multi-Purpose Disinfectant Wet Wipes (80 pulls)", "Diversey Suma Scale Kitchen Descaling Liquid (1L)"
  ]
};

// Generator that accurately assigns real names, bays A01-H15, expected, and detected units
export function generate500Products() {
  const products: any[] = [];
  let skuCounter = 1;

  const categoryAisles: Record<string, { aisle: string, bayPrefix: string }> = {
    Vegetables: { aisle: 'Aisle A', bayPrefix: 'A' },
    Fruits: { aisle: 'Aisle B', bayPrefix: 'B' },
    Bakeries: { aisle: 'Aisle C', bayPrefix: 'C' },
    "Juices & Beverages": { aisle: 'Aisle D', bayPrefix: 'D' },
    "Snacks & Packaged Foods": { aisle: 'Aisle E', bayPrefix: 'E' },
    "Groceries & Staples": { aisle: 'Aisle F', bayPrefix: 'F' },
    "Dairy & Chilled": { aisle: 'Aisle G', bayPrefix: 'G' },
    "Household & Cleaning": { aisle: 'Aisle H', bayPrefix: 'H' }
  };

  Object.keys(REAL_PRODUCTS_DATA).forEach((catName) => {
    const itemsList = REAL_PRODUCTS_DATA[catName];
    const { aisle, bayPrefix } = categoryAisles[catName];

    itemsList.forEach((productName, index) => {
      const skuStr = `SKU-${String(skuCounter).padStart(3, '0')}`;
      const bayNumber = (index % 15) + 1;
      const bayStr = `${bayPrefix}${String(bayNumber).padStart(2, '0')}`;
      
      const expected = Math.floor(Math.random() * 15) + 20; // 20 to 35 expected units
      let detected = expected;
      let status = 'Optimal';

      if (skuCounter % 17 === 0) {
        detected = 0;
        status = 'Out of Stock';
      } else if (skuCounter % 7 === 0) {
        detected = Math.floor(expected * 0.18); // ~4 units
        status = 'Low Stock';
      } else if (skuCounter % 23 === 0) {
        detected = expected - 4;
        status = 'Planogram Issues';
      } else {
        detected = expected - Math.floor(Math.random() * 2);
      }

      const fillPercent = Math.round((detected / expected) * 100);

      products.push({
        id: skuCounter,
        sku: skuStr,
        name: productName,
        category: catName,
        aisle: aisle,
        bay: bayStr,
        expected: expected,
        detected: detected,
        fill: fillPercent,
        status: status
      });

      skuCounter++;
    });
  });

  return products;
}
