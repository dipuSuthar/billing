const ItemMaster = [
  // Beds
  { name: "Double Bed (King Size)", rate: 25000, measure: "nos" },
  { name: "Double Bed (Queen Size)", rate: 20000, measure: "nos" },
  { name: "Single Bed", rate: 15000, measure: "nos" },

  // Wardrobes
  { name: "Wardrobe ", rate: 450, measure: "sqft" },

  // TV Units
  { name: "TV Unit (Wall Mounted)", rate: 12000, measure: "nos" },
  { name: "TV Unit (Cabinet)", rate: 18000, measure: "nos" },
  { name: "TV Unit – Laminate Finish", rate: 1500, measure: "sqft" },
  { name: "TV Unit – Veneer Finish", rate: 2200, measure: "sqft" },

  // Kitchen Materials & Hardware
  { name: "Kitchen Cabinet (Laminate Finish)", rate: 1500, measure: "sqft" },
  { name: "Kitchen Cabinet (Veneer Finish)", rate: 2200, measure: "sqft" },
  { name: "Kitchen Tandom Channel (Soft Close)", rate: 1600, measure: "nos" },
  { name: "Kitchen Tandom Channel (Hettich/Blum)", rate: 2500, measure: "nos" },
  { name: "Telescope Channel (Simple)", rate: 250, measure: "nos" },
  { name: "Telescope Channel (Heavy Duty)", rate: 550, measure: "nos" },

  // Doors & Frames
  { name: "Door (Wooden)", rate: 9000, measure: "nos" },
  { name: "Door – Laminate Finish", rate: 2000, measure: "sqft" },
  { name: "Door – Veneer Polish Finish", rate: 2800, measure: "sqft" },
  { name: "Safety Door", rate: 15000, measure: "nos" },
  { name: "Door Frame (Wooden)", rate: 6000, measure: "nos" },

  // Panels & Finishes
  { name: "Laminate Sheet (1mm)", rate: 900, measure: "sheet" },
  { name: "Laminate Sheet (0.8mm)", rate: 700, measure: "sheet" },
  { name: "Veneer Sheet", rate: 1500, measure: "sheet" },
  { name: "Wooden Paneling", rate: 1200, measure: "sqft" },
  { name: "Wall Panel (PVC)", rate: 900, measure: "sqft" },

  // Ceilings
  { name: "False Ceiling (Wooden)", rate: 1500, measure: "sqft" },
  { name: "False Ceiling (Cement Board)", rate: 1000, measure: "sqft" },
  { name: "Ceiling Panel (Laminated)", rate: 1300, measure: "sqft" },

  // Misc Carpentry
  { name: "Shoe Rack", rate: 7000, measure: "nos" },
  { name: "Bookshelf", rate: 10000, measure: "nos" },
  { name: "Side Table", rate: 4000, measure: "nos" },
  { name: "Coffee Table", rate: 6000, measure: "nos" },
  { name: "Crockery Unit", rate: 15000, measure: "nos" },
  { name: "Pooja Unit", rate: 12000, measure: "nos" },
  { name: "Pelmet (Curtain)", rate: 600, measure: "rft" },
  { name: "Hand Rail (Wooden)", rate: 1800, measure: "rft" },
  { name: "Wooden Steps / Treads", rate: 2500, measure: "nos" },
];

export const AddCarpenterItem = (item) => {
  ItemMaster.push(item);
  return ItemMaster;
};
export default ItemMaster;
