/* =========================================================
   assets/js/data/products.js
   Phase 1 Step 3 — moved verbatim from index.html's main
   <script> block (original lines 2136-2233). Values, keys,
   and structure are byte-for-byte identical to the original;
   only the leading `const` was changed to `export const`.
========================================================= */

export const PRODUCTS = {
    p1: {
      title: 'Cocotte en fonte émaillée 24cm', category: 'Cuisine', ref: 'DD-CU-1042',
      price: 8900, oldPrice: 12000, wholesalePrice: 6200, moq: 10, stock: 'in', rating: 4.7, reviews: 128,
      images: [
        'https://images.unsplash.com/photo-1547570918-ae3a096d5839?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556911820-1238441ed1a7?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556909114-6a2fee5216bb?q=80&w=900&auto=format&fit=crop'
      ],
      description: "Cocotte en fonte émaillée qui répartit la chaleur uniformément pour des mijotés parfaits. Revêtement émaillé résistant aux taches, compatible avec toutes les sources de chaleur y compris l'induction.",
      dimensions: "Diamètre : 24 cm — Capacité : 4,5 L — Poids : 4,1 kg — Compatible four jusqu'à 260°C.",
      care: "Laver à l'eau chaude savonneuse. Éviter les ustensiles métalliques abrasifs. Laisser refroidir avant de passer sous l'eau froide."
    },
    p2: {
      title: 'Set de 3 paniers en osier tressé', category: 'Rangement', ref: 'DD-RG-2087',
      price: 4200, oldPrice: null, wholesalePrice: 2900, moq: 20, stock: 'in', rating: 4.5, reviews: 64,
      images: [
        'https://images.unsplash.com/photo-1455669175216-9017c9b02fc6?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1481061730414-e888962bd2c0?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1646170629004-b3c84a27fc17?q=80&w=900&auto=format&fit=crop'
      ],
      description: "Trois paniers en osier tressé à la main, tailles emboîtables, idéals pour ranger linge, jouets ou accessoires tout en gardant un style naturel et chaleureux.",
      dimensions: "Grand : 40×30×22 cm — Moyen : 34×25×18 cm — Petit : 28×20×14 cm.",
      care: "Dépoussiérer avec un chiffon sec. Éviter l'humidité prolongée et l'exposition directe au soleil."
    },
    p3: {
      title: 'Parure de lit 100% coton, 4 pièces', category: 'Linge de maison', ref: 'DD-LM-3115',
      price: 6500, oldPrice: 8900, wholesalePrice: 4550, moq: 15, stock: 'low', rating: 4.8, reviews: 203,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=900&auto=format&fit=crop'
      ],
      description: "Parure 4 pièces (housse de couette, drap housse, 2 taies) en coton 100% respirant, tissage serré pour une douceur longue durée.",
      dimensions: "Housse de couette : 220×240 cm — Drap housse : 160×200 cm — Taies : 65×65 cm ×2.",
      care: "Lavage en machine à 40°C. Repassage à température moyenne. Ne pas javelliser."
    },
    p4: {
      title: 'Miroir mural rond finition dorée', category: 'Décoration', ref: 'DD-DE-4028',
      price: 5300, oldPrice: null, wholesalePrice: 3700, moq: 10, stock: 'in', rating: 4.6, reviews: 47,
      images: [
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=900&auto=format&fit=crop'
      ],
      description: "Miroir rond au cadre métallique fin, finition dorée brossée. Apporte luminosité et élégance à toutes les pièces de la maison.",
      dimensions: "Diamètre : 60 cm — Épaisseur cadre : 2 cm — Fixation murale incluse.",
      care: "Nettoyer avec un chiffon microfibre légèrement humide. Éviter les produits abrasifs sur le cadre doré."
    },
    p5: {
      title: 'Tapis de bain mémoire de forme', category: 'Salle de bain', ref: 'DD-SB-5061',
      price: 2100, oldPrice: null, wholesalePrice: 1450, moq: 30, stock: 'in', rating: 4.4, reviews: 89,
      images: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=900&auto=format&fit=crop'
      ],
      description: "Tapis de bain en mousse à mémoire de forme, surface moelleuse et base antidérapante. Absorbe l'eau rapidement et sèche vite.",
      dimensions: "50×80 cm — Épaisseur : 3,5 cm.",
      care: "Lavage en machine à 30°C, cycle délicat. Ne pas mettre au sèche-linge."
    },
    p6: {
      title: 'Étagère murale bois, 3 niveaux', category: 'Rangement', ref: 'DD-RG-6094',
      price: 7800, oldPrice: null, wholesalePrice: 5450, moq: 10, stock: 'in', rating: 4.7, reviews: 56,
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?q=80&w=900&auto=format&fit=crop'
      ],
      description: "Étagère murale en bois massif à 3 niveaux, parfaite pour livres, plantes ou objets déco. Montage simple avec kit de fixation inclus.",
      dimensions: "80×20 cm par niveau — Hauteur totale : 60 cm — Charge max : 8 kg par niveau.",
      care: "Dépoussiérer régulièrement. Éviter l'exposition directe à l'humidité."
    },
    p7: {
      title: 'Set assiettes céramique, 12 pièces', category: 'Cuisine', ref: 'DD-CU-7038',
      price: 9400, oldPrice: 11500, wholesalePrice: 6600, moq: 15, stock: 'in', rating: 4.9, reviews: 312,
      images: [
        'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?q=80&w=900&auto=format&fit=crop'
      ],
      description: "Service de 12 pièces en céramique (4 assiettes plates, 4 creuses, 4 à dessert). Finition mate élégante, compatible lave-vaisselle et micro-ondes.",
      dimensions: "Assiette plate : Ø27cm — Creuse : Ø21cm — Dessert : Ø19cm.",
      care: "Compatible lave-vaisselle. Éviter les chocs thermiques brusques."
    },
    p8: {
      title: 'Plaid tricot grosse maille', category: 'Décoration', ref: 'DD-DE-8072',
      price: 3600, oldPrice: null, wholesalePrice: 2500, moq: 25, stock: 'low', rating: 4.5, reviews: 72,
      images: [
        'https://images.unsplash.com/photo-1616627561950-9f746e330187?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600369672400-6e7ab9c17a3d?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=900&auto=format&fit=crop'
      ],
      description: "Plaid en grosse maille tricotée, doux et chaleureux, idéal pour le canapé ou le pied de lit. Ajoute une touche cocooning à votre salon.",
      dimensions: "130×170 cm — Poids : 1,8 kg.",
      care: "Lavage à la main ou cycle laine à froid. Séchage à plat, à l'ombre."
    }
  };
