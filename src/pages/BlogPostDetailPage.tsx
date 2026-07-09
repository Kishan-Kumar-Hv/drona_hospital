import { useParams, Link } from 'react-router-dom';
import { MinimalHeader } from '../components/layout/MinimalHeader';
import { Footer } from '../components/sections/Footer';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { useMemo } from 'react';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { useTable } from '../hooks/useContent';

export function BlogPostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const { data: posts } = useTable<BlogPost>('blog_posts', BLOG_POSTS);

  const post = useMemo(() => {
    return posts.find((p) => p.id === postId);
  }, [postId, posts]);

  const recommendedPosts = useMemo(() => {
    return posts.filter((p) => p.id !== postId).slice(0, 3);
  }, [postId, posts]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <MinimalHeader />
        <main className="container-custom py-20 text-center">
          <h2 className="text-3xl font-bold text-heading mb-4">Article Not Found</h2>
          <p className="text-muted mb-8">The blog post you are looking for does not exist or has been removed.</p>
          <Link to="/blog">
            <Button variant="primary">Return to Blog</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <MinimalHeader backTo="/blog" backLabel="Back to Blog" />

      <main className="flex-grow py-12">
        <div className="container-custom">
          {/* Back breadcrumb */}
          <Link to="/blog" className="inline-flex items-center text-sm text-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to all articles
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Post Content */}
            <div className="lg:col-span-2 space-y-8">
              <article className="bg-white rounded-2xl border border-border p-6 md:p-10 shadow-sm">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-muted mb-6 font-medium">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider text-xxs">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {post.publishedAt}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-heading mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Author profile banner */}
                <div className="flex items-center gap-3 py-4 border-y border-border/60 mb-8">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-11 h-11 rounded-full object-cover border border-border"
                  />
                  <div>
                    <p className="text-sm font-bold text-heading leading-tight">{post.authorName}</p>
                    <p className="text-xs text-muted font-medium">{post.authorRole}</p>
                  </div>
                </div>

                {/* Main Hero Image */}
                <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-gray-100 border border-border">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Body Text */}
                <div className="prose prose-blue max-w-none text-body leading-relaxed text-sm md:text-base space-y-6 whitespace-pre-line">
                  {post.content}
                </div>
              </article>
            </div>

            {/* Sidebar Recommendations */}
            <div className="lg:col-span-1 space-y-8">
              {/* Recommendations card */}
              <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-heading mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Recommended Reads
                </h3>
                <div className="space-y-6">
                  {recommendedPosts.map((recPost) => (
                    <div key={recPost.id} className="group border-b border-border/60 pb-5 last:border-0 last:pb-0">
                      <span className="text-xxs font-bold text-primary uppercase tracking-wider block mb-1">
                        {recPost.category}
                      </span>
                      <h4 className="font-bold text-heading group-hover:text-primary transition-colors text-sm mb-2 leading-snug">
                        <Link to={`/blog/${recPost.id}`}>{recPost.title}</Link>
                      </h4>
                      <p className="text-muted text-xs line-clamp-2 leading-relaxed mb-3">{recPost.excerpt}</p>
                      <Link to={`/blog/${recPost.id}`} className="inline-flex items-center text-xs font-bold text-primary hover:underline">
                        Read post <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation sidebar CTA */}
              <div className="bg-gradient-to-br from-primary to-primary-hover text-white rounded-2xl p-6 md:p-8 shadow-md text-center">
                <h3 className="text-xl font-bold mb-3">Have health questions?</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  Schedule a callback session to consult our medical professionals at a time that works for you.
                </p>
                <Link to="/#callback">
                  <Button variant="outline" className="w-full bg-white text-primary border-none hover:bg-gray-50">
                    Request a Callback
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
