import { useState } from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { MinimalHeader } from '../../components/layout/MinimalHeader';
import { AdminSectionNav } from '../../components/admin/AdminSectionNav';
import { HospitalSettingsForm } from '../../components/admin/HospitalSettingsForm';
import { DoctorsManager } from '../../components/admin/DoctorsManager';
import { SimpleListManager, type FieldConfig } from '../../components/admin/SimpleListManager';
import { useAuth } from '../../hooks/useAuth';
import {
  FALLBACK_SERVICES,
  FALLBACK_FACILITIES,
  FALLBACK_TESTIMONIALS,
  FALLBACK_FAQS,
} from '../../data/fallbackContent';
import { BLOG_POSTS } from '../../data/blogData';

const TABS = ['Hospital Info', 'Doctors', 'Services', 'Facilities', 'Testimonials', 'FAQs', 'Blog'] as const;
type Tab = (typeof TABS)[number];

const SERVICE_FIELDS: FieldConfig[] = [
  { key: 'icon', label: 'Icon', type: 'icon-select' },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
];

const FACILITY_FIELDS: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'image', label: 'Image URL', type: 'url' },
];

const TESTIMONIAL_FIELDS: FieldConfig[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'rating', label: 'Rating (1-5)', type: 'number' },
  { key: 'text', label: 'Testimonial', type: 'textarea' },
  { key: 'avatar', label: 'Avatar Image URL', type: 'url' },
];

const FAQ_FIELDS: FieldConfig[] = [
  { key: 'question', label: 'Question', type: 'text' },
  { key: 'answer', label: 'Answer', type: 'textarea' },
];

const BLOG_FIELDS: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
  { key: 'content', label: 'Content', type: 'textarea' },
  { key: 'image', label: 'Image URL', type: 'url' },
  { key: 'authorName', label: 'Author Name', type: 'text' },
  { key: 'authorRole', label: 'Author Role', type: 'text' },
  { key: 'authorAvatar', label: 'Author Avatar URL', type: 'url' },
  { key: 'publishedAt', label: 'Published Date', type: 'text' },
  { key: 'readTime', label: 'Reading Time', type: 'text' },
];

export function ContentManagerPage() {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('Hospital Info');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MinimalHeader
        backTo="/"
        backLabel="Patient Website"
        rightSlot={
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-sm font-medium text-body hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        }
      />

      <main className="flex-1 container-custom py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-heading">Manage Website Content</h1>
            <p className="text-sm text-muted">Edit hospital info, doctors, and the content shown on the public site</p>
          </div>
        </div>

        <AdminSectionNav />

        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                tab === t
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-body border-border hover:border-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="bg-background">
          {tab === 'Hospital Info' && <HospitalSettingsForm />}
          {tab === 'Doctors' && <DoctorsManager />}
          {tab === 'Services' && (
            <SimpleListManager
              table="services"
              title="Services"
              description="Manage the services listed on the homepage."
              fields={SERVICE_FIELDS}
              fallback={FALLBACK_SERVICES}
              emptyValues={{ icon: 'Stethoscope', title: '', description: '' }}
              getTitle={(item) => item.title}
              getSubtitle={(item) => item.description}
            />
          )}
          {tab === 'Facilities' && (
            <SimpleListManager
              table="facilities"
              title="Facilities"
              description="Manage the facilities showcased on the homepage."
              fields={FACILITY_FIELDS}
              fallback={FALLBACK_FACILITIES}
              emptyValues={{ title: '', description: '', image: '' }}
              getTitle={(item) => item.title}
              getSubtitle={(item) => item.description}
            />
          )}
          {tab === 'Testimonials' && (
            <SimpleListManager
              table="testimonials"
              title="Testimonials"
              description="Manage patient testimonials shown on the homepage."
              fields={TESTIMONIAL_FIELDS}
              fallback={FALLBACK_TESTIMONIALS}
              emptyValues={{ name: '', location: '', rating: 5, text: '', avatar: '' }}
              getTitle={(item) => item.name}
              getSubtitle={(item) => item.text}
            />
          )}
          {tab === 'FAQs' && (
            <SimpleListManager
              table="faqs"
              title="FAQs"
              description="Manage frequently asked questions shown on the homepage."
              fields={FAQ_FIELDS}
              fallback={FALLBACK_FAQS}
              emptyValues={{ question: '', answer: '' }}
              getTitle={(item) => item.question}
              getSubtitle={(item) => item.answer}
            />
          )}
          {tab === 'Blog' && (
            <SimpleListManager
              table="blog_posts"
              title="Blog Posts"
              description="Manage healthcare articles, tips, and insights."
              fields={BLOG_FIELDS}
              fallback={BLOG_POSTS}
              emptyValues={{
                title: '',
                category: 'General',
                excerpt: '',
                content: '',
                image: '',
                authorName: '',
                authorRole: '',
                authorAvatar: '',
                publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                readTime: '3 min read',
              }}
              getTitle={(item) => item.title}
              getSubtitle={(item) => item.excerpt}
            />
          )}
        </div>
      </main>
    </div>
  );
}
