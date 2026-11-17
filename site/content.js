/** Central editable content. All projects and artwork below are placeholders. */
window.portfolioContent = {
  name: 'Emily Dong', university: 'University of Michigan', majors: ['User Experience Design', 'Art and Design'],
  email: 'emdong@umich.edu', linkedin: 'https://www.linkedin.com/in/em-dong', github: 'https://github.com/EmDong09', instagram: 'https://www.instagram.com/emilydong.art/', resume: null,
  projects: [
    { id: 'campus', title: 'Campus Compass', category: 'digital', description: 'A placeholder concept for exploring campus resources.', tags: ['UX Research', 'Interaction Design'], overview: 'An illustrative starting point for a campus resource finder. Explore a sample resource category below. Real research, project process, and case study content have yet to be added.', sample: true },
    { id: 'ritual', title: 'Everyday Rituals', category: 'digital', description: 'A placeholder concept for a reflective daily interface.', tags: ['UI Design', 'Prototyping'], overview: 'A sample interface exploring a quieter moment in the day. Try the mood selector below to see the concept respond. Responses are temporary and are not collected or saved.', sample: true },
    { id: 'loop', title: 'Local Loop', category: 'digital', description: 'A sample concept for finding small moments of connection close to home.', tags: ['UX Design', 'Community'], overview: 'An illustrative neighborhood discovery concept. No research or outcomes are claimed.', sample: true },
    { id: 'shelf', title: 'Open Shelf', category: 'digital', description: 'A sample exploration of a more personal way to discover your next read.', tags: ['UI Design', 'Interaction Design'], overview: 'An illustrative reading discovery interface. No research or outcomes are claimed.', sample: true },
  ]
};

/**
 * @typedef {{src: string|null, alt: string, caption: string, width: number, height: number}} AboutImage
 * @typedef {{id: string, question: string, answer: string}} FAQ
 * @typedef {{id: string, name: string, description: string, category: string, summary?: string, icon?: string, url?: string|null}} Tool
 * @typedef {{title: string, lead: string, paragraphs: string[], images: AboutImage[], faqs: FAQ[], tools: Tool[], sampleToolkit: boolean, placeholderNotice: string|null, education: {institution: string, program: string, dates?: string|null, details?: string|null}, closing: string}} AboutContent
 */
/** @type {AboutContent} Editable sample copy; confirm personal details and tools before removing notices. */
window.portfolioContent.about = {
  title: 'About Me',
  pills: [
    {id:'pill-1',src:null,alt:'',fill:'#bdc9da'},
    {id:'pill-2',src:null,alt:'',fill:'#d4c8df'},
    {id:'pill-3',src:null,alt:'',fill:'#aebfc0'},
    {id:'pill-4',src:null,alt:'',fill:'#c3cbdc'},
    {id:'pill-5',src:null,alt:'',fill:'#d5d9e2'}
  ],
  lead: 'Hi, I’m Emily — exploring where thoughtful experiences meet visual expression.',
  paragraphs: [
    'I’m studying User Experience Design + Art and Design at the University of Michigan. I’m interested in how useful digital experiences and expressive visual design can work together.',
    // Editable filler, not a verified description of Emily’s process.
    'My process moves between asking questions, sketching possibilities, and making ideas tangible. I’m still exploring the kinds of problems and creative practices I want to grow into.'
  ],
  placeholderNotice: 'This page is taking shape; some details are placeholders.',
  images: [
    {src: null, alt: '', caption: 'Portrait coming soon', width: 720, height: 900},
    {src: null, alt: '', caption: 'A glimpse of my creative process', width: 600, height: 450}
  ],
  faqs: [
    {id: 'designer', question: 'What kind of designer am I becoming?', answer: 'I’m exploring how research, interaction design, and visual storytelling can shape clear, considerate experiences.'},
    {id: 'exploring', question: 'What am I exploring lately?', answer: 'Right now, I’m experimenting with interface ideas, small prototypes, and ways to bring more personality into digital work.'},
    {id: 'outside-design', question: 'What do I enjoy outside of design?', answer: 'This space will eventually hold a few favorite hobbies, creative rituals, and things that keep me curious.'},
    {id: 'next', question: 'What would I like to work on next?', answer: 'I’m using this portfolio to collect my work and discover which questions I want to explore next.'}
  ],
  sampleToolkit: true,
  tools: [
    {id: 'figma', summary: 'Interface layouts & prototypes', name: 'Figma', description: 'Exploring interface layouts, components, and interactive flows.', category: 'Interface design', icon: 'F', url: null},
    {id: 'figjam', summary: 'Research & visual brainstorming', name: 'FigJam', description: 'Mapping questions, organizing ideas, and making sense of research.', category: 'Research & ideation', icon: 'Fj', url: null},
    {id: 'illustrator', summary: 'Vector illustration & layouts', name: 'Adobe Illustrator', description: 'Creating vector illustrations and experimenting with visual systems.', category: 'Vector & illustration', icon: 'Ai', url: null},
    {id: 'photoshop', summary: 'Image editing & compositions', name: 'Adobe Photoshop', description: 'Editing imagery and exploring compositions.', category: 'Image making', icon: 'Ps', url: null},
    {id: 'notion', summary: 'Notes & process documentation', name: 'Notion', description: 'Keeping project notes, references, and process documentation organized.', category: 'Organization', icon: 'N', url: null},
    {id: 'claude-code', summary: 'Interactive web prototypes', name: 'Claude Code', description: 'Turning early ideas into working web prototypes.', category: 'Prototyping', icon: '↗', url: null}
  ],
  education: {institution: 'University of Michigan', program: 'User Experience Design + Art and Design', dates: null, details: null},
  closing: 'Thanks for getting to know me.'
};

