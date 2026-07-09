const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'drona_secret_key_12345';
const MONGO_URI = 'mongodb+srv://kishankumarhv5_db_user:MO8OUqCKDSTt2J21@cluster0.l3xusil.mongodb.net/drona_healthcare?appName=Cluster0&compressors=zlib';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    seedDatabase();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// --- SCHEMAS & MODELS ---

const HospitalSettingsSchema = new mongoose.Schema({
  id: { type: Number, default: 1, unique: true },
  name: { type: String, default: 'Drona Healthcare Services' },
  local_name: { type: String, default: 'Drona Healthcare' },
  tagline: { type: String, default: 'Care, Compassion, Cure' },
  description: { type: String, default: 'Your health is our priority. We offer comprehensive skin, dental, and general medical care at Begur, Bengaluru.' },
  hero_image: { type: String, default: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200' },
  address_street: { type: String, default: 'First Floor, 273/15, 28, 1st Cross Rd, Vishwapriya Layout, Begur' },
  address_city: { type: String, default: 'Bengaluru' },
  address_state: { type: String, default: 'Karnataka' },
  address_pincode: { type: String, default: '560114' },
  phone: { type: String, default: '099864 92170' },
  emergency_phone: { type: String, default: '099864 92170' },
  email: { type: String, default: 'reception@dronahealthcare.in' },
  working_hours: { type: String, default: '10:00 AM - 2:00 PM, 5:30 PM - 9:30 PM' },
  map_url: { type: String, default: 'https://maps.app.goo.gl/wKcrr8F8yq4m4N39A' },
  map_embed_url: { type: String, default: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.7042571439243!2d77.62569507567705!3d12.862372787443152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6b610c1c2ad3%3A0xe54ef84c7e6c9861!2sDrona%20Healthcare!5e0!3m2!1sen!2sin!4v1718500000000!5m2!1sen!2sin" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>' },
  social_facebook: { type: String, default: '' },
  social_instagram: { type: String, default: '' },
  social_twitter: { type: String, default: '' },
  social_linkedin: { type: String, default: '' }
}, { timestamps: true });

const HospitalSettings = mongoose.model('HospitalSettings', HospitalSettingsSchema);

const DoctorSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  specialty: String,
  qualifications: String,
  experience: String,
  department: String,
  image: String,
  working_days: [Number],
  start_time: String,
  end_time: String,
  slot_minutes: Number,
  consultation_fee: Number
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', DoctorSchema);

const ServiceSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  icon: String,
  title: String,
  description: String
}, { timestamps: true });

const Service = mongoose.model('Service', ServiceSchema);

const FacilitySchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: String,
  description: String,
  image: String
}, { timestamps: true });

const Facility = mongoose.model('Facility', FacilitySchema);

const TestimonialSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  location: String,
  rating: Number,
  text: String,
  avatar: String
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

const FaqSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  question: String,
  answer: String
}, { timestamps: true });

const Faq = mongoose.model('Faq', FaqSchema);

const BlogPostSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: String,
  category: String,
  excerpt: String,
  content: String,
  image: String,
  authorName: String,
  authorRole: String,
  authorAvatar: String,
  publishedAt: String,
  readTime: String
}, { timestamps: true });

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

