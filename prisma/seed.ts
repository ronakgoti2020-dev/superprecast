import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    name: "Terracotta Red Indoor Jali — One Third",
    slug: "terracotta-red-indoor-jali-one-third",
    category: "concrete-jali",
    description:
      "Made from high-quality concrete with a unique one-third cut design. Terracotta red finish provides a traditional yet elegant look and allows natural airflow and sunlight while maintaining privacy.",
    details: "High-quality concrete\nOne-third cut design\nIndoor / side-wall use",
    price: 55,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "Terracotta Red",
    design: "one-third",
    usage: "Side Walls",
    shape: "Square",
    featured: true,
  },
  {
    name: "200mm White Outdoor Jali — Camera",
    slug: "200mm-white-outdoor-jali-camera",
    category: "concrete-jali",
    description:
      "Crafted from durable concrete with a unique Camera design pattern. Enhances airflow and natural light while maintaining privacy. White finish adds elegance for facades, walls, and outdoor spaces.",
    details: "Camera design pattern\nOutdoor / facade use\nDurable concrete",
    price: 55,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "White",
    design: "camera",
    usage: "Building",
    shape: "Square",
    featured: true,
  },
  {
    name: "White Indoor Jali — Circle",
    slug: "white-indoor-jali-circle",
    category: "concrete-jali",
    description:
      "Premium-grade concrete with a stylish circle pattern. Allows smooth airflow and natural light while ensuring privacy. Elegant white finish for outdoor walls, facades, and boundary structures.",
    details: "Circle pattern\nPremium-grade concrete\nPrivacy with ventilation",
    price: 50,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "White",
    design: "circle",
    usage: "Building",
    shape: "Square",
    featured: false,
  },
  {
    name: "Off White Outdoor Jali — Swastik",
    slug: "off-white-outdoor-jali-swastik",
    category: "concrete-jali",
    description:
      "Decorative Swastik design in premium concrete. Excellent ventilation and natural light with privacy. Off-white finish for outdoor and boundary walls.",
    details: "Traditional Swastik motif\nOutdoor / boundary walls\nPremium concrete",
    price: 50,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "Off White",
    design: "swastik",
    usage: "Building",
    shape: "Square",
    featured: true,
  },
  {
    name: "White Outdoor Jali — Opal",
    slug: "white-outdoor-jali-opal",
    category: "concrete-jali",
    description:
      "High-quality concrete with a stylish Opal design. Allows natural airflow and light while maintaining privacy. White finish adds a decorative touch to outdoor spaces and boundary walls.",
    details: "Opal design\nDecorative outdoor use\nWhite finish",
    price: 50,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "White",
    design: "opal",
    usage: "Building",
    shape: "Square",
    featured: false,
  },
  {
    name: "Off White Outdoor Jali — Camera",
    slug: "off-white-outdoor-jali-camera",
    category: "concrete-jali",
    description:
      "Durable concrete with a Camera design pattern in an off-white finish. Ideal for facades, walls, and outdoor spaces that need airflow with privacy.",
    details: "Camera design\nOff-white finish\nFacade friendly",
    price: 50,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "Off White",
    design: "camera",
    usage: "Building",
    shape: "Square",
    featured: false,
  },
  {
    name: "200mm Off White Outdoor Jali — One Third",
    slug: "200mm-off-white-outdoor-jali-one-third",
    category: "concrete-jali",
    description:
      "Off-white concrete jali with a one-third design. Strong, long-lasting, and suited to building elevations that need both ventilation and a clean architectural look.",
    details: "One-third design\nOff-white finish\nBuilding elevations",
    price: 50,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "Off White",
    design: "one-third",
    usage: "Building",
    shape: "Square",
    featured: false,
  },
  {
    name: "Off White Outdoor Jali — Cross",
    slug: "off-white-outdoor-jali-cross",
    category: "concrete-jali",
    description:
      "Premium concrete with a decorative cross design. Promotes ventilation and natural light while providing privacy. White finish enhances walls and outdoor structures.",
    details: "Cross design\nVentilation with privacy\nOutdoor structures",
    price: 48,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "Off White",
    design: "cross",
    usage: "Building",
    shape: "Square",
    featured: false,
  },
  {
    name: "Terracotta Red Indoor Jali — W Pattern",
    slug: "terracotta-red-indoor-jali-w-pattern",
    category: "concrete-jali",
    description:
      "Durable concrete with a stylish W pattern. Terracotta red finish adds a warm, traditional appeal and enhances ventilation while maintaining privacy.",
    details: "W pattern\nLarger 300 mm format\nExterior / indoor feature walls",
    price: 80,
    priceUnit: "Piece",
    moq: 1000,
    size: "300 × 200 × 80 mm",
    color: "Terracotta Red",
    design: "w",
    usage: "Exterior Walls",
    shape: "Rectangular",
    featured: true,
  },
  {
    name: "200mm White Indoor Jali — Leaf",
    slug: "200mm-white-indoor-jali-leaf",
    category: "concrete-jali",
    description:
      "Attractive leaf design in high-quality white concrete. Provides natural ventilation and light while maintaining privacy on walls and facades.",
    details: "Leaf design\nWhite finish\nIndoor / facade",
    price: 55,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "White",
    design: "leaf",
    usage: "Building",
    shape: "Square",
    featured: false,
  },
  {
    name: "Off White Outdoor Jali — Five Hole",
    slug: "off-white-outdoor-jali-five-hole",
    category: "concrete-jali",
    description:
      "A modern random five-hole pattern in strong concrete. Long service life with ventilation, natural light, and a decorative architectural finish.",
    details: "Five-hole pattern\nModern aesthetic\nLong service life",
    price: 50,
    priceUnit: "Piece",
    moq: 100,
    size: "200 × 200 × 60 mm",
    color: "Off White",
    design: "five-hole",
    usage: "Building",
    shape: "Square",
    featured: false,
  },
  {
    name: "300mm Grey Outdoor Jali — Hollow",
    slug: "300mm-grey-outdoor-jali-hollow",
    category: "concrete-jali",
    description:
      "Designed for effective airflow in walls and outdoor structures. Manufactured from strong cement concrete. Neutral grey finish blends with all architectural styles.",
    details: "Hollow design\n300 mm format\nNeutral cement grey",
    price: 50,
    priceUnit: "Piece",
    moq: 1000,
    size: "300 × 300 × 70 mm",
    color: "Grey",
    design: "hollow",
    usage: "Building",
    shape: "Square",
    featured: true,
  },
  {
    name: "Terracotta Red Outdoor Jali — Circle",
    slug: "terracotta-red-outdoor-jali-circle",
    category: "concrete-jali",
    description:
      "High-strength concrete with a circular design and terracotta red finish. Warm, traditional look with ventilation, light, and privacy for exterior walls.",
    details: "Circle design\nTerracotta red\nExterior walls",
    price: 55,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "Terracotta Red",
    design: "circle",
    usage: "Exterior Walls",
    shape: "Square",
    featured: false,
  },
  {
    name: "Terracotta Red Outdoor Jali — Flower",
    slug: "terracotta-red-outdoor-jali-flower",
    category: "concrete-jali",
    description:
      "Beautiful flower design in premium terracotta concrete. Traditional elegant appearance with airflow and privacy for exterior walls.",
    details: "Flower design\nTraditional terracotta look\nExterior walls",
    price: 55,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "Terracotta Red",
    design: "flower",
    usage: "Exterior Walls",
    shape: "Square",
    featured: false,
  },
  {
    name: "200mm Red Outdoor Jali — Swastik",
    slug: "200mm-red-outdoor-jali-swastik",
    category: "concrete-jali",
    description:
      "Traditional Swastik pattern in terracotta red concrete. Classic outdoor look with airflow, natural light, and privacy.",
    details: "Swastik pattern\nRed finish\nExterior walls",
    price: 55,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "Red",
    design: "swastik",
    usage: "Exterior Walls",
    shape: "Square",
    featured: false,
  },
  {
    name: "200mm Terracotta Outdoor Jali — Camera",
    slug: "200mm-terracotta-outdoor-jali-camera",
    category: "concrete-jali",
    description:
      "Camera-style design in terracotta red concrete. Warm traditional appeal with proper airflow and privacy for exterior walls.",
    details: "Camera design\nTerracotta red\nExterior walls",
    price: 60,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "Terracotta Red",
    design: "camera",
    usage: "Exterior Walls",
    shape: "Square",
    featured: false,
  },
  {
    name: "Terracotta Red Outdoor Jali — Leaf",
    slug: "terracotta-red-outdoor-jali-leaf",
    category: "concrete-jali",
    description:
      "Elegant leaf design in sturdy terracotta concrete. Natural aesthetic for outdoor spaces with ventilation, light, and privacy.",
    details: "Leaf design\nOutdoor spaces\nTerracotta finish",
    price: 60,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "Terracotta Red",
    design: "leaf",
    usage: "Exterior Walls",
    shape: "Square",
    featured: false,
  },
  {
    name: "200mm Terracotta Indoor Jali — Petal",
    slug: "200mm-terracotta-indoor-jali-petal",
    category: "concrete-jali",
    description:
      "Elegant petal pattern for a stylish architectural look. Durable terracotta red concrete with ventilation, natural light, strength, and privacy.",
    details: "Petal pattern\nArchitectural look\nIndoor / exterior walls",
    price: 55,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "Terracotta Red",
    design: "petal",
    usage: "Exterior Walls",
    shape: "Square",
    featured: false,
  },
  {
    name: "Terracotta Red Indoor Jali — Cross",
    slug: "terracotta-red-indoor-jali-cross",
    category: "concrete-jali",
    description:
      "Decorative cross design in durable terracotta concrete. Traditional aesthetic for partition walls with ventilation, light, and privacy.",
    details: "Cross design\nPartition walls\nTerracotta finish",
    price: 55,
    priceUnit: "Piece",
    moq: 1000,
    size: "200 × 200 × 60 mm",
    color: "Terracotta Red",
    design: "cross",
    usage: "Partition Walls",
    shape: "Square",
    featured: false,
  },
  {
    name: "150mm Concrete Kerb Stone",
    slug: "150mm-concrete-kerb-stone",
    category: "concrete-kerb-stone",
    description:
      "Premium-grade concrete kerb for high durability. Strong edge support for pavements, pathways, and roads, with neat separation between walkways, lawns, and driveways.",
    details: "Premium-grade concrete\nOutdoor landscaping\nEdge support for paths and roads",
    price: 75,
    priceUnit: "Piece",
    moq: 1000,
    size: "300 × 300 × 150 mm",
    color: "Grey",
    design: "kerb",
    usage: "Landscaping",
    shape: "Kerb",
    featured: true,
  },
  {
    name: "400mm Concrete Kerb Stone",
    slug: "400mm-concrete-kerb-stone",
    category: "concrete-kerb-stone",
    description:
      "Heavy-duty concrete kerb for superior strength. Strong edge support for highways, main roads, and large pavements, keeping clear boundaries between roads, pathways, and green areas.",
    details: "Heavy-duty concrete\nHighways and main roads\nClear landscape boundaries",
    price: 75,
    priceUnit: "Piece",
    moq: 1000,
    size: "300 × 400 × 100 mm",
    color: "Grey",
    design: "kerb",
    usage: "Landscaping",
    shape: "Kerb",
    featured: false,
  },
  {
    name: "100mm Concrete Kerb Stone",
    slug: "100mm-concrete-kerb-stone",
    category: "concrete-kerb-stone",
    description:
      "High-strength concrete kerb for pavements, pathways, and roads. Neat separation of lawns, gardens, and driveways.",
    details: "High-strength concrete\nGardens and driveways\nOutdoor use",
    price: 50,
    priceUnit: "Piece",
    moq: 1000,
    size: "300 × 300 × 100 mm",
    color: "Grey",
    design: "kerb",
    usage: "Landscaping",
    shape: "Kerb",
    featured: false,
  },
  {
    name: "300mm Concrete Kerb Stone",
    slug: "300mm-concrete-kerb-stone",
    category: "concrete-kerb-stone",
    description:
      "Premium concrete kerb for maximum strength. Reliable edge support for roads, pathways, and pavements with neat alignment of driveways, lawns, and walkways.",
    details: "Maximum strength\nRoads and walkways\nNeat alignment",
    price: 80,
    priceUnit: "Piece",
    moq: 1000,
    size: "450 × 300 × 100 mm",
    color: "Grey",
    design: "kerb",
    usage: "Landscaping",
    shape: "Kerb",
    featured: false,
  },
  {
    name: "450mm Concrete Kerb Stone",
    slug: "450mm-concrete-kerb-stone",
    category: "concrete-kerb-stone",
    description:
      "Robust high-quality concrete kerb for highways, parking zones, and heavy-traffic areas. Proper alignment and separation of roads, pathways, and landscapes.",
    details: "Heavy-traffic use\nParking zones and highways\nRobust concrete",
    price: 80,
    priceUnit: "Piece",
    moq: 1000,
    size: "300 × 450 × 100 mm",
    color: "Grey",
    design: "kerb",
    usage: "Landscaping",
    shape: "Kerb",
    featured: false,
  },
  {
    name: "60 mm Concrete Grass Paver Block",
    slug: "60mm-concrete-grass-paver-block",
    category: "paver-blocks",
    description:
      "Sturdy concrete paver with a special design that allows grass growth. Eco-friendly paving for parking areas, pathways, gardens, and green landscapes.",
    details: "Allows grass growth\nEco-friendly paving\nParking, paths, gardens",
    price: 50,
    priceUnit: "Piece",
    moq: 1000,
    size: "300 × 300 × 60 mm",
    color: "Grey",
    design: "grass-paver",
    usage: "Pavement",
    shape: "Square",
    featured: true,
  },
  {
    name: "60 mm Concrete Rectangular Paver Block",
    slug: "60mm-concrete-rectangular-paver-block",
    category: "paver-blocks",
    description:
      "High-quality concrete paver in a uniform square format. Available in grey, red, and black. Suitable for pathways, driveways, gardens, and outdoor flooring.",
    details: "Grey, red and black options\nUniform square paving\nDriveways and outdoor flooring",
    price: 32,
    priceUnit: "sq ft",
    moq: 1000,
    size: "6 × 6 inch × 60 mm",
    color: "Grey, Red, Black",
    design: "paver",
    usage: "Pavement",
    shape: "Square",
    featured: false,
  },
  {
    name: "Concrete Cover Blocks",
    slug: "concrete-cover-blocks",
    category: "block",
    description:
      "Precast concrete cover blocks used to maintain accurate cover for reinforcement in RCC work. Consistent size, high strength, and suitable for slabs, beams, columns, and foundations.",
    details: "Maintains RCC cover\nHigh strength\nSlabs, beams, columns, foundations",
    price: null,
    priceUnit: "Piece",
    moq: 1000,
    size: "As required",
    color: "Grey",
    design: "cover-block",
    usage: "RCC Construction",
    shape: "Block",
    featured: false,
  },
];