/** @type {{eyebrow: string, title: string, description: string, sampleNotice: string, disciplines: string[]}} */
window.portfolioContent.work = {
  eyebrow: 'A COLLECTION OF POSSIBILITIES',
  title: 'Thought into form.',
  description: 'Exploring digital experiences and visual expression, with room for ideas to grow.',
  sampleNotice: 'Sample projects shown while portfolio work is being added.',
  disciplines: ['User experience', 'Interface design', 'Visual expression']
};

/** @type {{eyebrow:string, title:string, description:string, notice:string, palettes:Array<{id:string,name:string,colors:string[]}>}} */
window.portfolioContent.playground = {
  eyebrow: 'SMALL EXPERIMENTS / OPEN POSSIBILITIES',
  title: 'Made for the fun of it',
  description: 'An interactive space for color, form, and type. Change a setting, follow a curiosity, see what happens.',
  notice: 'Interactive placeholder studies created for this portfolio, ready to be replaced with personal explorations.',
  palettes: [
    {id:'studio',name:'Studio',colors:['#2949dc','#efb89a','#d8d1eb','#f8f6f0']},
    {id:'garden',name:'Garden',colors:['#40553e','#d4eaa4','#e9b995','#f5f0df']},
    {id:'afterhours',name:'After hours',colors:['#632f64','#b9b2df','#e8a573','#ede5f1']}
  ]
};

