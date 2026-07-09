export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'dental-hygiene-tips',
    title: '5 Essential Tips for Maintaining Excellent Dental Hygiene',
    category: 'Dentistry',
    excerpt: 'Keeping your teeth and gums healthy is about more than just a bright smile. Discover key habits to improve your oral hygiene.',
    content: `Keeping your teeth and gums healthy is about more than just a bright smile. Good oral hygiene is vital for overall health and well-being. Poor dental health can lead to various complications such as gum disease, tooth decay, and even systemic issues like cardiovascular problems.

Here are 5 essential tips from our senior dental specialist, Dr. Anjali Sharma, to keep your smile healthy and radiant:

1. **Brush Twice a Day, the Right Way:** Brush for at least two minutes, twice a day. Use a soft-bristled brush and fluoride toothpaste. Hold the brush at a 45-degree angle to your gums and make gentle circular motions instead of sawing back and forth.
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
  },
  {
    id: 'hydrafacials-guide',
    title: "A Beginner's Guide to Hydrafacials & Skin Rejuvenation",
    category: 'Aesthetic Skin Care',
    excerpt: 'Want smooth, glowing skin with zero downtime? Discover how a Hydrafacial works and why it has become the go-to treatment for skin rejuvenation.',
    content: `Achieving clear, radiant skin is a common goal, but aggressive treatments can leave the face red and sensitive. That is why the Hydrafacial has become the absolute favorite aesthetic skin treatment worldwide—it offers deep cleansing, exfoliation, extraction, and hydration simultaneously with zero downtime.

### How Does a Hydrafacial Work?
Unlike traditional facials, a Hydrafacial uses a patented vortex-fusion delivery system. The treatment is carried out in four main steps:

1. **Cleansing & Exfoliation:** A gentle peeling tip sweeps away dead skin cells while opening up pores to reveal a healthy, new layer of skin.
2. **Acid Peel:** A mild mixture of glycolic and salicylic acids is applied to loosen deep debris in the pores without causing skin irritation.
3. **Extraction:** A vacuum suction tip extracts blackheads, sebum, and impurities directly out of the pores painlessly.
4. **Hydration & Protection:** Pores are infused with intense moisturizers, peptides, and antioxidant serums to plump, nourish, and protect the skin barrier.

### Why Choose a Hydrafacial?
*   **Instant Glow:** You will see a visible improvement in skin tone, texture, and brightness immediately after a single session.
*   **Zero Downtime:** Unlike chemical peels or laser treatments, you can apply makeup and return to your normal routine right away.
*   **Suitable for All Skin Types:** Whether you have dry, oily, sensitive, or aging skin, the treatment serum mix can be customized.
*   **Treats Multiple Concerns:** It reduces fine lines, unclogs pores, improves mild acne, and fades hyperpigmentation.

At Drona Healthcare Services, our dermato-cosmetology department offers custom skin treatments and Hydrafacials. Book a callback with our aesthetic specialist, Dr. Sneha Patil, to customize your skincare journey.`,
    image: 'https://images.pexels.com/photos/3762402/pexels-photo-3762402.jpeg?auto=compress&cs=tinysrgb&w=800',
    authorName: 'Dr. Sneha Patil',
    authorRole: 'Dermato-Cosmetologist',
    authorAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    publishedAt: 'June 15, 2026',
    readTime: '4 min read'
  },
  {
    id: 'importance-of-health-checkups',
    title: 'The Importance of Regular General Health Screenings',
    category: 'General Medicine',
    excerpt: 'Prevention is better than cure. Learn why routine health screenings can identify issues early and add years of healthy life.',
    content: `Many of us only visit a clinic or hospital when we are feeling noticeably sick. However, many chronic conditions, such as hypertension, high cholesterol, type 2 diabetes, and early-stage cardiovascular disease, can develop silently without showing any symptoms at all. 

This is why regular general health screenings are a vital part of preventive healthcare. 

### Why Routine Screenings Matter
1. **Early Detection saves Lives:** Finding a medical condition early, before it escalates, makes it significantly easier to treat or manage, reducing risks of long-term damage or emergency complications.
2. **Updates Your Health Baseline:** Annual check-ups give your physician a baseline record of your vitals, blood indicators, and organ functions. This helps identify any sudden deviations or trends.
3. **Encourages Positive Lifestyle Changes:** Screenings are an opportunity to speak with a physician about nutrition, stress management, sleep, and habits, helping you make healthier choices.
4. **Saves Healthcare Costs:** Treating a chronic illness or undergoing emergency surgery is far more expensive than routine preventive packages that monitor and manage risk factors early.

### What Does a Standard Screening Include?
A comprehensive check-up usually covers blood pressure checks, lipid profile (cholesterol), blood sugar metrics, kidney & liver function assays, thyroid levels, and a physical assessment. 

At Drona Healthcare Services, we recommend that all adults over the age of 25 schedule a general check-up at least once a year. Your health is your most valuable asset—let us help you protect it.`,
    image: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=800',
    authorName: 'Dr. Rajesh Kulkarni',
    authorRole: 'Consultant General Physician',
    authorAvatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
    publishedAt: 'May 30, 2026',
    readTime: '5 min read'
  }
];
