const recipes = [
  {
    id: 1,
    name: "Beef Lok Lak",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947",
    time: 20,
    servings: 4,
    difficulty: "Easy",
    ingredients: ["beef", "garlic", "soy sauce", "oyster sauce", "onion", "tomato", "lettuce", "cucumber", "lime", "black pepper", "rice"],
    steps: [
      "Pat the beef dry with paper towels and cut it into bite-sized pieces. Season with soy sauce, oyster sauce, minced garlic, salt, and black pepper. Mix well and marinate for at least 15 minutes.",
      "Heat oil in a large pan over medium-high heat. Add the marinated beef and cook for 2–3 minutes, stirring frequently until the meat develops a nice brown color.",
      "Add sliced onions and tomatoes to the pan. Continue cooking for another 2–3 minutes until the vegetables are slightly softened but still fresh.",
      "Arrange lettuce, cucumber slices, and tomato wedges on a serving plate. Transfer the cooked beef mixture onto the vegetables.",
      "Mix lime juice, salt, and black pepper in a small bowl to make the dipping sauce. Serve the beef hot with steamed rice and the dipping sauce."
    ]
  },

  {
    id: 2,
    name: "French Fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
    time: 15,
    servings: 2,
    difficulty: "Easy",
    ingredients: ["potato", "oil", "salt", "ketchup"],
    steps: [
      "Wash the potatoes thoroughly and cut them into evenly sized strips. Soak them in cold water for 20 minutes to remove excess starch.",
      "Drain the potatoes and dry them completely using paper towels. Removing moisture helps create crispier fries.",
      "Heat oil in a deep pan to 175°C. Carefully add the potatoes in small batches and fry for 4–5 minutes until light golden.",
      "Remove the fries and allow them to rest for 2 minutes. This helps create a fluffy interior.",
      "Fry the potatoes again for another 2–3 minutes until golden brown and crispy. Sprinkle with salt and serve immediately."
    ]
  },

  {
    id: 3,
    name: "Chicken Fried Rice",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
    time: 25,
    servings: 3,
    difficulty: "Easy",
    ingredients: ["rice", "chicken", "egg", "carrot", "peas", "onion", "garlic", "soy sauce", "green onion", "oil"],
    steps: [
      "Heat oil in a wok and cook diced chicken until fully cooked and lightly browned on all sides.",
      "Add garlic, carrots, peas, and onions. Stir-fry for several minutes until the vegetables become tender.",
      "Push the ingredients to one side and scramble the eggs in the empty space of the wok.",
      "Add cooked rice and soy sauce. Stir everything together until the rice is evenly coated with seasoning.",
      "Taste and adjust seasoning if needed. Garnish with green onions and serve hot."
    ]
  },

  {
    id: 4,
    name: "Khmer Sour Soup",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554",
    time: 35,
    servings: 4,
    difficulty: "Medium",
    ingredients: ["fish", "shrimp", "pineapple", "tomato", "morning glory", "tamarind paste", "fish sauce", "sugar", "water", "herbs"],
    steps: [
      "Bring a large pot of water to a gentle boil and add fish pieces or shrimp according to your preference.",
      "Add vegetables such as pineapple, tomatoes, and morning glory. Allow them to cook until tender.",
      "Season the soup with tamarind paste, fish sauce, and a small amount of sugar for balance.",
      "Simmer for 10–15 minutes so the flavors can combine properly.",
      "Serve hot with steamed rice and garnish with fresh herbs if desired."
    ]
  },

  {
    id: 5,
    name: "Pork and Rice",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
    time: 30,
    servings: 2,
    difficulty: "Easy",
    ingredients: ["pork", "rice", "garlic", "soy sauce", "sugar", "black pepper", "cucumber", "egg", "oil"],
    steps: [
      "Slice the pork into thin pieces and marinate with garlic, soy sauce, sugar, and black pepper.",
      "Allow the pork to marinate for at least 20 minutes to absorb the flavors.",
      "Heat a grill pan or skillet and cook the pork until caramelized and fully cooked.",
      "Prepare freshly steamed rice and arrange it on serving plates.",
      "Serve the pork over rice with sliced cucumber and a fried egg if desired."
    ]
  },

  {
    id: 6,
    name: "Pad Thai",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e",
    time: 25,
    servings: 3,
    difficulty: "Medium",
    ingredients: ["rice noodles", "shrimp", "egg", "garlic", "bean sprouts", "pad thai sauce", "peanuts", "lime", "oil"],
    steps: [
      "Soak rice noodles in warm water until soft, then drain and set aside.",
      "Heat oil in a wok and cook shrimp until pink and fully cooked.",
      "Add garlic and vegetables, then stir-fry until fragrant.",
      "Add noodles and Pad Thai sauce, tossing continuously to combine all ingredients evenly.",
      "Top with crushed peanuts, lime wedges, and fresh bean sprouts before serving."
    ]
  },

  {
    id: 7,
    name: "Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    time: 20,
    servings: 2,
    difficulty: "Easy",
    ingredients: ["burger bun", "beef patty", "lettuce", "tomato", "cheese", "salt", "black pepper", "sauce"],
    steps: [
      "Season the burger patties with salt and pepper on both sides.",
      "Cook the patties on a hot grill or skillet until they reach your preferred level of doneness.",
      "Toast the burger buns lightly until golden and slightly crisp.",
      "Layer lettuce, tomato, cheese, and the cooked patty onto the bun.",
      "Add your favorite sauces, cover with the top bun, and serve immediately."
    ]
  },

  {
    id: 8,
    name: "Spaghetti Bolognese",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    time: 35,
    servings: 4,
    difficulty: "Medium",
    ingredients: ["spaghetti", "minced beef", "tomato sauce", "onion", "garlic", "parmesan cheese", "salt", "black pepper", "herbs"],
    steps: [
      "Bring a large pot of salted water to a boil and cook the spaghetti according to package instructions.",
      "In a separate pan, cook minced beef until browned, breaking it apart with a spoon.",
      "Add onions, garlic, and tomato sauce, then simmer for 15 minutes to develop flavor.",
      "Drain the spaghetti and combine it with the meat sauce.",
      "Serve with grated Parmesan cheese and fresh herbs."
    ]
  },

  {
    id: 9,
    name: "Amok Trey",
    image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
    time: 40,
    servings: 4,
    difficulty: "Hard",
    ingredients: ["fish", "kroeung paste", "coconut milk", "egg", "banana leaf", "fish sauce", "sugar", "rice"],
    steps: [
      "Blend kroeung paste ingredients until smooth and fragrant.",
      "Mix the fish with the kroeung paste and coconut milk until evenly coated.",
      "Pour the mixture into banana leaf cups or small bowls.",
      "Steam for approximately 25 minutes until the fish is fully cooked and the custard-like texture forms.",
      "Serve with steamed rice and garnish with coconut cream."
    ]
  },

  {
    id: 10,
    name: "Chicken Curry",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
    time: 45,
    servings: 5,
    difficulty: "Medium",
    ingredients: ["chicken", "curry paste", "coconut milk", "potato", "carrot", "onion", "oil", "rice", "bread"],
    steps: [
      "Heat oil in a large pot and cook curry paste until fragrant.",
      "Add chicken pieces and stir until lightly browned on all sides.",
      "Pour in coconut milk and stir thoroughly to combine.",
      "Add potatoes, carrots, and onions, then simmer until tender.",
      "Serve hot with steamed rice or fresh bread."
    ]
  },

  {
    id: 11,
    name: "Khmer Noodle Soup",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
    time: 50,
    servings: 4,
    difficulty: "Medium",
    ingredients: ["rice noodles", "chicken", "fish sauce", "garlic", "bean sprouts", "green onion", "lime", "water", "herbs"],
    steps: [
      "Prepare the broth by boiling chicken with water, garlic, and a little salt until the meat becomes tender.",
      "Remove the chicken from the pot and shred it into small pieces. Keep the broth warm on low heat.",
      "Cook the rice noodles according to package instructions, then drain and place them into serving bowls.",
      "Add shredded chicken, bean sprouts, green onions, and herbs on top of the noodles.",
      "Pour hot broth into each bowl and season with fish sauce, lime juice, and pepper before serving."
    ]
  },

  {
    id: 12,
    name: "Bai Sach Chrouk",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
    time: 35,
    servings: 2,
    difficulty: "Easy",
    ingredients: ["pork", "rice", "garlic", "soy sauce", "coconut milk", "sugar", "cucumber", "pickled vegetables", "egg"],
    steps: [
      "Slice pork thinly and marinate it with garlic, soy sauce, coconut milk, sugar, and black pepper.",
      "Let the pork rest for at least 20 minutes so the flavor becomes stronger.",
      "Grill or pan-fry the pork until the edges are slightly caramelized and the meat is fully cooked.",
      "Prepare steamed rice and place the cooked pork neatly on top.",
      "Serve with cucumber slices, pickled vegetables, and a fried egg for a complete meal."
    ]
  },

  {
    id: 13,
    name: "Tom Yum Soup",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554",
    time: 30,
    servings: 4,
    difficulty: "Medium",
    ingredients: ["shrimp", "mushroom", "lemongrass", "lime", "chili", "fish sauce", "tomato", "water", "herbs"],
    steps: [
      "Bring water to a boil and add lemongrass, chili, and herbs to create a fragrant soup base.",
      "Add shrimp and mushrooms, then cook until the shrimp turns pink.",
      "Add tomatoes and let them soften slightly in the broth.",
      "Season with fish sauce and lime juice until the soup tastes sour, salty, and slightly spicy.",
      "Serve hot with steamed rice or eat it as a light soup."
    ]
  },

  {
    id: 14,
    name: "Garlic Butter Shrimp",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47",
    time: 20,
    servings: 3,
    difficulty: "Easy",
    ingredients: ["shrimp", "garlic", "butter", "lemon", "salt", "black pepper", "parsley", "oil"],
    steps: [
      "Clean the shrimp and pat them dry with paper towels so they cook evenly.",
      "Heat oil and butter in a pan over medium heat until the butter melts.",
      "Add minced garlic and stir for a few seconds until fragrant, but do not let it burn.",
      "Add the shrimp and cook for 2–3 minutes on each side until they turn pink.",
      "Season with salt, pepper, lemon juice, and parsley before serving."
    ]
  },

  {
    id: 15,
    name: "Vegetable Stir Fry",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    time: 20,
    servings: 3,
    difficulty: "Easy",
    ingredients: ["broccoli", "carrot", "bell pepper", "garlic", "soy sauce", "oil", "onion", "mushroom"],
    steps: [
      "Wash and cut all vegetables into similar sizes so they cook evenly.",
      "Heat oil in a wok or large pan over medium-high heat.",
      "Add garlic and onion, then stir-fry until fragrant.",
      "Add the harder vegetables first, such as carrots and broccoli, then add softer vegetables later.",
      "Season with soy sauce, stir well, and serve while the vegetables are still slightly crunchy."
    ]
  },

  {
    id: 16,
    name: "Egg Fried Noodles",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841",
    time: 20,
    servings: 2,
    difficulty: "Easy",
    ingredients: ["noodles", "egg", "garlic", "soy sauce", "cabbage", "carrot", "oil", "green onion"],
    steps: [
      "Boil the noodles until just soft, then drain and set them aside.",
      "Heat oil in a pan and scramble the eggs until lightly cooked.",
      "Add garlic, cabbage, and carrot, then stir-fry until the vegetables become tender.",
      "Add the noodles and soy sauce, mixing everything until evenly combined.",
      "Top with green onions and serve hot."
    ]
  },

  {
    id: 17,
    name: "Chicken Sandwich",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af",
    time: 15,
    servings: 2,
    difficulty: "Easy",
    ingredients: ["bread", "chicken", "lettuce", "tomato", "mayonnaise", "cheese", "salt", "black pepper"],
    steps: [
      "Cook or reheat chicken until it is warm and fully cooked.",
      "Toast the bread slices until they are slightly crispy.",
      "Spread mayonnaise on each slice of bread.",
      "Add lettuce, tomato, cheese, and chicken between the bread slices.",
      "Cut the sandwich in half and serve immediately."
    ]
  },

  {
    id: 18,
    name: "Khmer Mango Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    time: 15,
    servings: 2,
    difficulty: "Easy",
    ingredients: ["green mango", "carrot", "fish sauce", "lime", "sugar", "chili", "peanuts", "herbs"],
    steps: [
      "Peel and shred the green mango and carrot into thin strips.",
      "In a small bowl, mix fish sauce, lime juice, sugar, and chili to make the dressing.",
      "Place the mango and carrot into a large mixing bowl.",
      "Pour the dressing over the salad and toss everything together gently.",
      "Top with crushed peanuts and fresh herbs before serving."
    ]
  },

  {
    id: 19,
    name: "Chicken Soup",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554",
    time: 35,
    servings: 4,
    difficulty: "Easy",
    ingredients: ["chicken", "carrot", "potato", "onion", "garlic", "water", "salt", "black pepper", "green onion"],
    steps: [
      "Place chicken pieces into a pot with water and bring it to a boil.",
      "Skim off any foam from the surface to keep the soup clear.",
      "Add carrots, potatoes, onions, and garlic, then simmer until the vegetables are soft.",
      "Season with salt and black pepper according to taste.",
      "Garnish with green onions and serve hot."
    ]
  },

  {
    id: 20,
    name: "Banana Pancakes",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
    time: 20,
    servings: 2,
    difficulty: "Easy",
    ingredients: ["banana", "egg", "flour", "milk", "sugar", "butter", "honey"],
    steps: [
      "Mash the banana in a bowl until smooth.",
      "Add eggs, flour, milk, and sugar, then mix until a thick batter forms.",
      "Heat butter in a pan over medium heat.",
      "Pour small amounts of batter into the pan and cook until bubbles appear on the surface.",
      "Flip the pancakes and cook the other side until golden. Serve with honey or syrup."
    ]
  }
];

export default recipes;