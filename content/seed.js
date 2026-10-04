// Initial content. Copied into DATA_DIR on first run; after that, edit through /admin.
// Anything Greenway has not confirmed is left blank (shown as a marked placeholder), never invented.
const s = (slug, name, category, icon, short, order) => ({
  slug, name, category, icon, short, order, published: true,
  heroHeadline: '', intro: '', what: '', why: [], whatWeDo: '', signs: [], faqs: '',
  heroImage: '', beforeImage: '', afterImage: '', gallery: [], videoUrl: '',
  relatedServices: [], ctaLabel: '', ctaPrompt: '', seoTitle: '', seoDescription: '',
});
const services = [
  s('athletic-field-construction', 'Athletic Field Construction', 'build', 'construction', 'New athletic field construction, from subgrade and drainage through finished playing surface.', 1),
  s('infield-construction', 'Infield Construction', 'build', 'infield', 'Construction of new baseball and softball infields.', 2),
  s('mound-construction', 'Mound Construction', 'build', 'mound', 'Pitching mound construction and rebuilds for baseball and softball fields.', 3),
  s('fencing-and-backstop-installation', 'Fencing & Backstop Installation', 'build', 'fence', 'Fencing and backstop installation for athletic fields.', 4),
  s('athletic-field-renovation', 'Athletic Field Renovation', 'renovate', 'renovation', 'Renovation and improvement of existing athletic fields.', 10),
  s('infield-renovation', 'Infield Renovation', 'renovate', 'infield', 'Renovation of worn or uneven baseball and softball infields.', 11),
  s('lip-removal', 'Lip Removal', 'renovate', 'infield', 'Removal of built-up lips along the edges of baseball and softball infields.', 12),
  s('clay-installation', 'Clay Installation', 'renovate', 'infield', 'Infield clay installation for baseball and softball fields.', 13),
  s('sod-installation', 'Sod Installation', 'renovate', 'sod', 'Sod installation for new and renovated natural turf fields.', 14),
  s('drainage-installation', 'Drainage Installation', 'fix', 'drainage', 'Drainage installation to address standing water and fields that stay wet.', 20),
  s('irrigation-installation', 'Irrigation Installation', 'fix', 'irrigation', 'Irrigation system installation for athletic fields.', 21),
  s('laser-grading', 'Laser Grading', 'fix', 'grading', 'Laser-guided grading for accurate, consistent field surfaces.', 22),
  s('field-repair', 'Field Repair', 'fix', 'repair', 'Targeted repairs to damaged or worn areas of an athletic field.', 23),
  s('field-maintenance', 'Field Maintenance', 'maintain', 'maintenance', 'Ongoing athletic field maintenance and turf management.', 30),
  s('field-grooming', 'Field Grooming', 'maintain', 'infield', 'Regular grooming to keep infields and playing surfaces game-ready.', 31),
  s('field-lining', 'Field Lining', 'maintain', 'lining', 'Field lining and marking for athletic fields.', 32),
  s('top-dressing', 'Top Dressing', 'maintain', 'sod', 'Top dressing to smooth surfaces and support turf health.', 33),
  s('fertilization', 'Fertilization', 'maintain', 'fertilization', 'Fertilization programs for natural turf athletic fields.', 34),
  s('weed-and-insect-control', 'Weed & Insect Control', 'maintain', 'weed', 'Weed and insect control for natural turf athletic fields.', 35),
  s('artificial-turf-sweeping', 'Artificial Turf Sweeping', 'maintain', 'maintenance', 'Sweeping and upkeep for artificial turf fields.', 36),
  s('deep-tine-aeration', 'Deep-Tine Aeration', 'specialty', 'aeration', 'Deep-tine aeration to relieve compaction and improve drainage and root growth.', 40),
  s('fraise-mowing', 'Fraise Mowing', 'specialty', 'grading', 'Fraise mowing to remove surface material and thatch from natural turf.', 41),
  s('overseeding', 'Overseeding', 'specialty', 'overseed', 'Overseeding to thicken turf and help fields recover from heavy use.', 42),
  s('hydroseeding', 'Hydroseeding', 'specialty', 'overseed', 'Hydroseeding for establishing turf on new or renovated areas.', 43),
];
const aer = services.find((x) => x.slug === 'deep-tine-aeration');
Object.assign(aer, {
  heroHeadline: 'Deep-Tine Aeration for Healthier, Better-Performing Athletic Fields',
  intro: 'Heavy use compacts the soil under an athletic field. Deep-tine aeration opens that soil back up so water, air and roots can move through it again.',
  what: 'Deep-tine aeration drives long tines well below the surface of a turf field, fracturing compacted soil layers and creating channels for water, air and root growth.\n\nUnlike shallow core aeration, deep-tine aeration is aimed at compaction that sits below the top few inches of the profile.',
  why: ['Compaction from heavy field traffic', 'Poor drainage and standing water', 'Reduced root growth', 'Poor turf performance and thin turf', 'Slow recovery after games and practices'],
  signs: ['Water sits on the surface after rain', 'The surface feels hard underfoot', 'Turf is thin in high-traffic areas such as goal mouths and bases', 'Turf recovers slowly after heavy use', 'Roots are shallow when you pull a plug'],
  whatWeDo: '[ADD GREENWAY PROCESS: equipment used, depth, timing, how aeration fits into a maintenance program]',
  ctaLabel: 'Request an Aeration Assessment', ctaPrompt: 'Think your field may be compacted? Let\'s assess it.',
  relatedServices: ['drainage-installation', 'top-dressing', 'overseeding', 'field-maintenance'],
  seoTitle: 'Deep-Tine Aeration for Athletic Fields | Greenway Athletic Field Services',
  seoDescription: 'Greenway Athletic Field Services provides deep-tine aeration to relieve compaction and improve drainage and turf performance on athletic fields.',
});
const p = (name, city, state, clientType) => ({
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + city.toLowerCase().replace(/\s+/g, '-') + '-' + state.toLowerCase(),
  name, city, state, clientType, year: '', sports: [], projectType: '', overview: '', challenge: '', solution: '',
  scope: [], result: '', heroImage: '', beforeImage: '', afterImage: '', gallery: [], videoUrl: '',
  services: [], featured: true, seoTitle: '', seoDescription: '', published: true,
});
const projects = [
  p('Gould Manor Park', 'Fairfield', 'CT', ''),
  p('Exchange Field Complex', 'Madison', 'CT', ''),
  p('Joseph Curtis Recreation Park', 'Port Chester', 'NY', ''),
  p('East Hartford High School', 'East Hartford', 'CT', 'schools'),
  p('Village of Scarsdale', 'Scarsdale', 'NY', 'municipalities'),
  p('Crawford Park', 'Rye Brook', 'NY', ''),
  p('Wethersfield High School', 'Wethersfield', 'CT', 'schools'),
];
const i = (slug, name, icon, short, order) => ({ slug, name, icon, short, order, intro: '', needs: [], heroImage: '', services: ['athletic-field-construction', 'athletic-field-renovation', 'field-maintenance'], seoTitle: '', seoDescription: '', published: true });
const industries = [
  i('municipalities', 'Municipalities', 'municipalities', 'Towns, villages and cities that own and maintain athletic fields.', 1),
  i('parks-and-recreation', 'Parks & Recreation', 'parks', 'Parks and recreation departments responsible for community fields.', 2),
  i('schools', 'Schools', 'schools', 'Public and private schools with athletic programs and shared fields.', 3),
  i('colleges-and-universities', 'Colleges & Universities', 'colleges', 'Athletic departments and facilities teams at colleges and universities.', 4),
  i('sports-organizations', 'Sports Organizations', 'sports', 'Leagues, clubs and organizations that play on and care for fields.', 5),
  i('little-leagues', 'Little Leagues', 'baseball', 'Little League and youth baseball and softball organizations.', 6),
];
const team = [
  { slug: 'rocco-lagana', name: 'Rocco Lagana', title: 'President & CEO', order: 1, bio: '[ADD BIO: experience, industry knowledge, approach]', photo: '', published: true },
  { slug: 'rocky-lagana', name: 'Rocky Lagana', title: 'COO', order: 2, bio: '[ADD BIO: experience, industry knowledge, approach]', photo: '', published: true },
];
const resources = [{
  slug: 'built-beneath-the-surface', title: 'Built Beneath the Surface', type: 'Guide', featured: true, published: true,
  summary: 'Greenway\'s guide to what makes an athletic field perform: the work you can\'t see once the turf is down.',
  body: '', image: '', file: '', videoUrl: '', seoTitle: '', seoDescription: '',
}];
const settings = {
  name: 'Greenway Athletic Field Services', shortName: 'Greenway AFS',
  tagline: 'Better Fields. Stronger Communities.',
  phone: '', email: '', address: '', serviceArea: 'Connecticut, New York and the surrounding Northeast',
  siteUrl: 'https://www.greenwayafs.com',
  heroHeadline: 'Athletic Fields Built to Perform.',
  heroSub: 'From new field construction and major renovations to drainage, irrigation, grading and long-term maintenance, Greenway Athletic Field Services delivers athletic fields built for performance, durability and longevity.',
  heroImage: '', heroVideo: '', ogImage: '',
  stats: '135+|Years|Combined Experience\n300+|Athletic Field|Renovations\n125+|Fields|Maintained\n1,000+|Acres Maintained|Weekly',
  linkedin: '', facebook: '', instagram: '', youtube: '',
  gaId: '', leadWebhook: '', showPlaceholders: true, legacyNote: '',
};
module.exports = { services, projects, industries, team, resources, testimonials: [], settings };
