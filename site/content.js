/** Central editable content. All projects and artwork below are placeholders. */
window.portfolioContent = {
  name: 'Emily Dong', university: 'University of Michigan', majors: ['User Experience Design', 'Art and Design'],
  email: null, linkedin: null, resume: null,
  projects: [
    { id: 'campus', title: 'Campus Compass', category: 'digital', description: 'A placeholder concept for exploring campus resources.', tags: ['UX Research', 'Interaction Design'], overview: 'An illustrative starting point for a campus resource finder. Explore a sample resource category below. Real research, project process, and case study content have yet to be added.', sample: true },
    { id: 'ritual', title: 'Everyday Rituals', category: 'digital', description: 'A placeholder concept for a reflective daily interface.', tags: ['UI Design', 'Prototyping'], overview: 'A sample interface exploring a quieter moment in the day. Try the mood selector below to see the concept respond. Responses are temporary and are not collected or saved.', sample: true },
    { id: 'form', title: 'Form & Feeling', category: 'visual', description: 'A placeholder exploration of typography, color, and visual storytelling.', tags: ['Art Direction', 'Visual Design'], overview: 'An original abstract placeholder exploring the relationship between type and shape. Switch palettes below to explore a different visual mood. This is a demonstration, not Emily’s submitted artwork.', sample: true }
  ]
};

/**
 * @typedef {{src: string|null, alt: string, caption: string, width: number, height: number}} AboutImage
 * @typedef {{id: string, question: string, answer: string}} FAQ
 * @typedef {{id: string, name: string, description: string, category: string, icon?: string, url?: string|null}} Tool
 * @typedef {{title: string, lead: string, paragraphs: string[], images: AboutImage[], faqs: FAQ[], tools: Tool[], sampleToolkit: boolean, placeholderNotice: string|null, education: {institution: string, program: string, dates?: string|null, details?: string|null}, closing: string}} AboutContent
 */
/** @type {AboutContent} Editable sample copy; confirm personal details and tools before removing notices. */
window.portfolioContent.about = {
  title: 'A little about me',
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
    {id: 'figma', name: 'Figma', description: 'Exploring interface layouts, components, and interactive flows.', category: 'Interface design', icon: 'F', url: null},
    {id: 'figjam', name: 'FigJam', description: 'Mapping questions, organizing ideas, and making sense of research.', category: 'Research & ideation', icon: 'Fj', url: null},
    {id: 'illustrator', name: 'Adobe Illustrator', description: 'Creating vector illustrations and experimenting with visual systems.', category: 'Vector & illustration', icon: 'Ai', url: null},
    {id: 'photoshop', name: 'Adobe Photoshop', description: 'Editing imagery and exploring compositions.', category: 'Image making', icon: 'Ps', url: null},
    {id: 'notion', name: 'Notion', description: 'Keeping project notes, references, and process documentation organized.', category: 'Organization', icon: 'N', url: null},
    {id: 'claude-code', name: 'Claude Code', description: 'Turning early ideas into working web prototypes.', category: 'Prototyping', icon: '↗', url: null}
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
  title: 'A little room to play.',
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
 form: {
  details: {projectType: 'Sample visual exploration', team: null, tools: [], timeline: null},
  slug: 'form-and-feeling', headline: 'Where form finds a feeling.',
  intro: 'An original placeholder study in typography, color, and visual storytelling, built from simple shapes and a few expressive contrasts.',
  question: 'How can the same composition express a different visual mood?',
  context: 'This sample is a visual exploration created for the portfolio infrastructure. It is not presented as Emily’s submitted artwork or a commissioned identity.',
  questions: ['How does scale change the relationship between words and shapes?', 'What happens when a palette changes but the layout stays the same?', 'Where can expressive typography still remain readable?'],
  direction: 'The proposed visual system pairs a large serif treatment with a circle, an asterisk, and a restrained palette. Repeated elements make it possible to compare variations without changing everything at once.',
  principles: [{title:'Work with contrast',body:'Compare large expressive forms with small, precise supporting labels.'},{title:'Keep a common thread',body:'Repeat core shapes to connect different compositions.'},{title:'Change one variable',body:'Explore palette variations while keeping the structure consistent.'}],
  flow: ['Choose a form','Explore contrast','Compare a variation'],
  concept: 'Switch between the two illustrative palettes below to compare how the same shapes and typography can read differently.',
  reflection: 'Future personal work can replace these placeholders with original artwork, sketches, and a discussion of actual choices. There are no client results, awards, or external endorsements attached to this sample.'
 }
};
window.portfolioContent.projects.forEach(project => { project.caseStudy = sampleCaseStudies[project.id]; });

/** Original placeholder studies for the masonry gallery, not supplied personal artwork. */
window.portfolioContent.playground.studies = [
 {id:'conversation',title:'Color in conversation',category:'color',art:'circles',ratio:'4 / 5',palette:'studio'},
 {id:'perspective',title:'A different perspective',category:'form',art:'squares',ratio:'1 / 1',palette:'studio'},
 {id:'curious',title:'Stay curious.',category:'type',art:'type',words:'Stay\ncurious.',ratio:'3 / 4',palette:'studio'},
 {id:'corners',title:'Soft corners, sharp ideas',category:'form',art:'arches',ratio:'4 / 5',palette:'garden'},
 {id:'garden-notes',title:'Garden notes',category:'color',art:'swatches',ratio:'1 / 1',palette:'garden'},
 {id:'between-lines',title:'Between the lines',category:'form',art:'lines',ratio:'3 / 4',palette:'garden'},
 {id:'small-words',title:'Small words, big feelings',category:'type',art:'type',words:'make\nroom for\nplay.',ratio:'4 / 5',palette:'afterhours'},
 {id:'after-hours',title:'After hours',category:'color',art:'rings',ratio:'4 / 5',palette:'afterhours'},
 {id:'balance',title:'A moment of balance',category:'form',art:'orbit',ratio:'1 / 1',palette:'studio'}
];