const CallbackSchema = new mongoose.Schema({
  name: String,
  phone: String,
  message: String,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

const Callback = mongoose.model('Callback', CallbackSchema);

const AppointmentSchema = new mongoose.Schema({
  booking_id: String,
  doctor_id: String,
  doctor_name: String,
  patient_name: String,
  patient_phone: String,
  patient_email: String,
  appointment_date: String,
  appointment_time: String,
  status: { type: String, default: 'confirmed' }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', AppointmentSchema);

const TokenSchema = new mongoose.Schema({
  token_number: Number,
  doctor_id: String,
  doctor_name: String,
  patient_name: String,
  patient_phone: String,
  appointment_date: String,
  status: { type: String, default: 'active' }
}, { timestamps: true });

const Token = mongoose.model('Token', TokenSchema);

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String }
});

const User = mongoose.model('User', UserSchema);


// --- AUTO SEEDER ---

async function seedDatabase() {
  try {
    // 1. Admin User
    const adminExists = await User.findOne({ email: 'admin@dronahealthcare.in' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await User.create({ email: 'admin@dronahealthcare.in', password: hashedPassword });
      console.log('Admin user seeded');
    }

    // 2. Hospital Settings
    const settingsCount = await HospitalSettings.countDocuments();
    if (settingsCount === 0) {
      await HospitalSettings.create({});
      console.log('Hospital settings seeded');
    }

    // 3. Doctors
    const doctorsCount = await Doctor.countDocuments();
    if (doctorsCount === 0) {
      const initialDoctors = [
        {
          id: 'dr-anjali-sharma',
          name: 'Dr. Anjali Sharma',
          specialty: 'Senior Consultant Dentist',
          qualifications: 'BDS, MDS (Orthodontics)',
          experience: '12+ Years Experience',
          department: 'Dental',
          image: 'https://images.pexels.com/photos/545229/pexels-photo-545229.jpeg?auto=compress&cs=tinysrgb&w=400',
          working_days: [1, 2, 3, 4, 5, 6],
          start_time: '10:00',
          end_time: '14:00',
          slot_minutes: 20,
          consultation_fee: 500
        },
        {
          id: 'dr-sneha-patil',
          name: 'Dr. Sneha Patil',
          specialty: 'Consultant Dermato-Cosmetologist',
          qualifications: 'MBBS, DDVL (Dermatology)',
          experience: '8+ Years Experience',
          department: 'Skin',
          image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
          working_days: [1, 2, 3, 4, 5, 6],
          start_time: '17:30',
          end_time: '21:30',
          slot_minutes: 20,
          consultation_fee: 600
        },
        {
          id: 'dr-rajesh-kulkarni',
          name: 'Dr. Rajesh Kulkarni',
          specialty: 'Consultant General Physician',
          qualifications: 'MBBS, MD (General Medicine)',
          experience: '15+ Years Experience',
          department: 'General Medicine',
          image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
          working_days: [1, 2, 3, 4, 5, 6],
          start_time: '10:30',
          end_time: '13:30',
          slot_minutes: 15,
          consultation_fee: 500
        }
      ];
      await Doctor.insertMany(initialDoctors);
      console.log('Doctors seeded');
    }

    // 4. Services
    await Service.deleteMany({});
    const initialServices = [
      { id: 'dental', icon: 'Sparkles', title: 'Dental Care', description: 'Comprehensive dental services including routine check-ups, root canals, cleanings, braces, and advanced oral care.' },
      { id: 'skin', icon: 'Sparkles', title: 'Skin & Aesthetic Care', description: 'Advanced skin treatments, PRP hair therapy, Hydrafacials, carbon peeling, and professional dermatological reviews.' },
      { id: 'orthopedics', icon: 'Activity', title: 'Orthopedics & Physiotherapy', description: 'Professional orthopedic physiotherapy, back/neck pain therapy, posture correction, and rehabilitation.' },
      { id: 'general-healthcare', icon: 'Stethoscope', title: 'General Healthcare', description: 'Expert physician consultations for accurate diagnosis, chronic disease management, and standard medical checkups.' },
      { id: 'gynecology', icon: 'Heart', title: 'Gynecology & Women\'s Health', description: 'Comprehensive women\'s health checks, maternal wellness, PCOS care, and personal consultation.' },
      { id: 'psychology', icon: 'Users', title: 'Psychology Counselling', description: 'Professional counseling and support for stress management, anxiety, depression, and mental wellness.' }
    ];
    await Service.insertMany(initialServices);
    console.log('Services seeded');

    // 5. Facilities
    await Facility.deleteMany({});
    const initialFacilities = [
      { id: 'facility-1', title: 'Modern Dental Clinic', description: 'State-of-the-art dental chairs and modern oral diagnostic equipment.', image: 'https://plain-apac-prod-public.komododecks.com/202607/09/4A0iw796mLF7g5xhBHUc/image.png' },
      { id: 'facility-2', title: 'Aesthetic & Skin Care Lounge', description: 'Premium space for hydrafacials, skin peels, and advanced aesthetic care.', image: 'https://plain-apac-prod-public.komododecks.com/202607/09/QYja1HXYOq5ewE4cFqtN/image.png' },
      { id: 'facility-3', title: 'Wellness IV Infusion Bay', description: 'Relaxing lounge for specialized wellness, rehydration, and antioxidant IV treatments.', image: 'https://plain-apac-prod-public.komododecks.com/202607/09/s7vYDCM4uDL41nNUAUpi/image.png' },
      { id: 'facility-4', title: 'General Consultation Suites', description: 'Comfortable private rooms for detailed physical consultations and checks.', image: 'https://plain-apac-prod-public.komododecks.com/202607/09/b8Wnz2wQ1ckCLbKMW9r9/image.png' },
      { id: 'facility-5', title: 'Diagnostic Laboratory', description: 'In-house clinical diagnostic labs for accurate blood and sample testing.', image: 'https://plain-apac-prod-public.komododecks.com/202607/09/3fpCCP3D8jj5cxE9z7Zu/image.png' }
    ];
    await Facility.insertMany(initialFacilities);
    console.log('Facilities seeded');

    // 6. Testimonials
    const testimonialsCount = await Testimonial.countDocuments();
    if (testimonialsCount === 0) {
      const initialTestimonials = [
        { id: 'test-1', name: 'Priya Hegde', location: 'Bengaluru', rating: 5, text: 'The dental treatment I received here was excellent. Highly professional doctors and extremely clean facilities.', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { id: 'test-2', name: 'Ramesh Patil', location: 'Bengaluru', rating: 5, text: 'Very thorough explanation by the general physician. The clinic is well-maintained and follows strict safety protocols.', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { id: 'test-3', name: 'Sumitra Sen', location: 'Bengaluru', rating: 5, text: 'Got a Hydrafacial done at the cosmetology department. Amazing skin results and excellent, caring service.', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100' }
      ];
      await Testimonial.insertMany(initialTestimonials);
      console.log('Testimonials seeded');
    }

    // 7. FAQs
    const faqsCount = await Faq.countDocuments();
    if (faqsCount === 0) {
      const initialFaqs = [
        { id: 'faq-1', question: 'What are the clinic timings?', answer: 'Drona Healthcare operates from 10:00 AM to 2:00 PM, and from 5:30 PM to 9:30 PM, Monday through Saturday.' },
        { id: 'faq-2', question: 'How can I schedule a consultation?', answer: 'Since we do not run online direct bookings, you can request a callback by leaving your name and phone number on our website. Our reception team will reach out to schedule a time.' },
        { id: 'faq-3', question: 'Do you offer emergency skin treatments?', answer: 'Yes, we take emergencies and acute dermatological cases. Please reach out to our clinic helpline directly.' },
        { id: 'faq-4', question: 'Where is the clinic located in Begur?', answer: 'We are situated at First Floor, 273/15, 28, 1st Cross Rd, Vishwapriya Layout, Begur, Bengaluru (Landmark: near Begur main crossing).' }
      ];
      await Faq.insertMany(initialFaqs);
      console.log('FAQs seeded');
    }

    // 8. Blog Posts
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      const initialBlogs = [
        {
          id: 'dental-hygiene-tips',
          title: '5 Essential Tips for Maintaining Excellent Dental Hygiene',
          category: 'Dentistry',
          excerpt: 'Keeping your teeth and gums healthy is about more than just a bright smile. Discover key habits to improve your oral hygiene.',
          content: `Keeping your teeth and gums healthy is about more than just a bright smile. Good oral hygiene is vital for overall health and well-being. Poor dental health can lead to various complications such as gum disease, tooth decay, and even systemic issues like cardiovascular problems.

Here are 5 essential tips from our senior dental specialist, Dr. Anjali Sharma, to keep your smile healthy and radiant:

1. **Brush Twice a Day, the Right Way:** Brush for at least two minutes, twice a day. Use a soft-bristled brush and fluoride toothpaste. Hold the brush at a 45-angle to your gums and make gentle circular motions instead of sawing back and forth.
2. **Never Skip Flossing:** Flossing removes food particles and plaque buildup that your toothbrush can't reach. Floss daily, making sure to gently wrap the floss around each tooth.
3. **Clean Your Tongue:** Your tongue is a breeding ground for bacteria that cause bad breath and plaque. Use your toothbrush or a dedicated tongue scraper to gently clean your tongue every time you brush.
4. **Stay Hydrated and Limit Sugar:** Drinking water after meals helps flush out acids and food particles. Restrict sugary snacks and acidic beverages, which erode tooth enamel and cause cavities.
5. **Visit the Dentist Regularly:** Professional cleanings and check-ups every 6 months are crucial. A dentist can spot early signs of issues like decay or gum disease and treat them before they become painful and expensive.

Following these simple practices will ensure your oral hygiene stays optimal. If you are experiencing tooth pain, sensitivity, or are due for a routine check-up, get in touch with our dental department today!`,
          image: 'https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg?auto=compress&cs=tinysrgb&w=800',
          authorName: 'Dr. Anjali Sharma',
          authorRole: 'Senior Consultant Dentist',
          authorAvatar: 'https://images.pexels.com/photos/545229/pexels-photo-545229.jpeg?auto=compress&cs=tinysrgb&w=100',
          publishedAt: 'July 5, 2026',
          readTime: '4 min read'
        },
        {
          id: 'understanding-iv-therapy',
          title: 'Understanding IV Wellness Therapy: Benefits & Safety',
          category: 'Wellness',
          excerpt: 'Intravenous wellness therapy is rising in popularity. Learn how IV therapy works, what benefits it offers, and why it is safe when administered professionally.',
          content: `Intravenous (IV) wellness therapy has transitioned from clinical emergency rooms to general wellness clinics, becoming a popular way to boost hydration, immunity, and overall energy. But what exactly is it, and is it right for you?

### What is IV Wellness Therapy?
IV therapy is a method of administering fluids, vitamins, minerals, and antioxidants directly into the bloodstream. By bypassing the digestive system, your body achieves 100% absorption of the nutrients, providing rapid rehydration and quick results.

### Key Benefits of Wellness IVs
*   **Rapid Hydration:** Restores essential fluids quickly, which is perfect for recovering from fatigue, intense workouts, or heat exposure.
*   **Immune System Support:** IVs loaded with Vitamin C, Zinc, and essential antioxidants can help your body fight off seasonal illnesses.
*   **Enhanced Energy Levels:** Standard B-complex vitamins delivered intravenously help optimize cellular metabolism and increase natural energy.
*   **Detoxification:** Antioxidants like glutathione delivered via IV help purge toxins and free radicals from your body, promoting radiant skin.

### Safety and Administration
While IV therapy is highly effective, safety is paramount. It must always be administered by qualified medical professionals. At Drona Healthcare Services, our trained practitioners evaluate your medical history and current health indicators before preparing custom IV formulations in a completely sterile, comfortable clinical environment.

If you are feeling fatigued, recovering from an illness, or looking to boost your overall wellness, consider consulting our physician to see how custom IV therapy can benefit your lifestyle.`,
          image: 'https://images.pexels.com/photos/3951628/pexels-photo-3951628.jpeg?auto=compress&cs=tinysrgb&w=800',
          authorName: 'Dr. Rajesh Kulkarni',
          authorRole: 'Consultant General Physician',
          authorAvatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
          publishedAt: 'June 28, 2026',
          readTime: '5 min read'
        }
      ];
      await BlogPost.insertMany(initialBlogs);
      console.log('Blog posts seeded');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
}


// --- API ROUTES ---

// Middleware for parsing JWT auth
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// 1. Auth routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, session: { user: { email: user.email } } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/session', authenticateToken, (req, res) => {
  res.json({ user: { email: req.user.email } });
});

// 2. Hospital Settings
app.get('/api/hospital_settings', async (req, res) => {
  try {
    const settings = await HospitalSettings.findOne({ id: 1 });
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/hospital_settings/:id', async (req, res) => {
  try {
    const settings = await HospitalSettings.findOneAndUpdate({ id: 1 }, req.body, { new: true });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Generic helper functions for REST models
function setupModelRoutes(endpoint, Model) {
  app.get(`/api/${endpoint}`, async (req, res) => {
    try {
      const items = await Model.find({}).sort({ createdAt: 1 });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get(`/api/${endpoint}/:id`, async (req, res) => {
    try {
      const item = await Model.findOne({ id: req.params.id });
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post(`/api/${endpoint}`, async (req, res) => {
    try {
      const newItem = new Model(req.body);
      if (!newItem.id) {
        newItem.id = Math.random().toString(36).slice(2, 9);
      }
      await newItem.save();
      res.json(newItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put(`/api/${endpoint}/:id`, async (req, res) => {
    try {
      const item = await Model.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete(`/api/${endpoint}/:id`, async (req, res) => {
    try {
      await Model.findOneAndDelete({ id: req.params.id });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

setupModelRoutes('doctors', Doctor);
setupModelRoutes('services', Service);
setupModelRoutes('facilities', Facility);
setupModelRoutes('testimonials', Testimonial);
setupModelRoutes('faqs', Faq);
setupModelRoutes('blog_posts', BlogPost);

// 4. Special Custom APIs: callbacks, appointments, tokens
app.post('/api/callbacks', async (req, res) => {
  try {
    const cb = new Callback(req.body);
    await cb.save();
    res.json(cb);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/callbacks', async (req, res) => {
  try {
    const cbs = await Callback.find({}).sort({ createdAt: -1 });
    res.json(cbs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/callbacks/:mongoId', async (req, res) => {
  try {
    await Callback.findByIdAndDelete(req.params.mongoId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const appt = new Appointment(req.body);
    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const appts = await Appointment.find({}).sort({ createdAt: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/appointments/:mongoId', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.mongoId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tokens', async (req, res) => {
  try {
    const token = new Token(req.body);
    await token.save();
    res.json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tokens', async (req, res) => {
  try {
    const tokens = await Token.find({}).sort({ createdAt: -1 });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tokens/:mongoId', async (req, res) => {
  try {
    await Token.findByIdAndDelete(req.params.mongoId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express MongoDB Backend running on http://localhost:${PORT}`);
});
