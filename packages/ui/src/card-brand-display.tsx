import { useState, useEffect } from "react";

interface CardBrandDisplayProps {
  detectedBrand: string | null;
}

type CardBrandId =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "unionpay"
  | "unknown";

const cardBrandMap = {
  visa: { src: "/payment_channels/checkout_visa.webp", alt: "Visa" },
  mastercard: {
    src: "/payment_channels/checkout_mastercard.webp",
    alt: "Mastercard",
  },
  amex: { src: "/payment_channels/checkout_amex.webp", alt: "Amex" },
  discover: {
    src: "/payment_channels/checkout_discovery.webp",
    alt: "Discovery",
  },
  unionpay: {
    src: "/payment_channels/checkout_unionpay.webp",
    alt: "UnionPay",
  },
  unknown: { src: "/payment_channels/checkout_gim.webp", alt: "Card" },
} satisfies Record<CardBrandId, { src: string; alt: string }>;

function resolveCardBrand(brand: string): { src: string; alt: string } {
  switch (brand) {
    case "visa":
    case "mastercard":
    case "amex":
    case "discover":
    case "unionpay":
    case "unknown":
      return cardBrandMap[brand];
    default:
      return cardBrandMap.unknown;
  }
}

const CardBrandDisplay = ({ detectedBrand }: CardBrandDisplayProps) => {
  const [cardIconSet, setCardIconSet] = useState(0);

  const cardBrandSets = [
    [
      {
        src: "/payment_channels/checkout_visa.webp",
        alt: "Visa",
        brand: "visa",
      },
      {
        src: "/payment_channels/checkout_mastercard.webp",
        alt: "Mastercard",
        brand: "mastercard",
      },
    ],
    [
      {
        src: "/payment_channels/checkout_amex.webp",
        alt: "Amex",
        brand: "amex",
      },
      {
        src: "/payment_channels/checkout_discovery.webp",
        alt: "Discovery",
        brand: "discover",
      },
    ],
    [
      {
        src: "/payment_channels/checkout_gim.webp",
        alt: "GIM",
        brand: "unknown",
      },
      {
        src: "/payment_channels/checkout_unionpay.webp",
        alt: "UnionPay",
        brand: "unionpay",
      },
    ],
  ];

  useEffect(() => {
    if (detectedBrand) {
      return;
    }

    const interval = setInterval(() => {
      setCardIconSet((prev) => (prev + 1) % cardBrandSets.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [cardBrandSets.length, detectedBrand]);

  return (
    <div className="flex items-center gap-1">
      {detectedBrand
        ? (() => {
            const cardInfo = resolveCardBrand(detectedBrand);
            return (
              <div className="w-6 h-6 flex items-center justify-center overflow-hidden opacity-90">
                <img
                  src={cardInfo.src}
                  alt={cardInfo.alt}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  style={{ filter: "brightness(1.2)" }}
                />
              </div>
            );
          })()
        : cardBrandSets[cardIconSet]?.map((card, index) => (
            <div
              key={index}
              className="w-6 h-6 flex items-center justify-center overflow-hidden opacity-90"
            >
              <img
                src={card.src}
                alt={card.alt}
                width={24}
                height={24}
                className="w-full h-full object-cover transition-opacity duration-500"
                style={{ filter: "brightness(1.2)" }}
              />
            </div>
          ))}
    </div>
  );
};

export { CardBrandDisplay };
export default CardBrandDisplay;
