import { Book, BookCopy, StudentMember, Loan, ActivityLog, LoanRequest } from '../types/library';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b-001',
    title: 'Algorithmique et Structures de Données Avancées',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    isbn: '978-2-10-054526-1',
    category: 'Informatique & Algorithmique',
    department: 'Génie Informatique',
    publishedYear: 2021,
    publisher: 'Dunod',
    shelfLocation: 'Rayon EST-INFO-01 (Salle de Lecture EST)',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9782100545261-L.jpg',
    summary: 'Manuel fondamental décrivant avec rigueur les méthodes de conception et d\'analyse des algorithmes : tris, arbres rouge-noir, programmation dynamique, graphes et complexité NP-complète.',
    language: 'Français',
    pages: 1184,
    addedDate: '2025-01-15',
    isSuggested: true,
    tableOfContents: [
      { number: 1, title: 'Fondements mathématiques et complexité asymptotique', page: 1 },
      { number: 2, title: 'Tris rapides, par tas et par dénombrement', page: 125 },
      { number: 3, title: 'Arbres binaires de recherche et structures équilibrées', page: 280 },
      { number: 4, title: 'Algorithmes sur les graphes (Dijkstra, Bellman-Ford, Prim)', page: 540 },
      { number: 5, title: 'Programmation dynamique et algorithmes gloutons', page: 810 }
    ]
  },
  {
    id: 'b-002',
    title: 'Génie Logiciel & Modélisation UML 2.5',
    author: 'Pascal Roques',
    isbn: '978-2-212-67500-8',
    category: 'Génie Logiciel',
    department: 'Génie Informatique',
    publishedYear: 2022,
    publisher: 'Eyrolles',
    shelfLocation: 'Rayon EST-INFO-02 (Salle de Lecture EST)',
    coverUrl: 'https://covers.openlibrary.org/b/id/8730457-L.jpg',
    summary: 'Guide d\'ingénierie logicielle complet axé sur les diagrammes structurels et comportementaux UML (classes, séquences, états, cas d\'utilisation) et patrons de conception (Design Patterns GoF).',
    language: 'Français',
    pages: 420,
    addedDate: '2025-01-20',
    isSuggested: true,
    tableOfContents: [
      { number: 1, title: 'Cycle de vie logiciel et principes Agiles', page: 12 },
      { number: 2, title: 'Expression des besoins avec les cas d\'utilisation', page: 65 },
      { number: 3, title: 'Diagrammes de classes et modèles de domaine', page: 140 },
      { number: 4, title: 'Dynamique et interactions : Diagrammes de séquence', page: 230 },
      { number: 5, title: 'Design Patterns essentiels et refactorisation', page: 345 }
    ]
  },
  {
    id: 'b-003',
    title: 'Réseaux Informatiques : Notions Fondamentales & TCP/IP',
    author: 'Andrew Tanenbaum, David Wetherall',
    isbn: '978-2-7440-7521-6',
    category: 'Réseaux & Télécoms',
    department: 'Génie Informatique',
    publishedYear: 2020,
    publisher: 'Pearson France',
    shelfLocation: 'Rayon EST-RES-01',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9782744075216-L.jpg',
    summary: 'Ouvrage de référence mondial analysant les couches OSI et TCP/IP, le routage IP, le protocole TCP, la sécurité réseau et les technologies sans fil.',
    language: 'Français',
    pages: 940,
    addedDate: '2025-02-01',
    isSuggested: true,
    tableOfContents: [
      { number: 1, title: 'Introduction aux architectures en couches OSI et TCP/IP', page: 1 },
      { number: 2, title: 'Couche liaison de données et Ethernet', page: 180 },
      { number: 3, title: 'Sous-réseaux, adressage IPv4 / IPv6 et routage OSPF/BGP', page: 390 },
      { number: 4, title: 'Couche transport : sockets, TCP et contrôle de flux', page: 610 },
      { number: 5, title: 'Sécurité réseau : cryptographie, TLS et pare-feu', page: 790 }
    ]
  },
  {
    id: 'b-004',
    title: 'Automatique Industrielle & Systèmes Asservis',
    author: 'Gérard Bouzat, Philippe Fouché',
    isbn: '978-2-10-081402-2',
    category: 'Automatique & Robotique',
    department: 'Génie Électrique',
    publishedYear: 2021,
    publisher: 'Dunod',
    shelfLocation: 'Rayon EST-ELEC-03',
    coverUrl: 'https://covers.openlibrary.org/b/id/3084394-L.jpg',
    summary: 'Cours approfondi pour étudiants DUT et Licence Pro : transformée de Laplace, modélisation par fonctions de transfert, diagrammes de Bode/Nyquist et régulateurs PID industriels.',
    language: 'Français',
    pages: 368,
    addedDate: '2025-02-10',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Représentation des systèmes continus et transformée de Laplace', page: 1 },
      { number: 2, title: 'Stabilité des systèmes linéaires asservis (critère de Routh)', page: 75 },
      { number: 3, title: 'Réponses fréquentielles : Bode, Black et Nyquist', page: 160 },
      { number: 4, title: 'Synthèse et réglage des correcteurs industriels PID', page: 250 }
    ]
  },
  {
    id: 'b-005',
    title: 'Gestion de Production & Lean Manufacturing',
    author: 'Alain Courtois, Maurice Pillet, Chantal Martin',
    isbn: '978-2-212-57112-7',
    category: 'Génie Industriel',
    department: 'Génie Industriel',
    publishedYear: 2022,
    publisher: 'Eyrolles',
    shelfLocation: 'Rayon EST-INDUS-02',
    coverUrl: 'https://covers.openlibrary.org/b/id/11262495-L.jpg',
    summary: 'Méthodes modernes de planification de production industrielle : MRP2, Kanban, gestion des stocks, méthode 5S, SMED et amélioration continue Kaizen.',
    language: 'Français',
    pages: 520,
    addedDate: '2025-02-15',
    isSuggested: true,
    tableOfContents: [
      { number: 1, title: 'Planification stratégique et PIC / PDP', page: 20 },
      { number: 2, title: 'Calcul des besoins nets (CBN/MRP) et nomenclatures', page: 110 },
      { number: 3, title: 'Systèmes de gestion des stocks et seuils de réapprovisionnement', page: 215 },
      { number: 4, title: 'Principes du Lean : Kaizen, 5S, SMED et TPM', page: 330 },
      { number: 5, title: 'Pilotage par flux tirés et boucle Kanban', page: 440 }
    ]
  },
  {
    id: 'b-006',
    title: 'Comptabilité Générale et Analyse Financière',
    author: 'Béatrice et Francis Grandguillot',
    isbn: '978-2-297-13350-0',
    category: 'Économie & Gestion',
    department: 'Management & Gestion',
    publishedYear: 2023,
    publisher: 'Gualino Éditeur',
    shelfLocation: 'Rayon EST-GEST-01',
    coverUrl: 'https://covers.openlibrary.org/b/id/3138720-L.jpg',
    summary: 'Manuel pratique dédié aux étudiants des filières tertiaires : mécanismes comptables fondamentaux, écritures d\'inventaire, bilan, compte de résultat et ratios financiers clés.',
    language: 'Français',
    pages: 310,
    addedDate: '2025-02-22',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Les mécanismes de la partie double et documents de synthèse', page: 15 },
      { number: 2, title: 'Enregistrement des opérations courantes (Achats, Ventes, TVA)', page: 80 },
      { number: 3, title: 'Travaux d\'inventaire : amortissements et provisions', page: 165 },
      { number: 4, title: 'Analyse du compte de résultat et soldes intermédiaires', page: 240 }
    ]
  },
  {
    id: 'b-007',
    title: 'Programmation Web Moderne : React, Node.js & TypeScript',
    author: 'Éric Sarrion',
    isbn: '978-2-212-67891-2',
    category: 'Informatique & Web',
    department: 'Génie Informatique',
    publishedYear: 2023,
    publisher: 'Eyrolles',
    shelfLocation: 'Rayon EST-INFO-03',
    coverUrl: 'https://covers.openlibrary.org/b/id/10282783-L.jpg',
    summary: 'Développement d\'applications Web scalables full-stack : composants React, hooks personnalisés, API REST Express et typage statique avancé TypeScript.',
    language: 'Français',
    pages: 480,
    addedDate: '2025-03-01',
    isSuggested: true,
    tableOfContents: [
      { number: 1, title: 'Typage TypeScript et environnement Vite', page: 1 },
      { number: 2, title: 'Composants fonctionnels, Hooks et state management', page: 95 },
      { number: 3, title: 'API backend avec Node.js et Express', page: 210 },
      { number: 4, title: 'Sécurité web, JWT et déploiement cloud', page: 340 }
    ]
  },
  {
    id: 'b-008',
    title: 'Bases de Données Relationnelles & Langage SQL',
    author: 'Laurent Audibert',
    isbn: '978-2-7298-5431-7',
    category: 'Systèmes d\'Information',
    department: 'Génie Informatique',
    publishedYear: 2021,
    publisher: 'Ellipses',
    shelfLocation: 'Rayon EST-INFO-04',
    coverUrl: 'https://covers.openlibrary.org/b/id/8686154-L.jpg',
    summary: 'Conception conceptuelle et logique des bases de données avec la méthode Merise (MCD, MLD) et requêtage avancé en SQL standard.',
    language: 'Français',
    pages: 320,
    addedDate: '2025-03-05',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Modèle entité-association et Merise', page: 10 },
      { number: 2, title: 'Normalisation et formes normales (1FN à BCNF)', page: 85 },
      { number: 3, title: 'Requêtes SQL : jointures, agrégations et sous-requêtes', page: 150 },
      { number: 4, title: 'Transactions, verrous et intégrité référentielle', page: 240 }
    ]
  },
  {
    id: 'b-009',
    title: 'Électronique de Puissance & Convertisseurs Statiques',
    author: 'Luc Lasne',
    isbn: '978-2-10-079845-3',
    category: 'Génie Électrique',
    department: 'Génie Électrique',
    publishedYear: 2022,
    publisher: 'Dunod',
    shelfLocation: 'Rayon EST-ELEC-01',
    coverUrl: 'https://covers.openlibrary.org/b/id/13833908-L.jpg',
    summary: 'Étude des semi-conducteurs de puissance, redresseurs commandés, onduleurs MLI, hacheurs buck-boost et applications aux moteurs industriels.',
    language: 'Français',
    pages: 390,
    addedDate: '2025-03-10',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Diodes, thyristors et transistors IGBT de puissance', page: 1 },
      { number: 2, title: 'Hacheurs abaisseurs et élévateurs de tension', page: 90 },
      { number: 3, title: 'Redresseurs monophasés et triphasés', page: 180 },
      { number: 4, title: 'Onduleurs autonomes et modulation de largeur d\'impulsion', page: 280 }
    ]
  },
  {
    id: 'b-010',
    title: 'Microcontrôleurs ARM Cortex-M & Systèmes Embarqués',
    author: 'Vincent Mahout',
    isbn: '978-2-10-072314-1',
    category: 'Systèmes Embarqués',
    department: 'Génie Électrique',
    publishedYear: 2020,
    publisher: 'Dunod',
    shelfLocation: 'Rayon EST-ELEC-02',
    coverUrl: 'https://covers.openlibrary.org/b/id/8858312-L.jpg',
    summary: 'Architecture matérielle et programmation bas niveau en langage C des microcontrôleurs ARM : bus système, timers, interruptions et liaisons UART/SPI/I2C.',
    language: 'Français',
    pages: 360,
    addedDate: '2025-03-12',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Architecture des cœurs ARM Cortex-M et mémoire', page: 1 },
      { number: 2, title: 'Gestion des interruptions et contrôleur NVIC', page: 85 },
      { number: 3, title: 'Timers matériels et génération de signaux PWM', page: 175 },
      { number: 4, title: 'Protocoles de communication série : I2C, SPI et UART', page: 260 }
    ]
  },
  {
    id: 'b-011',
    title: 'Management de Projet & Méthodes Agiles (Scrum, Kanban)',
    author: 'Claude Parmentier',
    isbn: '978-2-212-57421-0',
    category: 'Management',
    department: 'Management & Gestion',
    publishedYear: 2022,
    publisher: 'Eyrolles',
    shelfLocation: 'Rayon EST-GEST-02',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9782212574210-L.jpg',
    summary: 'Guide pratique pour piloter des projets complexes : rôles Product Owner/Scrum Master, rituels Agiles, backlog, burndown charts et gestion des risques.',
    language: 'Français',
    pages: 280,
    addedDate: '2025-03-15',
    isSuggested: true,
    tableOfContents: [
      { number: 1, title: 'Manifeste Agile et valeurs fondamentales', page: 12 },
      { number: 2, title: 'Le cadre Scrum : artefacts, cérémonies et vélocité', page: 70 },
      { number: 3, title: 'Gestion du Product Backlog et User Stories', page: 140 },
      { number: 4, title: 'Méthode Kanban et optimisation des flux de travail', page: 210 }
    ]
  },
  {
    id: 'b-012',
    title: 'Marketing Digital & Stratégie E-commerce',
    author: 'Catherine Viot',
    isbn: '978-2-7061-4820-0',
    category: 'Commerce & Marketing',
    department: 'Management & Gestion',
    publishedYear: 2023,
    publisher: 'PUG',
    shelfLocation: 'Rayon EST-GEST-03',
    coverUrl: 'https://covers.openlibrary.org/b/id/12642275-L.jpg',
    summary: 'Techniques d\'acquisition et de fidélisation digitales : SEO, SEA, marketing de contenu, réseaux sociaux, analyse de conversion et KPI web analytics.',
    language: 'Français',
    pages: 340,
    addedDate: '2025-03-18',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Comportement du consommateur connecté', page: 1 },
      { number: 2, title: 'Référencement naturel (SEO) et payant (SEA)', page: 80 },
      { number: 3, title: 'Stratégie sur les réseaux sociaux et community management', page: 170 },
      { number: 4, title: 'Mesure de performance et Google Analytics 4', page: 260 }
    ]
  },
  {
    id: 'b-013',
    title: 'Résistance des Matériaux (RDM) & Mécanique des Solides',
    author: 'Jean-Claude Doubrère',
    isbn: '978-2-212-14221-5',
    category: 'Génie Mécanique',
    department: 'Génie Industriel',
    publishedYear: 2021,
    publisher: 'Eyrolles',
    shelfLocation: 'Rayon EST-INDUS-01',
    coverUrl: 'https://covers.openlibrary.org/b/id/3094712-L.jpg',
    summary: 'Calcul des contraintes et des déformations dans les structures : traction, compression, cisaillement, flexion plane, torsion et dimensionnement de sécurité.',
    language: 'Français',
    pages: 410,
    addedDate: '2025-03-20',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Traction et compression uniaxiale', page: 1 },
      { number: 2, title: 'Cisaillement simple et liaisons mécaniques', page: 95 },
      { number: 3, title: 'Flexion plane simple et diagrammes des moments', page: 185 },
      { number: 4, title: 'Torsion des arbres circulaires et critères de limite élastique', page: 290 }
    ]
  },
  {
    id: 'b-014',
    title: 'Maintenance Industrielle & Sûreté de Fonctionnement',
    author: 'Jean-Pierre Souris',
    isbn: '978-2-10-075892-1',
    category: 'Maintenance & Qualité',
    department: 'Génie Industriel',
    publishedYear: 2022,
    publisher: 'Dunod',
    shelfLocation: 'Rayon EST-INDUS-03',
    coverUrl: 'https://covers.openlibrary.org/b/id/3121088-L.jpg',
    summary: 'Stratégies de maintenance préventive, conditionnelle et corrective : lois de fiabilité (Weibull), calcul du MTBF/MTTR et méthode AMDEC machine.',
    language: 'Français',
    pages: 350,
    addedDate: '2025-03-22',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Organisation et types de maintenance industrielle', page: 1 },
      { number: 2, title: 'Indicateurs de fiabilité : MTBF, MTTR et taux de défaillance', page: 80 },
      { number: 3, title: 'Méthode AMDEC (Analyse des Modes de Défaillance)', page: 170 },
      { number: 4, title: 'Gestion de maintenance assistée par ordinateur (GMAO)', page: 250 }
    ]
  },
  {
    id: 'b-015',
    title: 'Cybersécurité & Tests d\'Intrusion (Ethical Hacking)',
    author: 'François Coupez, Alexandre Gomez',
    isbn: '978-2-409-02941-8',
    category: 'Sécurité Informatique',
    department: 'Génie Informatique',
    publishedYear: 2023,
    publisher: 'Éditions ENI',
    shelfLocation: 'Rayon EST-SEC-01',
    coverUrl: 'https://covers.openlibrary.org/b/id/12903349-L.jpg',
    summary: 'Méthodologie de pentesting : reconnaissance réseau, exploitation de failles web (OWASP Top 10), élévation de privilèges et sécurisation des environnements Linux/Windows.',
    language: 'Français',
    pages: 580,
    addedDate: '2025-03-25',
    isSuggested: true,
    tableOfContents: [
      { number: 1, title: 'Méthodologie de test d\'intrusion et cadre légal', page: 1 },
      { number: 2, title: 'Scan de vulnérabilités et écoute réseau (Nmap, Wireshark)', page: 120 },
      { number: 3, title: 'Attaques applicatives web : SQLi, XSS, CSRF et injection', page: 260 },
      { number: 4, title: 'Post-exploitation, persistance et rapport d\'audit', page: 410 }
    ]
  },
  {
    id: 'b-016',
    title: 'Machine Learning & Science des Données avec Python',
    author: 'Aurélien Géron',
    isbn: '978-2-10-080115-2',
    category: 'Intelligence Artificielle',
    department: 'Génie Informatique',
    publishedYear: 2022,
    publisher: 'Dunod',
    shelfLocation: 'Rayon EST-INFO-05',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9782100801152-L.jpg',
    summary: 'Apprentissage automatique pratique avec Scikit-Learn, Pandas et NumPy : régressions, arbres de décision, forêts aléatoires, SVM et réseaux de neurones.',
    language: 'Français',
    pages: 640,
    addedDate: '2025-03-28',
    isSuggested: true,
    tableOfContents: [
      { number: 1, title: 'Cycle de vie d\'un projet de Data Science', page: 1 },
      { number: 2, title: 'Classification et régression avec Scikit-Learn', page: 130 },
      { number: 3, title: 'Ensemble Learning et Random Forests', page: 280 },
      { number: 4, title: 'Introduction aux réseaux de neurones profonds', page: 450 }
    ]
  },
  {
    id: 'b-017',
    title: 'Mathématiques pour l\'Ingénieur : Algèbre Linéaire & Analyse',
    author: 'Pierre Burg',
    isbn: '978-2-10-077142-5',
    category: 'Mathématiques',
    department: 'Sciences Fondamentales',
    publishedYear: 2021,
    publisher: 'Dunod',
    shelfLocation: 'Rayon EST-MATH-01',
    coverUrl: 'https://covers.openlibrary.org/b/id/3085733-L.jpg',
    summary: 'Espaces vectoriels, diagonalisation des matrices, séries de Fourier, équations différentielles et intégrales multiples pour les sciences appliquées.',
    language: 'Français',
    pages: 450,
    addedDate: '2025-04-01',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Calcul matriciel et valeurs propres', page: 1 },
      { number: 2, title: 'Développements limités et séries numériques', page: 110 },
      { number: 3, title: 'Séries et transformée de Fourier', page: 220 },
      { number: 4, title: 'Équations différentielles linéaires d\'ordre 1 et 2', page: 330 }
    ]
  },
  {
    id: 'b-018',
    title: 'Thermodynamique Appliquée & Transferts Thermiques',
    author: 'Michel Feidt',
    isbn: '978-2-10-082103-7',
    category: 'Physique & Énergétique',
    department: 'Sciences Fondamentales',
    publishedYear: 2022,
    publisher: 'Dunod',
    shelfLocation: 'Rayon EST-PHYS-01',
    coverUrl: 'https://covers.openlibrary.org/b/id/15077911-L.jpg',
    summary: 'Principes de la thermodynamique, cycles des moteurs thermiques et frigorifiques, et modes de transfert thermique (conduction, convection, rayonnement).',
    language: 'Français',
    pages: 380,
    addedDate: '2025-04-05',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Premier et deuxième principes de la thermodynamique', page: 1 },
      { number: 2, title: 'Cycles thermodynamiques moteurs et récepteurs', page: 95 },
      { number: 3, title: 'Conduction thermique en régime stationnaire', page: 190 },
      { number: 4, title: 'Convection et échangeurs thermiques industriels', page: 285 }
    ]
  },
  {
    id: 'b-019',
    title: 'Droit du Travail et des Affaires au Maroc',
    author: 'Mohamed Jalal Essaid',
    isbn: '978-9-954-10521-3',
    category: 'Droit & Législation',
    department: 'Management & Gestion',
    publishedYear: 2023,
    publisher: 'Éditions La Porte Fès',
    shelfLocation: 'Rayon EST-GEST-04',
    coverUrl: 'https://covers.openlibrary.org/b/id/3156526-L.jpg',
    summary: 'Cadre juridique marocain des relations professionnelles : contrat de travail, obligations de l\'employeur, conventions collectives, litiges et droit des sociétés commerciales.',
    language: 'Français',
    pages: 310,
    addedDate: '2025-04-10',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Formation et exécution du contrat de travail', page: 10 },
      { number: 2, title: 'Durée légale du travail, congés et salaires', page: 85 },
      { number: 3, title: 'Rupture du contrat et licenciement', page: 160 },
      { number: 4, title: 'Formes juridiques des entreprises : SARL et SA', page: 230 }
    ]
  },
  {
    id: 'b-020',
    title: 'Anglais Professionnel & Technique pour l\'Ingénieur',
    author: 'David Horner, Peter Strutt',
    isbn: '978-2-7440-7419-6',
    category: 'Langues & Communication',
    department: 'Sciences Fondamentales',
    publishedYear: 2022,
    publisher: 'Pearson France',
    shelfLocation: 'Rayon EST-LANG-01',
    coverUrl: 'https://covers.openlibrary.org/b/id/12419910-L.jpg',
    summary: 'Communication professionnelle en langue anglaise : rédaction de rapports techniques, présentations d\'ingénierie, réunions internationales et vocabulaire industriel.',
    language: 'Anglais',
    pages: 260,
    addedDate: '2025-04-12',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Technical descriptions and specifications', page: 1 },
      { number: 2, title: 'Delivering technical presentations and demos', page: 65 },
      { number: 3, title: 'Writing engineering reports and emails', page: 130 },
      { number: 4, title: 'Job interview preparation for engineers', page: 195 }
    ]
  },
  {
    id: 'b-021',
    title: 'Cloud Computing & Déploiement Conteneurisé avec Docker et Kubernetes',
    author: 'Sébastien Blanc, Jérôme Petazzoni',
    isbn: '978-2-409-03102-2',
    category: 'DevOps & Cloud',
    department: 'Génie Informatique',
    publishedYear: 2023,
    publisher: 'Éditions ENI',
    shelfLocation: 'Rayon EST-INFO-06',
    coverUrl: 'https://covers.openlibrary.org/b/id/15125161-L.jpg',
    summary: 'Virtualisation légère et orchestration d\'architectures microservices : création d\'images Dockerfile, clusters Kubernetes, ingress et pipelines CI/CD.',
    language: 'Français',
    pages: 440,
    addedDate: '2025-04-15',
    isSuggested: true,
    tableOfContents: [
      { number: 1, title: 'Principes de la conteneurisation et architecture Docker', page: 1 },
      { number: 2, title: 'Gestion des réseaux et volumes Docker', page: 110 },
      { number: 3, title: 'Orchestration avec Kubernetes : Pods, Services, Deployments', page: 215 },
      { number: 4, title: 'Intégration continue et déploiement automatisé (CI/CD)', page: 330 }
    ]
  },
  {
    id: 'b-022',
    title: 'Statistiques Appliquées & Maîtrise Statistique des Procédés (MSP/SPC)',
    author: 'Maurice Pillet',
    isbn: '978-2-212-56901-8',
    category: 'Qualité Industrielle',
    department: 'Génie Industriel',
    publishedYear: 2021,
    publisher: 'Eyrolles',
    shelfLocation: 'Rayon EST-INDUS-04',
    coverUrl: 'https://covers.openlibrary.org/b/id/3118625-L.jpg',
    summary: 'Contrôle qualité des fabrications industrielles : cartes de contrôle de Shewhart (X-barre, R), capabilité des machines (Cp, Cpk) et démarche Six Sigma.',
    language: 'Français',
    pages: 330,
    addedDate: '2025-04-18',
    isSuggested: false,
    tableOfContents: [
      { number: 1, title: 'Variabilité industrielle et loi normale', page: 1 },
      { number: 2, title: 'Cartes de contrôle aux mesures et aux attributs', page: 75 },
      { number: 3, title: 'Indicateurs de capabilité machine et procédé (Cp, Cpk)', page: 160 },
      { number: 4, title: 'Démarche Six Sigma DMAIC', page: 245 }
    ]
  }
];

