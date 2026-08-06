/* =========================================================
   assets/js/data/wilayas.js
   Phase 1 Step 3 — moved verbatim from index.html's main
   <script> block:
     WILAYAS             original lines 2868-2884
     ZONE_FEES           original lines 2886-2890
     COMMUNES_BY_WILAYA  original lines 2905-2933 (including
                         its descriptive comment block)
   Values, keys, and structure are byte-for-byte identical to
   the original; only each leading `const` was changed to
   `export const`. The populateWilayas() function that used to
   sit between WILAYAS and ZONE_FEES remains in index.html —
   only the static data moved.
========================================================= */

export const WILAYAS = [
    {c:'01',n:'Adrar',z:3},{c:'02',n:'Chlef',z:2},{c:'03',n:'Laghouat',z:2},{c:'04',n:'Oum El Bouaghi',z:2},
    {c:'05',n:'Batna',z:2},{c:'06',n:'Béjaïa',z:2},{c:'07',n:'Biskra',z:2},{c:'08',n:'Béchar',z:3},
    {c:'09',n:'Blida',z:1},{c:'10',n:'Bouira',z:2},{c:'11',n:'Tamanrasset',z:3},{c:'12',n:'Tébessa',z:2},
    {c:'13',n:'Tlemcen',z:2},{c:'14',n:'Tiaret',z:2},{c:'15',n:'Tizi Ouzou',z:2},{c:'16',n:'Alger',z:1},
    {c:'17',n:'Djelfa',z:2},{c:'18',n:'Jijel',z:2},{c:'19',n:'Sétif',z:2},{c:'20',n:'Saïda',z:2},
    {c:'21',n:'Skikda',z:2},{c:'22',n:'Sidi Bel Abbès',z:2},{c:'23',n:'Annaba',z:2},{c:'24',n:'Guelma',z:2},
    {c:'25',n:'Constantine',z:2},{c:'26',n:'Médéa',z:2},{c:'27',n:'Mostaganem',z:2},{c:'28',n:"M'Sila",z:2},
    {c:'29',n:'Mascara',z:2},{c:'30',n:'Ouargla',z:2},{c:'31',n:'Oran',z:2},{c:'32',n:'El Bayadh',z:3},
    {c:'33',n:'Illizi',z:3},{c:'34',n:'Bordj Bou Arréridj',z:2},{c:'35',n:'Boumerdès',z:1},{c:'36',n:'El Tarf',z:2},
    {c:'37',n:'Tindouf',z:3},{c:'38',n:'Tissemsilt',z:2},{c:'39',n:'El Oued',z:2},{c:'40',n:'Khenchela',z:2},
    {c:'41',n:'Souk Ahras',z:2},{c:'42',n:'Tipaza',z:1},{c:'43',n:'Mila',z:2},{c:'44',n:'Aïn Defla',z:2},
    {c:'45',n:'Naâma',z:3},{c:'46',n:'Aïn Témouchent',z:2},{c:'47',n:'Ghardaïa',z:2},{c:'48',n:'Relizane',z:2},
    {c:'49',n:'Timimoun',z:3},{c:'50',n:'Bordj Badji Mokhtar',z:3},{c:'51',n:'Ouled Djellal',z:2},{c:'52',n:'Béni Abbès',z:3},
    {c:'53',n:'In Salah',z:3},{c:'54',n:'In Guezzam',z:3},{c:'55',n:'Touggourt',z:2},{c:'56',n:'Djanet',z:3},
    {c:'57',n:"El M'Ghair",z:2},{c:'58',n:'El Meniaa',z:3}
  ];

export const ZONE_FEES = {
    1: { home: 400,  stop: 200 },
    2: { home: 650,  stop: 350 },
    3: { home: 1200, stop: 800 }
  };

  // =========================================================
  // WILAYA → COMMUNE dynamic mapping
  // Fully authored for the ~20 highest-order-volume wilayas.
  // Every other wilaya falls back to its own chef-lieu (seat)
  // commune so the dropdown is never empty — extend this object
  // with more entries any time; the lookup code needs no changes.
  // =========================================================
