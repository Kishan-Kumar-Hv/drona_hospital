import { Link } from 'react-router-dom';
import { BLOG_POSTS, BlogPost } from '../../data/blogData';
import { Section, SectionHeader } from '../ui/Section';
import { Button } from '../ui/Button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useInView } from '../../hooks/useAnimation';
import { useTable } from '../../hooks/useContent';

export function BlogSection() {
  const { data: posts } = useTable<BlogPost>('blog_posts', BLOG_POSTS);
  const latestPosts = posts.slice(0, 3);
  const { ref, isInView } = useInView(0.1);

  return (
    <Section background="gray" id="blog">
      <div
        ref={ref}
        className={`transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <SectionHeader
          title="Health Insights & Advice"
          subtitle="Stay informed with helpful medical articles and health tips written by Drona Healthcare specialists."
        />

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {latestPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-video bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xxs font-bold text-primary uppercase tracking-wider shadow-sm">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xxs text-muted mb-3 font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.publishedAt}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="font-bold text-heading text-lg group-hover:text-primary transition-colors leading-snug mb-3 line-clamp-2">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h3>

                <p className="text-muted text-xs leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>

                <Link to={`/blog/${post.id}`} className="mt-auto inline-flex items-center text-xs font-bold text-primary hover:underline">
                  Read Article <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blog">
            <Button
              variant="outline"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              View All Blog Articles
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