async function main() {
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || "SuperPrecast@2015", 10);
  const username = process.env.ADMIN_USERNAME || "admin";

  await prisma.inquiry.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.setting.deleteMany();

  await prisma.admin.create({ data: { username, password } });
  await prisma.setting.create({
    data: {
      id: "site",
      phone: "",
      email: "",
      whatsapp: "",
      address: "Ankleshwar, Bharuch, Gujarat 393002",
      gst: "24AOXPL2270G1ZQ",
      owner: "Minaben Pravinbhai Luvani",
      instagram: "",
      mapUrl: "",
    },
  });

  const categories = [
    {
      name: "Concrete Jali",
      slug: "concrete-jali",
      description:
        "Decorative breeze-block jali in terracotta, white, off-white, and grey. Designed for ventilation, privacy, and elevation work.",
    },
    {
      name: "Concrete Kerb Stone",
      slug: "concrete-kerb-stone",
      description:
        "Durable kerb stones for roads, pathways, gardens, and landscaping in multiple sizes.",
    },
    {
      name: "Paver Blocks",
      slug: "paver-blocks",
      description: "Grass pavers and rectangular paver blocks for parking, driveways, and outdoor flooring.",
    },
    {
      name: "Block",
      slug: "block",
      description: "Precast concrete cover blocks and related block products for RCC work.",
    },
  ];

  const created = await Promise.all(
    categories.map((category) => prisma.category.create({ data: category })),
  );
  const bySlug = Object.fromEntries(created.map((category) => [category.slug, category.id]));

  for (const product of products) {
    const saved = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        details: product.details,
        price: product.price,
        priceUnit: product.priceUnit,
        moq: product.moq,
        size: product.size,
        color: product.color,
        material: "Concrete",
        design: product.design,
        usage: product.usage,
        shape: product.shape,
        featured: product.featured,
        inStock: true,
        image:
          product.slug === "concrete-cover-blocks"
            ? null
            : `/products/${product.slug}.jpeg`,
        categoryId: bySlug[product.category],
      },
    });

    if (saved.image) {
      await prisma.productImage.create({
        data: { url: saved.image, sortOrder: 0, productId: saved.id },
      });
    }
  }

  console.log(`Seeded ${products.length} products. Admin login: ${username}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