/** Editable sample narratives. Questions and directions below are proposals, not research findings or completed work. */
const sampleCaseStudies = {
 loop: {
  details: {projectType: 'Sample UX concept', team: null, tools: [], timeline: null},
  slug: 'local-loop', headline: 'A little closer to your neighborhood.',
  intro: 'A placeholder exploration of neighborhood discovery, using a simple interface to bring local possibilities into view.',
  question: 'How might a local discovery interface make it easier to explore nearby?',
  context: 'This sample is an early interface idea, not completed project work. Its purpose is to provide a structure for a future case study.',
  questions: ['What information helps someone decide whether to explore a place?', 'How could an interface make local discovery approachable?', 'What access information would need to be verified?'],
  direction: 'One possible direction pairs clear categories with concise place information. These ideas are proposals, rather than validated findings.',
  principles: [{title:'Stay close',body:'Keep nearby possibilities easy to browse.'},{title:'Offer useful context',body:'Leave space for practical, verified details.'},{title:'Make room for everyone',body:'Explore ways to communicate access information clearly.'}],
  flow: ['Explore nearby', 'Find a possibility', 'Learn more'],
  concept: 'The illustrative screen uses neighborhood-inspired shapes and simple place cards. Listings are placeholders and do not represent real businesses or events.',
  reflection: 'A real project would need research, verified listings, accessibility review, and testing. None of those activities or their outcomes are claimed in this sample.'
 },
 shelf: {
  details: {projectType: 'Sample UI concept', team: null, tools: [], timeline: null},
  slug: 'open-shelf', headline: 'Room for your next great read.',
  intro: 'A placeholder visual and interaction concept for discovering books through an inviting, readable interface.',
  question: 'How might a reading interface invite discovery without overwhelming the reader?',
  context: 'This sample provides a starting structure for a future reading-related case study. It is not completed work or a claim of user research.',
  questions: ['What information would help someone explore a book?', 'How could browsing feel more personal?', 'Which interface details would need usability testing?'],
  direction: 'A proposed direction uses editorial typography, a small set of categories, and a flexible reading collection. These choices have not been validated.',
  principles: [{title:'Invite curiosity',body:'Give a small amount of information room to breathe.'},{title:'Keep type readable',body:'Explore hierarchy and contrast before decoration.'},{title:'Support a next step',body:'Make the path from browsing to learning more clear.'}],
  flow: ['Browse a collection', 'Explore a title', 'Consider a next read'],
  concept: 'The abstract book covers and interface elements below are original placeholders, with no real catalog or recommendation data behind them.',
  reflection: 'Future work could replace these placeholders with actual exploration, feedback, and reflections. No testing results, client outcomes, or product impact are claimed.'
 },
 campus: {
  details: {projectType: 'Sample UX concept', team: null, tools: [], timeline: null},
  slug: 'campus-compass', headline: 'A little direction. A lot to discover.',
  intro: 'An illustrative campus-resource concept that brings a place to look, a category to explore, and a next step into one simple interface.',
  question: 'How might a campus resource finder make the first step feel easier?',
  context: 'This sample starts with a question about finding resources on campus. It does not assume that students have a particular problem; that would need to be established through research.',
  questions: ['What do students look for when they need a resource?', 'Which details help someone decide where to go?', 'How can a resource finder support different access needs?'],
  direction: 'A proposed flow starts with a broad category, narrows the options, and leaves space for practical information. These are early design possibilities to explore, rather than validated decisions.',
  principles: [{title:'Start with a need',body:'Explore broad categories before asking someone to know the name of a place.'},{title:'Give useful context',body:'Leave room for location, access information, and accurate resource details.'},{title:'Make the next step clear',body:'Give each resource one understandable action to continue.'}],
  flow: ['Choose a category','Explore resources','Plan a next step'],
  concept: 'The original illustrative screen pairs a campus-inspired map with category shortcuts. Try a category below; the demo has no real resource listings or navigation data.',
  reflection: 'A real project would need verified resource content, conversations with students, accessibility evaluation, and testing of the proposed flow. No research, usability results, or outcomes are being claimed.'
 },
 ritual: {
  details: {projectType: 'Sample UI concept', team: null, tools: [], timeline: null},
  slug: 'everyday-rituals', headline: 'A small moment, just for you.',
  intro: 'An illustrative daily check-in concept exploring a calmer pace, expressive type, and a small moment of reflection.',
  question: 'How might a daily interface leave room to pause?',
  context: 'This placeholder explores the visual and interaction possibilities of a reflective daily interface. It makes no claims about mental-health benefits, habits, or user needs.',
  questions: ['What would make a check-in feel optional and approachable?', 'How much input feels appropriate for a brief interaction?', 'How could the interface respect someone’s privacy?'],
  direction: 'A proposed sequence offers a simple prompt, a small choice, and a short response. The visual direction uses warm neutrals and open space to explore a quieter experience.',
  principles: [{title:'Keep the invitation small',body:'Begin with one clear question instead of a long form.'},{title:'Make space for choice',body:'Treat participation as optional, without scores or streaks.'},{title:'Respect the moment',body:'Keep demo responses temporary and avoid collecting personal information.'}],
  flow: ['Arrive','Choose a mood','Take a moment'],
  concept: 'A sample check-in shows how a selected mood could change the interface response. The choice stays on this page only and is cleared when you leave or refresh.',
  reflection: 'Before becoming a real product, the concept would need a clearer purpose, feedback on tone and usability, and careful decisions about privacy. This sample includes no completed testing or measured outcomes.'
 },
};
window.portfolioContent.projects.forEach(project => { project.caseStudy = sampleCaseStudies[project.id]; });