export const COMMUNES_BY_WILAYA = {
    '16': ['Alger Centre','Bab El Oued','Bologhine','Casbah','Oued Koriche','Bir Mourad Raïs','El Madania','Hamma El Annasser','Kouba','El Harrach','Baraki','Birkhadem','Hydra','El Mouradia','Mohammadia','Bordj El Kiffan','Bordj El Bahri','Dar El Beïda','Bab Ezzouar','Ben Aknoun','Bouzareah','Cheraga','Ouled Fayet','El Achour','Draria','Douera','Zeralda','Staoueli','Rouiba','Reghaia'],
    '31': ['Oran','Bir El Djir','Es Senia','Arzew','Bethioua','Gdyel','Aïn El Turck','Mers El Kébir','Bousfer','Boutlelis','Misserghin','Oued Tlelat','Hassi Bounif','El Kerma','Sidi Chami'],
    '25': ['Constantine','El Khroub','Hamma Bouziane','Didouche Mourad','Aïn Smara','Zighoud Youcef','Ibn Ziad','Aïn Abid','Ouled Rahmoune','Beni Hamiden'],
    '09': ['Blida','Boufarik','Bouinan','Larbaa','Mouzaia','El Affroun','Chiffa','Beni Mered','Meftah','Bougara','Hammam Melouane','Ouled Yaich'],
    '06': ['Béjaïa','Amizour','Aokas','Tichy','Kherrata','Akbou','Sidi Aïch','Seddouk','El Kseur','Oued Ghir','Barbacha','Souk El Ténine'],
    '15': ['Tizi Ouzou','Draa Ben Khedda','Boghni','Azazga','Larbaa Nath Irathen','Aïn El Hammam','Ouadhias','Tigzirt','Azeffoun','Draa El Mizan','Freha','Makouda'],
    '19': ['Sétif','El Eulma','Aïn Oulmene','Aïn Arnat','Bougaa','Amoucha','Hammam Guergour','El Ouricia','Bir El Arch'],
    '23': ['Annaba','El Bouni','El Hadjar','Sidi Amar','Berrahal','Chetaibi','Seraïdi'],
    '05': ['Batna','Arris','Barika','Merouana','Tazoult','Aïn Touta','Ras El Aïoun','Seriana','Ngaous','Chemora'],
    '21': ['Skikda','Collo','Azzaba','El Harrouch','Ramdane Djamel','Tamalous','Ben Azzouz','Aïn Kechra','Filfila'],
    '22': ['Sidi Bel Abbès','Telagh','Ben Badis','Sfisef','Mostefa Ben Brahim','Tessala'],
    '07': ['Biskra','Sidi Okba','Tolga','El Kantara','Zeribet El Oued','Djemorah'],
    '13': ['Tlemcen','Mansourah','Chetouane','Remchi','Maghnia','Nedroma','Hennaya','Ghazaouet','Aïn Fezza'],
    '27': ['Mostaganem','Sidi Ali','Bouguirat','Sayada','Achaacha','Hassi Mameche','Kheir Eddine'],
    '34': ['Bordj Bou Arréridj','Ras El Oued','Bordj Ghdir','Mansourah','El Achir','Aïn Taghrout'],
    '35': ['Boumerdès','Boudouaou','Corso','Dellys','Thenia','Naciria','Bordj Menaiel','Ouled Moussa','Zemmouri','Isser','Khemis El Khechna'],
    '42': ['Tipaza','Cherchell','Koléa','Hadjout','Fouka','Bou Ismaïl','Damous','Douaouda','Nador'],
    '39': ['El Oued','Guemar','Robbah','Reguiba','Debila','Magrane'],
    '17': ['Djelfa','Messaad','Aïn Oussera','Hassi Bahbah','Birine','El Idrissia'],
    '14': ['Tiaret','Ksar Chellala','Sougueur','Mahdia','Frenda','Rahouia'],
    '48': ['Relizane','Oued Rhiou','Mazouna','Ammi Moussa','Zemmoura']
  };
