import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MinimalHeader } from '../components/layout/MinimalHeader';
import { Footer } from '../components/sections/Footer';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useTable } from '../hooks/useContent';

export function BlogPage() {
  const { data: posts } = useTable<BlogPost>('blog_posts', BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(posts.map((post) => post.category)))];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts;
    return posts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory, posts]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <MinimalHeader backLabel="Back to Clinic Website" />

      <main className="flex-grow py-12">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-heading mb-4">Drona Healthcare Blog</h1>
            <p className="text-muted leading-relaxed">
              Explore professional insights, health tips, and wellness guidance curated by our expert medical staff.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white border border-border text-body hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-border">
              <p className="text-muted">No articles found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative overflow-hidden aspect-video bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xxs font-bold text-primary uppercase tracking-wider shadow-sm">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-muted mb-4 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.publishedAt}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </div>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-heading mb-3 group-hover:text-primary transition-colors leading-tight">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h2>

                    <p className="text-muted text-sm leading-relaxed mb-6 flex-grow">{post.excerpt}</p>

                    <div className="flex items-center justify-between pt-6 border-t border-border/60 mt-auto">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-8 h-8 rounded-full object-cover border border-border"
                        />
                        <div>
                          <p className="text-xs font-bold text-heading">{post.authorName}</p>
                          <p className="text-xxs text-muted font-medium">{post.authorRole}</p>
                        </div>
                      </div>

                      <Link to={`/blog/${post.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<ArrowRight className="w-4 h-4" />}
                          iconPosition="right"
                          className="group-hover:bg-primary group-hover:text-white transition-all"
                        >
                          Read Article
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
