export interface Product {
  id: string;
  name: string;
  description: string;
  material: 'metalico' | 'bronce' | 'aluminio';
  price: number;
  stock: number;
  is_active: boolean;
  images: { url: string; is_primary: boolean; sort_order: number }[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  image_url: string;
}

export interface Order {
  id: string;
  status: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado';
  total: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  created_at: string;
  items: OrderItem[];
}

export const products: Product[] = [
  {
    id: "prod-001",
    name: "Placa Metálica Clásica N°5",
    description: "Placa de nomenclatura metálica con acabado clásico. Ideal para fachadas residenciales. Números en relieve con fondo negro mate y caracteres plateados. Resistente a la intemperie y fácil de instalar. Incluye tornillos de fijación.",
    material: "metalico",
    price: 45000,
    stock: 15,
    is_active: true,
    images: [
      { url: "/images/products/placa-metalica-clasica.webp", is_primary: true, sort_order: 0 },
      { url: "/images/products/placa-metalica-clasica-2.webp", is_primary: false, sort_order: 1 },
    ]
  },
  {
    id: "prod-002",
    name: "Números Sueltos en Bronce",
    description: "Números individuales fundidos en bronce macizo. Acabado pulido con brillo natural dorado. Altura de 12 cm, ideales para puertas y fachadas de alta gama. Se venden por unidad. Cada número incluye perno de fijación trasero.",
    material: "bronce",
    price: 35000,
    stock: 30,
    is_active: true,
    images: [
      { url: "/images/products/numeros-bronce.webp", is_primary: true, sort_order: 0 },
      { url: "/images/products/numeros-bronce-2.webp", is_primary: false, sort_order: 1 },
    ]
  },
  {
    id: "prod-003",
    name: "Placa Premium Aluminio Cepillado",
    description: "Placa de nomenclatura en aluminio cepillado de alta calidad. Diseño moderno y elegante con números troquelados. Resistente a la corrosión, ideal para exteriores. Acabado satinado que complementa arquitectura contemporánea.",
    material: "aluminio",
    price: 55000,
    stock: 12,
    is_active: true,
    images: [
      { url: "/images/products/placa-aluminio-premium.webp", is_primary: true, sort_order: 0 },
      { url: "/images/products/placa-aluminio-premium-2.webp", is_primary: false, sort_order: 1 },
    ]
  },
  {
    id: "prod-004",
    name: "Placa Doble Metálica Residencial",
    description: "Placa doble para nomenclatura completa (número + calle). Fabricada en metal resistente con pintura electrostática negra y números blancos en relieve. Tamaño estándar 30x15 cm. Perfecta para conjuntos residenciales.",
    material: "metalico",
    price: 65000,
    stock: 8,
    is_active: true,
    images: [
      { url: "/images/products/placa-doble-metalica.webp", is_primary: true, sort_order: 0 },
      { url: "/images/products/placa-doble-metalica-2.webp", is_primary: false, sort_order: 1 },
    ]
  },
  {
    id: "prod-005",
    name: "Número Individual Bronce Antiguo",
    description: "Número individual con acabado bronce antiguo (efecto envejecido). Fabricado en bronce fundido con pátina natural. Altura de 15 cm. Ideal para casas con estilo colonial o clásico. Incluye kit de instalación.",
    material: "bronce",
    price: 42000,
    stock: 20,
    is_active: true,
    images: [
      { url: "/images/products/numero-bronce-antiguo.webp", is_primary: true, sort_order: 0 },
      { url: "/images/products/numero-bronce-antiguo-2.webp", is_primary: false, sort_order: 1 },
    ]
  },
  {
    id: "prod-006",
    name: "Set Numeración Aluminio Negro",
    description: "Set completo de 4 números en aluminio anodizado negro. Diseño minimalista y moderno. Altura 10 cm por número. Acabado mate antihuellas. Incluye plantilla de instalación y tornillería en acero inoxidable.",
    material: "aluminio",
    price: 78000,
    stock: 10,
    is_active: true,
    images: [
      { url: "/images/products/set-aluminio-negro.webp", is_primary: true, sort_order: 0 },
      { url: "/images/products/set-aluminio-negro-2.webp", is_primary: false, sort_order: 1 },
    ]
  },
  {
    id: "prod-007",
    name: "Placa Personalizada Bronce Pulido",
    description: "Placa de nomenclatura personalizada en bronce pulido brillante. Fabricada bajo pedido con el número que necesites. Acabado espejo de alta calidad. Tamaño 25x12 cm. Tiempo de fabricación: 5-7 días hábiles.",
    material: "bronce",
    price: 95000,
    stock: 5,
    is_active: true,
    images: [
      { url: "/images/products/placa-bronce-personalizada.webp", is_primary: true, sort_order: 0 },
      { url: "/images/products/placa-bronce-personalizada-2.webp", is_primary: false, sort_order: 1 },
    ]
  },
  {
    id: "prod-008",
    name: "Placa Económica Metal Estándar",
    description: "Placa de nomenclatura económica en metal con pintura resistente. Opción práctica y funcional para cualquier tipo de fachada. Números impresos con tecnología UV. Tamaño 20x10 cm. La mejor relación calidad-precio.",
    material: "metalico",
    price: 28000,
    stock: 25,
    is_active: true,
    images: [
      { url: "/images/products/placa-economica-metal.webp", is_primary: true, sort_order: 0 },
      { url: "/images/products/placa-economica-metal-2.webp", is_primary: false, sort_order: 1 },
    ]
  },
];

export const sampleOrders: Order[] = [
  {
    id: "ord-001",
    status: "entregado",
    total: 110000,
    shipping_name: "Carlos Martínez",
    shipping_phone: "3001234567",
    shipping_address: "Calle 10 #25-30, Cali, Valle del Cauca",
    created_at: "2025-04-15T14:30:00Z",
    items: [
      {
        id: "oi-001",
        product_id: "prod-001",
        product_name: "Placa Metálica Clásica N°5",
        quantity: 1,
        unit_price: 45000,
        subtotal: 45000,
        image_url: "/images/products/placa-metalica-clasica.webp"
      },
      {
        id: "oi-002",
        product_id: "prod-004",
        product_name: "Placa Doble Metálica Residencial",
        quantity: 1,
        unit_price: 65000,
        subtotal: 65000,
        image_url: "/images/products/placa-doble-metalica.webp"
      }
    ]
  },
  {
    id: "ord-002",
    status: "enviado",
    total: 78000,
    shipping_name: "Ana López",
    shipping_phone: "3159876543",
    shipping_address: "Carrera 45 #12-18, Palmira, Valle del Cauca",
    created_at: "2025-05-01T09:15:00Z",
    items: [
      {
        id: "oi-003",
        product_id: "prod-006",
        product_name: "Set Numeración Aluminio Negro",
        quantity: 1,
        unit_price: 78000,
        subtotal: 78000,
        image_url: "/images/products/set-aluminio-negro.webp"
      }
    ]
  },
  {
    id: "ord-003",
    status: "pendiente",
    total: 70000,
    shipping_name: "Miguel Rodríguez",
    shipping_phone: "3201112233",
    shipping_address: "Av. 3N #45-12, Cali, Valle del Cauca",
    created_at: "2025-05-04T18:45:00Z",
    items: [
      {
        id: "oi-004",
        product_id: "prod-002",
        product_name: "Números Sueltos en Bronce",
        quantity: 2,
        unit_price: 35000,
        subtotal: 70000,
        image_url: "/images/products/numeros-bronce.webp"
      }
    ]
  }
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getMaterialLabel(material: string): string {
  const labels: Record<string, string> = {
    metalico: 'Metálico',
    'metálico': 'Metálico',
    bronce: 'Bronce',
    aluminio: 'Aluminio',
    'acrílico': 'Acrílico',
  };
  return labels[material] || material.charAt(0).toUpperCase() + material.slice(1);
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendiente: 'Pendiente',
    pagado: 'Pagado',
    enviado: 'Enviado',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  };
  return labels[status] || status;
}