/** Uploaded portrait and square artwork for the interactive gallery. */
window.portfolioContent.playground.studies = [
  {
    "id": "painting-01",
    "title": "Untitled",
    "medium": "Painting",
    "category": "art",
    "src": "/assets/art/emily-dong-painting.jpg",
    "alt": "A painting of a car interior viewed from the back seat, with passengers and a tablet showing a drawing in progress.",
    "width": 3616,
    "height": 3616
  },
  {
    "id": "clover-stool",
    "title": "Untitled",
    "category": "art",
    "src": "/assets/art/emily-dong-clover-stool.jpg",
    "width": 1800,
    "height": 2400,
    "medium": "Woodworking",
    "alt": "A wooden stool with a clover-shaped seat and three angled legs."
  },
  {
    "id": "portrait-purple",
    "title": "Untitled",
    "category": "art",
    "src": "/assets/art/emily-dong-portrait-purple.jpg",
    "width": 1794,
    "height": 2400,
    "medium": "Painting",
    "alt": "A figure wrapped in purple fabric, with softly lit hands and a textured violet background."
  },
  {
    "id": "comic-page-1",
    "title": "Comic — page 1",
    "category": "art",
    "src": "/assets/art/emily-dong-comic-page-1.jpg",
    "width": 1553,
    "height": 2400,
    "medium": "Digital illustration",
    "alt": "A comic page featuring a small character wearing goggles in a lush green landscape."
  },
  {
    "id": "tomato-study",
    "title": "Untitled",
    "category": "art",
    "src": "/assets/art/emily-dong-artwork-3182.jpg",
    "width": 1721,
    "height": 2400,
    "medium": "Painting",
    "alt": "A painting of red and orange cherry tomatoes casting shadows on blue and white gingham fabric."
  },
  {
    "id": "form-emotion-portrait",
    "title": "Untitled",
    "category": "art",
    "src": "/assets/art/emily-dong-form-emotion-portrait.jpg",
    "width": 1229,
    "height": 1638,
    "medium": "Digital art",
    "alt": "An abstract artwork with softly glowing yellow forms, pale blue shapes, green curves, and a textured surface."
  },
  {
    "id": "comic-page-2",
    "title": "Comic — page 2",
    "category": "art",
    "src": "/assets/art/emily-dong-comic-page-2.jpg",
    "width": 1553,
    "height": 2400,
    "medium": "Digital illustration",
    "alt": "A comic page featuring a goggle-wearing character, a butterfly, and a four-leaf clover."
  },
  {
    "id": "youthful-chaos",
    "title": "Youthful Chaos",
    "category": "art",
    "src": "/assets/art/emily-dong-youthful-chaos.jpg",
    "width": 1714,
    "height": 2400,
    "medium": "Digital art",
    "alt": "A colorful portrait of a smiling child surrounded by blue and yellow botanical outlines and rippling water."
  },
  {
    "id": "set-free",
    "title": "Set Free",
    "medium": "Mixed media",
    "category": "art",
    "src": "/assets/art/emily-dong-set-free.jpg",
    "alt": "A collage with a graphite angel, colorful cosmic background, a bird, and layered landscape imagery.",
    "width": 2700,
    "height": 3600
  },
  {
    "id": "cooking-study",
    "title": "Untitled",
    "category": "art",
    "src": "/assets/art/emily-dong-cooking-study.jpg",
    "width": 1800,
    "height": 2400,
    "medium": "Painting",
    "alt": "A person cooking at a stove, with expressive blue and orange paint drips and visible sketch lines."
  },
  {
    "id": "morning-commute",
    "title": "Morning Commute",
    "category": "art",
    "src": "/assets/art/emily-dong-morning-commute.jpg",
    "width": 1800,
    "height": 2400,
    "medium": "Digital painting",
    "alt": "A portrait of a commuter in profile beside a sunlit train window, with warm light against a dark interior."
  },
  {
    "id": "december",
    "title": "December",
    "category": "art",
    "src": "/assets/art/emily-dong-december.jpg",
    "width": 1800,
    "height": 2400,
    "medium": "Digital illustration",
    "alt": "A December 2026 calendar illustrated with gingerbread cookies, ornaments, and glowing holiday lights."
  },
  {
    "id": "painted-tote",
    "title": "Untitled",
    "category": "art",
    "src": "/assets/art/emily-dong-painted-tote.jpg",
    "width": 1800,
    "height": 2400,
    "medium": "Painting",
    "alt": "A canvas tote hand-painted with pink blossoms, colorful fruit, and turquoise geometric shapes."
  },
  {
    "id": "street-painter",
    "title": "Untitled",
    "category": "art",
    "src": "/assets/art/emily-dong-street-painter.jpg",
    "width": 1745,
    "height": 2400,
    "medium": "Digital painting",
    "alt": "An artist painting at an easel on a sunlit street, surrounded by warm architecture and a bicycle."
  },
  {
    "id": "seated-figures",
    "title": "Untitled",
    "category": "art",
    "src": "/assets/art/emily-dong-seated-figures.jpg",
    "width": 1800,
    "height": 2400,
    "medium": "Painting",
    "alt": "Two seated figures leaning forward, combining painted blue fabric with sketched ochre trousers."
  },
  {
    "id": "figure-study",
    "title": "Untitled",
    "category": "art",
    "src": "/assets/art/emily-dong-figure-study.jpg",
    "width": 1787,
    "height": 2400,
    "medium": "Drawing",
    "alt": "A figure holding the hem of a purple shirt against a peach background."
  }
];