// Exemplaires physiques précis pour tous les ouvrages (min 20 ouvrages, chacun 2 à 3 exemplaires avec QR code)
export const INITIAL_COPIES: BookCopy[] = [
  // b-001 (Algorithmique)
  { id: 'CP-b001-01', bookId: 'b-001', copyNumber: 1, barcode: 'BC-EST-INFO-001-A', qrCode: 'QR-EST-b001-01', shelfLocation: 'Rayon INFO-01 (Travée A, Étagère 1)', condition: 'Excellent', status: 'emprunte', currentLoanId: 'l-001', acquisitionDate: '2024-09-01' },
  { id: 'CP-b001-02', bookId: 'b-001', copyNumber: 2, barcode: 'BC-EST-INFO-001-B', qrCode: 'QR-EST-b001-02', shelfLocation: 'Rayon INFO-01 (Travée A, Étagère 1)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2024-09-01' },
  { id: 'CP-b001-03', bookId: 'b-001', copyNumber: 3, barcode: 'BC-EST-INFO-001-C', qrCode: 'QR-EST-b001-03', shelfLocation: 'Rayon INFO-01 (Travée A, Étagère 1)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-01-10' },

  // b-002 (UML)
  { id: 'CP-b002-01', bookId: 'b-002', copyNumber: 1, barcode: 'BC-EST-INFO-002-A', qrCode: 'QR-EST-b002-01', shelfLocation: 'Rayon INFO-02 (Travée B, Étagère 2)', condition: 'Excellent', status: 'emprunte', currentLoanId: 'l-002', acquisitionDate: '2024-09-01' },
  { id: 'CP-b002-02', bookId: 'b-002', copyNumber: 2, barcode: 'BC-EST-INFO-002-B', qrCode: 'QR-EST-b002-02', shelfLocation: 'Rayon INFO-02 (Travée B, Étagère 2)', condition: 'Usure normale', status: 'disponible', currentLoanId: null, acquisitionDate: '2024-09-01' },

  // b-003 (Réseaux)
  { id: 'CP-b003-01', bookId: 'b-003', copyNumber: 1, barcode: 'BC-EST-RES-003-A', qrCode: 'QR-EST-b003-01', shelfLocation: 'Rayon RES-01 (Travée C, Étagère 1)', condition: 'Bon état', status: 'emprunte', currentLoanId: 'l-003', acquisitionDate: '2024-10-05' },
  { id: 'CP-b003-02', bookId: 'b-003', copyNumber: 2, barcode: 'BC-EST-RES-003-B', qrCode: 'QR-EST-b003-02', shelfLocation: 'Rayon RES-01 (Travée C, Étagère 1)', condition: 'Excellent', status: 'disponible', currentLoanId: null, acquisitionDate: '2024-10-05' },

  // b-004 (Automatique)
  { id: 'CP-b004-01', bookId: 'b-004', copyNumber: 1, barcode: 'BC-EST-ELEC-004-A', qrCode: 'QR-EST-b004-01', shelfLocation: 'Rayon ELEC-03 (Travée D, Étagère 1)', condition: 'Bon état', status: 'emprunte', currentLoanId: 'l-004', acquisitionDate: '2024-11-12' },
  { id: 'CP-b004-02', bookId: 'b-004', copyNumber: 2, barcode: 'BC-EST-ELEC-004-B', qrCode: 'QR-EST-b004-02', shelfLocation: 'Rayon ELEC-03 (Travée D, Étagère 1)', condition: 'Bon état', status: 'emprunte', currentLoanId: 'l-005', acquisitionDate: '2024-11-12' },

  // b-005 (Lean)
  { id: 'CP-b005-01', bookId: 'b-005', copyNumber: 1, barcode: 'BC-EST-INDUS-005-A', qrCode: 'QR-EST-b005-01', shelfLocation: 'Rayon INDUS-02 (Travée E, Étagère 3)', condition: 'Excellent', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-01-15' },
  { id: 'CP-b005-02', bookId: 'b-005', copyNumber: 2, barcode: 'BC-EST-INDUS-005-B', qrCode: 'QR-EST-b005-02', shelfLocation: 'Rayon INDUS-02 (Travée E, Étagère 3)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-01-15' },

  // b-006 (Comptabilité)
  { id: 'CP-b006-01', bookId: 'b-006', copyNumber: 1, barcode: 'BC-EST-GEST-006-A', qrCode: 'QR-EST-b006-01', shelfLocation: 'Rayon GEST-01 (Travée F, Étagère 2)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-02-01' },

  // b-007 (Web React)
  { id: 'CP-b007-01', bookId: 'b-007', copyNumber: 1, barcode: 'BC-EST-INFO-007-A', qrCode: 'QR-EST-b007-01', shelfLocation: 'Rayon INFO-03 (Travée A, Étagère 3)', condition: 'Excellent', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-01' },
  { id: 'CP-b007-02', bookId: 'b-007', copyNumber: 2, barcode: 'BC-EST-INFO-007-B', qrCode: 'QR-EST-b007-02', shelfLocation: 'Rayon INFO-03 (Travée A, Étagère 3)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-01' },

  // b-008 (SQL)
  { id: 'CP-b008-01', bookId: 'b-008', copyNumber: 1, barcode: 'BC-EST-INFO-008-A', qrCode: 'QR-EST-b008-01', shelfLocation: 'Rayon INFO-04 (Travée B, Étagère 1)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-05' },

  // b-009 (Électronique puissance)
  { id: 'CP-b009-01', bookId: 'b-009', copyNumber: 1, barcode: 'BC-EST-ELEC-009-A', qrCode: 'QR-EST-b009-01', shelfLocation: 'Rayon ELEC-01 (Travée D, Étagère 2)', condition: 'Excellent', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-10' },

  // b-010 (ARM Cortex)
  { id: 'CP-b010-01', bookId: 'b-010', copyNumber: 1, barcode: 'BC-EST-ELEC-010-A', qrCode: 'QR-EST-b010-01', shelfLocation: 'Rayon ELEC-02 (Travée D, Étagère 3)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-12' },

  // b-011 (Agile Scrum)
  { id: 'CP-b011-01', bookId: 'b-011', copyNumber: 1, barcode: 'BC-EST-GEST-011-A', qrCode: 'QR-EST-b011-01', shelfLocation: 'Rayon GEST-02 (Travée F, Étagère 1)', condition: 'Excellent', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-15' },
  { id: 'CP-b011-02', bookId: 'b-011', copyNumber: 2, barcode: 'BC-EST-GEST-011-B', qrCode: 'QR-EST-b011-02', shelfLocation: 'Rayon GEST-02 (Travée F, Étagère 1)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-15' },

  // b-012 (Marketing Digital)
  { id: 'CP-b012-01', bookId: 'b-012', copyNumber: 1, barcode: 'BC-EST-GEST-012-A', qrCode: 'QR-EST-b012-01', shelfLocation: 'Rayon GEST-03 (Travée F, Étagère 3)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-18' },

  // b-013 (RDM)
  { id: 'CP-b013-01', bookId: 'b-013', copyNumber: 1, barcode: 'BC-EST-INDUS-013-A', qrCode: 'QR-EST-b013-01', shelfLocation: 'Rayon INDUS-01 (Travée E, Étagère 1)', condition: 'Excellent', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-20' },

  // b-014 (Maintenance)
  { id: 'CP-b014-01', bookId: 'b-014', copyNumber: 1, barcode: 'BC-EST-INDUS-014-A', qrCode: 'QR-EST-b014-01', shelfLocation: 'Rayon INDUS-03 (Travée E, Étagère 2)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-22' },

  // b-015 (Cybersécurité)
  { id: 'CP-b015-01', bookId: 'b-015', copyNumber: 1, barcode: 'BC-EST-SEC-015-A', qrCode: 'QR-EST-b015-01', shelfLocation: 'Rayon SEC-01 (Travée C, Étagère 3)', condition: 'Excellent', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-25' },
  { id: 'CP-b015-02', bookId: 'b-015', copyNumber: 2, barcode: 'BC-EST-SEC-015-B', qrCode: 'QR-EST-b015-02', shelfLocation: 'Rayon SEC-01 (Travée C, Étagère 3)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-25' },

  // b-016 (Machine Learning)
  { id: 'CP-b016-01', bookId: 'b-016', copyNumber: 1, barcode: 'BC-EST-INFO-016-A', qrCode: 'QR-EST-b016-01', shelfLocation: 'Rayon INFO-05 (Travée B, Étagère 3)', condition: 'Excellent', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-03-28' },

  // b-017 (Maths)
  { id: 'CP-b017-01', bookId: 'b-017', copyNumber: 1, barcode: 'BC-EST-MATH-017-A', qrCode: 'QR-EST-b017-01', shelfLocation: 'Rayon MATH-01 (Travée G, Étagère 1)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-04-01' },

  // b-018 (Thermodynamique)
  { id: 'CP-b018-01', bookId: 'b-018', copyNumber: 1, barcode: 'BC-EST-PHYS-018-A', qrCode: 'QR-EST-b018-01', shelfLocation: 'Rayon PHYS-01 (Travée G, Étagère 2)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-04-05' },

  // b-019 (Droit Travail)
  { id: 'CP-b019-01', bookId: 'b-019', copyNumber: 1, barcode: 'BC-EST-GEST-019-A', qrCode: 'QR-EST-b019-01', shelfLocation: 'Rayon GEST-04 (Travée F, Étagère 4)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-04-10' },

  // b-020 (Anglais Technique)
  { id: 'CP-b020-01', bookId: 'b-020', copyNumber: 1, barcode: 'BC-EST-LANG-020-A', qrCode: 'QR-EST-b020-01', shelfLocation: 'Rayon LANG-01 (Travée G, Étagère 3)', condition: 'Excellent', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-04-12' },

  // b-021 (Cloud Docker)
  { id: 'CP-b021-01', bookId: 'b-021', copyNumber: 1, barcode: 'BC-EST-INFO-021-A', qrCode: 'QR-EST-b021-01', shelfLocation: 'Rayon INFO-06 (Travée A, Étagère 4)', condition: 'Excellent', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-04-15' },

  // b-022 (Statistiques Industrielles)
  { id: 'CP-b022-01', bookId: 'b-022', copyNumber: 1, barcode: 'BC-EST-INDUS-022-A', qrCode: 'QR-EST-b022-01', shelfLocation: 'Rayon INDUS-04 (Travée E, Étagère 4)', condition: 'Bon état', status: 'disponible', currentLoanId: null, acquisitionDate: '2025-04-18' }
];

// Étudiants répertoriés à l'EST
export const INITIAL_STUDENTS: StudentMember[] = [
  {
    id: 'st-001',
    institutionalId: 'USMBA-EST-2024-1042',
    apogeeCode: '21004581',
    cne: 'N134098412',
    firstName: 'Karim',
    lastName: 'Bennani',
    email: 'karim.bennani@usmba.ac.ma',
    phone: '06 61 24 58 90',
    institution: 'EST Fès - USMBA',
    sector: 'DUT Informatique',
    studyYear: '2ème Année',
    status: 'active',
    registeredDate: '2024-09-12',
    maxAllowedLoans: 3
  },
  {
    id: 'st-002',
    institutionalId: 'USMBA-EST-2024-2108',
    apogeeCode: '22003890',
    cne: 'S142087541',
    firstName: 'Yassine',
    lastName: 'El Amrani',
    email: 'yassine.elamrani@usmba.ac.ma',
    phone: '06 72 45 10 99',
    institution: 'EST Fès - USMBA',
    sector: 'Licence Pro DSI',
    studyYear: 'Licence Pro',
    status: 'active',
    registeredDate: '2024-09-15',
    maxAllowedLoans: 3
  },
  {
    id: 'st-003',
    institutionalId: 'USMBA-EST-2025-3045',
    apogeeCode: '23001244',
    cne: 'M130097652',
    firstName: 'Salma',
    lastName: 'Kabbaj',
    email: 'salma.kabbaj@usmba.ac.ma',
    phone: '07 01 33 22 88',
    institution: 'EST Fès - USMBA',
    sector: 'DUT Informatique',
    studyYear: '1ère Année',
    status: 'active',
    registeredDate: '2025-09-08',
    maxAllowedLoans: 3
  },
  {
    id: 'st-004',
    institutionalId: 'USMBA-EST-2024-4112',
    apogeeCode: '21008761',
    cne: 'N145023984',
    firstName: 'Mehdi',
    lastName: 'Tazi',
    email: 'mehdi.tazi@usmba.ac.ma',
    phone: '06 50 19 82 74',
    institution: 'EST Fès - USMBA',
    sector: 'DUT Génie Électrique',
    studyYear: '2ème Année',
    status: 'active',
    registeredDate: '2024-09-10',
    maxAllowedLoans: 3
  },
  {
    id: 'st-005',
    institutionalId: 'USMBA-EST-2024-5190',
    apogeeCode: '22007812',
    cne: 'S138012478',
    firstName: 'Hajar',
    lastName: 'Idrissi',
    email: 'hajar.idrissi@usmba.ac.ma',
    phone: '06 63 90 12 34',
    institution: 'EST Fès - USMBA',
    sector: 'DUT Génie Industriel',
    studyYear: '2ème Année',
    status: 'active',
    registeredDate: '2024-09-14',
    maxAllowedLoans: 3
  },
  {
    id: 'st-006',
    institutionalId: 'USMBA-EST-2025-6014',
    apogeeCode: '24003491',
    cne: 'M139045612',
    firstName: 'Othmane',
    lastName: 'Chraibi',
    email: 'othmane.chraibi@usmba.ac.ma',
    phone: '07 68 11 44 20',
    institution: 'EST Fès - USMBA',
    sector: 'DUT Gestion des Entreprises',
    studyYear: '1ère Année',
    status: 'active',
    registeredDate: '2025-09-10',
    maxAllowedLoans: 3
  }
];

export const INITIAL_LOANS: Loan[] = [
  {
    id: 'l-001',
    receiptNumber: 'REC-2026-8001',
    copyId: 'CP-b001-01',
    bookId: 'b-001',
    copyNumber: 1,
    qrCode: 'QR-EST-b001-01',
    studentId: 'st-001',
    borrowDate: '2026-10-25',
    dueDate: '2026-11-15',
    returnDate: null,
    status: 'active',
    notes: 'Exemplaire n°1 prêté avec code QR vérifié.',
    renewalCount: 0
  },
  {
    id: 'l-002',
    receiptNumber: 'REC-2026-8002',
    copyId: 'CP-b002-01',
    bookId: 'b-002',
    copyNumber: 1,
    qrCode: 'QR-EST-b002-01',
    studentId: 'st-002',
    borrowDate: '2026-10-10',
    dueDate: '2026-10-31',
    returnDate: null,
    status: 'overdue',
    notes: 'Projet de fin d\'études DSI.',
    renewalCount: 0,
    lastReminderSent: '2026-11-02',
    remindedCount: 1
  },
  {
    id: 'l-003',
    receiptNumber: 'REC-2026-8003',
    copyId: 'CP-b003-01',
    bookId: 'b-003',
    copyNumber: 1,
    qrCode: 'QR-EST-b003-01',
    studentId: 'st-003',
    borrowDate: '2026-10-12',
    dueDate: '2026-11-02',
    returnDate: null,
    status: 'overdue',
    notes: 'TP Réseaux TCP/IP.',
    renewalCount: 0,
    lastReminderSent: '2026-11-05',
    remindedCount: 1
  },
  {
    id: 'l-004',
    receiptNumber: 'REC-2026-8004',
    copyId: 'CP-b004-01',
    bookId: 'b-004',
    copyNumber: 1,
    qrCode: 'QR-EST-b004-01',
    studentId: 'st-004',
    borrowDate: '2026-10-28',
    dueDate: '2026-11-18',
    returnDate: null,
    status: 'active',
    notes: 'Systèmes asservis.',
    renewalCount: 0
  },
  {
    id: 'l-005',
    receiptNumber: 'REC-2026-8005',
    copyId: 'CP-b004-02',
    bookId: 'b-004',
    copyNumber: 2,
    qrCode: 'QR-EST-b004-02',
    studentId: 'st-005',
    borrowDate: '2026-10-29',
    dueDate: '2026-11-19',
    returnDate: null,
    status: 'active',
    notes: 'Exemplaire n°2.',
    renewalCount: 0
  },
  {
    id: 'l-006',
    receiptNumber: 'REC-2026-8006',
    copyId: 'CP-b001-02',
    bookId: 'b-001',
    copyNumber: 2,
    qrCode: 'QR-EST-b001-02',
    studentId: 'st-006',
    borrowDate: '2026-09-10',
    dueDate: '2026-10-01',
    returnDate: '2026-09-28',
    status: 'returned',
    notes: 'Exemplaire retourné en parfait état et remis en rayon.',
    renewalCount: 0
  },
  {
    id: 'l-007',
    receiptNumber: 'REC-2026-8007',
    copyId: 'CP-b005-01',
    bookId: 'b-005',
    copyNumber: 1,
    qrCode: 'QR-EST-b005-01',
    studentId: 'st-003',
    borrowDate: '2026-11-01',
    dueDate: '2026-11-22',
    returnDate: null,
    status: 'active',
    notes: 'Deuxième emprunt actif pour Salma Kabbaj.',
    renewalCount: 0
  },
  {
    id: 'l-008',
    receiptNumber: 'REC-2026-8008',
    copyId: 'CP-b006-01',
    bookId: 'b-006',
    copyNumber: 1,
    qrCode: 'QR-EST-b006-01',
    studentId: 'st-003',
    borrowDate: '2026-11-04',
    dueDate: '2026-11-25',
    returnDate: null,
    status: 'active',
    notes: 'Troisième emprunt actif pour Salma Kabbaj (Plafond 3/3 atteint).',
    renewalCount: 0
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: '2026-11-05 10:14',
    type: 'loan',
    description: 'Prêt validé : Exemplaire n°1 (QR-EST-b004-01) prêté à Mehdi Tazi (USMBA-EST-2024-4112).'
  },
  {
    id: 'act-2',
    timestamp: '2026-11-02 14:30',
    type: 'mass_reminder',
    description: 'Relance des retards envoyée aux étudiants en dépassement d\'échéance.'
  },
  {
    id: 'act-3',
    timestamp: '2026-09-28 16:45',
    type: 'return',
    description: 'Retour immédiat : Exemplaire n°2 (QR-EST-b001-02) remis en disponibilité immédiate en rayon.'
  }
];

export const INITIAL_REQUESTS: LoanRequest[] = [
  {
    id: 'req-001',
    receiptNumber: 'RES-2026-1001',
    studentId: 'st-001',
    studentName: 'Karim Bennani',
    studentInstitutionalId: 'USMBA-EST-2024-1042',
    bookId: 'b-007',
    copyId: 'CP-b007-02',
    bookTitle: 'Programmation Web Moderne : React, Node.js & TypeScript',
    author: 'Éric Sarrion',
    department: 'Génie Informatique',
    copyNumber: 2,
    qrCode: 'QR-EST-b007-02',
    shelfLocation: 'Rayon EST-INFO-03',
    coverUrl: 'https://covers.openlibrary.org/b/id/10282783-L.jpg',
    requestDate: '2026-11-18',
    requestTime: '08:30',
    status: 'pending'
  },
  {
    id: 'req-002',
    receiptNumber: 'RES-2026-1002',
    studentId: 'st-002',
    studentName: 'Yassine El Amrani',
    studentInstitutionalId: 'USMBA-EST-2024-2108',
    bookId: 'b-016',
    copyId: 'CP-b016-01',
    bookTitle: 'Machine Learning & Science des Données avec Python',
    author: 'Aurélien Géron',
    department: 'Génie Informatique',
    copyNumber: 1,
    qrCode: 'QR-EST-b016-01',
    shelfLocation: 'Rayon EST-INFO-05',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9782100801152-L.jpg',
    requestDate: '2026-11-18',
    requestTime: '09:12',
    status: 'pending'
  },
  {
    id: 'req-003',
    receiptNumber: 'RES-2026-1003',
    studentId: 'st-004',
    studentName: 'Mehdi Tazi',
    studentInstitutionalId: 'USMBA-EST-2024-4112',
    bookId: 'b-001',
    copyId: 'CP-b001-02',
    bookTitle: 'Algorithmique et Structures de Données Avancées',
    author: 'Thomas H. Cormen',
    department: 'Génie Informatique',
    copyNumber: 2,
    qrCode: 'QR-EST-b001-02',
    shelfLocation: 'Rayon INFO-01 (Travée A, Étagère 1)',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    requestDate: '2026-11-18',
    requestTime: '09:40',
    status: 'pending'
  },
  {
    id: 'req-004',
    receiptNumber: 'RES-2026-1004',
    studentId: 'st-006',
    studentName: 'Othmane Chraibi',
    studentInstitutionalId: 'USMBA-EST-2025-6014',
    bookId: 'b-001',
    copyId: 'CP-b001-02',
    bookTitle: 'Algorithmique et Structures de Données Avancées',
    author: 'Thomas H. Cormen',
    department: 'Génie Informatique',
    copyNumber: 2,
    qrCode: 'QR-EST-b001-02',
    shelfLocation: 'Rayon INFO-01 (Travée A, Étagère 1)',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    requestDate: '2026-11-18',
    requestTime: '09:45',
    status: 'pending'
  },
  {
    id: 'req-005',
    receiptNumber: 'RES-2026-1005',
    studentId: 'st-003',
    studentName: 'Salma Kabbaj',
    studentInstitutionalId: 'USMBA-EST-2025-3045',
    bookId: 'b-005',
    copyId: 'CP-b005-02',
    bookTitle: 'Lean Manufacturing & Excellence Opérationnelle',
    author: 'Jeffrey Liker',
    department: 'Génie Industriel',
    copyNumber: 2,
    qrCode: 'QR-EST-b005-02',
    shelfLocation: 'Rayon INDUS-02 (Travée E, Étagère 3)',
    coverUrl: 'https://covers.openlibrary.org/b/id/7984916-L.jpg',
    requestDate: '2026-11-18',
    requestTime: '10:05',
    status: 'pending'
  },
  {
    id: 'req-006',
    receiptNumber: 'RES-2026-1006',
    studentId: 'st-005',
    studentName: 'Hajar Idrissi',
    studentInstitutionalId: 'USMBA-EST-2024-5190',
    bookId: 'b-003',
    copyId: 'CP-b003-01',
    bookTitle: 'Réseaux Informatiques : Notions Fondamentales & Protocoles TCP/IP',
    author: 'Andrew Tanenbaum',
    department: 'Génie Informatique',
    copyNumber: 1,
    qrCode: 'QR-EST-b003-01',
    shelfLocation: 'Rayon RES-01 (Travée C, Étagère 1)',
    coverUrl: 'https://covers.openlibrary.org/b/id/8302561-L.jpg',
    requestDate: '2026-11-18',
    requestTime: '10:20',
    status: 'pending'
  },
  {
    id: 'req-007',
    receiptNumber: 'RES-2026-1007',
    studentId: 'st-006',
    studentName: 'Othmane Chraibi',
    studentInstitutionalId: 'USMBA-EST-2025-6014',
    bookId: 'b-008',
    copyId: 'CP-b008-01',
    bookTitle: 'Bases de Données Relationnelles & Langage SQL Avancé',
    author: 'C.J. Date',
    department: 'Génie Informatique',
    copyNumber: 1,
    qrCode: 'QR-EST-b008-01',
    shelfLocation: 'Rayon INFO-04 (Travée B, Étagère 1)',
    coverUrl: 'https://covers.openlibrary.org/b/id/9255566-L.jpg',
    requestDate: '2026-11-18',
    requestTime: '10:35',
    status: 'pending'
  },
  {
    id: 'req-008',
    receiptNumber: 'RES-2026-1008',
    studentId: 'st-004',
    studentName: 'Mehdi Tazi',
    studentInstitutionalId: 'USMBA-EST-2024-4112',
    bookId: 'b-009',
    copyId: 'CP-b009-01',
    bookTitle: 'Électronique de Puissance : Convertisseurs & Commandes Numériques',
    author: 'Guy Séguier',
    department: 'Génie Électrique',
    copyNumber: 1,
    qrCode: 'QR-EST-b009-01',
    shelfLocation: 'Rayon ELEC-01 (Travée D, Étagère 2)',
    coverUrl: 'https://covers.openlibrary.org/b/id/10412891-L.jpg',
    requestDate: '2026-11-18',
    requestTime: '10:48',
    status: 'pending'
  },
  {
    id: 'req-009',
    receiptNumber: 'RES-2026-1009',
    studentId: 'st-005',
    studentName: 'Hajar Idrissi',
    studentInstitutionalId: 'USMBA-EST-2024-5190',
    bookId: 'b-005',
    copyId: 'CP-b005-01',
    bookTitle: 'Lean Manufacturing & Excellence Opérationnelle',
    author: 'Jeffrey Liker',
    department: 'Génie Industriel',
    copyNumber: 1,
    qrCode: 'QR-EST-b005-01',
    shelfLocation: 'Rayon INDUS-02 (Travée E, Étagère 3)',
    coverUrl: 'https://covers.openlibrary.org/b/id/7984916-L.jpg',
    requestDate: '2026-11-18',
    requestTime: '11:00',
    status: 'pending'
  },
  {
    id: 'req-010',
    receiptNumber: 'RES-2026-1010',
    studentId: 'st-001',
    studentName: 'Karim Bennani',
    studentInstitutionalId: 'USMBA-EST-2024-1042',
    bookId: 'b-002',
    copyId: 'CP-b002-02',
    bookTitle: 'Conception Orientée Objet avec UML 2 et Design Patterns',
    author: 'Craig Larman',
    department: 'Génie Informatique',
    copyNumber: 2,
    qrCode: 'QR-EST-b002-02',
    shelfLocation: 'Rayon INFO-02 (Travée B, Étagère 2)',
    coverUrl: 'https://covers.openlibrary.org/b/id/7895231-L.jpg',
    requestDate: '2026-11-17',
    requestTime: '14:20',
    status: 'approved',
    loanId: 'l-002'
  },
  {
    id: 'req-011',
    receiptNumber: 'RES-2026-1011',
    studentId: 'st-002',
    studentName: 'Yassine El Amrani',
    studentInstitutionalId: 'USMBA-EST-2024-2108',
    bookId: 'b-004',
    copyId: 'CP-b004-01',
    bookTitle: 'Automatique Linéaire & Régulation Industrielle',
    author: 'Pierre Borne',
    department: 'Génie Électrique',
    copyNumber: 1,
    qrCode: 'QR-EST-b004-01',
    shelfLocation: 'Rayon ELEC-03 (Travée D, Étagère 1)',
    coverUrl: 'https://covers.openlibrary.org/b/id/6541289-L.jpg',
    requestDate: '2026-11-16',
    requestTime: '16:05',
    status: 'rejected',
    rejectionReason: 'Exemplaire réservé aux travaux pratiques de fin de semestre.'
  }
];

export const INITIAL_NOTIFICATIONS: import('../types/library').AppNotification[] = [
  {
    id: 'notif-001',
    recipientId: 'st-001',
    recipientName: 'Karim Bennani',
    title: "Retard de retour",
    message: "Retard de retour : vous avez dépassé la date limite de restitution de votre livre Algorithmique et Structures de Données Avancées. Veuillez le retourner rapidement.",
    timestamp: '2026-11-09 09:15',
    date: '2026-11-09',
    isRead: false,
    type: 'return_overdue',
    bookTitle: 'Algorithmique et Structures de Données Avancées',
    copyNumber: 1
  },
  {
    id: 'notif-002',
    recipientId: 'st-001',
    recipientName: 'Karim Bennani',
    title: "Demande d'emprunt acceptée",
    message: "Votre demande d'emprunt pour « Génie Logiciel & Modélisation UML 2.5 » a été acceptée. Vous pouvez récupérer votre livre à la bibliothèque.",
    timestamp: '2026-11-08 14:30',
    date: '2026-11-08',
    isRead: false,
    type: 'request_accepted',
    bookTitle: 'Génie Logiciel & Modélisation UML 2.5',
    copyNumber: 2
  },
  {
    id: 'notif-003',
    recipientId: 'st-001',
    recipientName: 'Karim Bennani',
    title: "Rappel de restitution (J-3)",
    message: "Rappel : vous devez retourner le livre « Réseaux Informatiques : Notions Fondamentales & TCP/IP » dans 3 jours.",
    timestamp: '2026-11-06 10:00',
    date: '2026-11-06',
    isRead: true,
    type: 'return_reminder_3days',
    bookTitle: 'Réseaux Informatiques : Notions Fondamentales & TCP/IP'
  },
  {
    id: 'notif-004',
    recipientId: 'gerant',
    title: "Nouvelle demande d'emprunt",
    message: "Nouvelle demande d'emprunt soumise par Karim Bennani pour « Programmation Web Moderne : React, Node.js & TypeScript ».",
    timestamp: '2026-11-08 16:45',
    date: '2026-11-08',
    isRead: false,
    type: 'request_created',
    bookTitle: 'Programmation Web Moderne : React, Node.js & TypeScript'
  },
  {
    id: 'notif-005',
    recipientId: 'gerant',
    title: "Nouvelle demande d'emprunt",
    message: "Nouvelle demande d'emprunt soumise par Yassine El Amrani pour « Machine Learning & Science des Données avec Python ».",
    timestamp: '2026-11-09 10:20',
    date: '2026-11-09',
    isRead: false,
    type: 'request_created',
    bookTitle: 'Machine Learning & Science des Données avec Python'
  }
];

