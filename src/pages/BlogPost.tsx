import { useParams, Link } from "react-router-dom";
import { blogPosts } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button variant="outline">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main>
      <article className="section-padding">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft size={20} />
              Back to Blog
            </Button>
          </Link>

          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={18} />
              <span>{post.category}</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              This is a placeholder for the full blog post content. In a real implementation,
              this would be fetched from a CMS or markdown file and rendered here.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              The article would include detailed information, tips, and insights related to
              the topic "{post.title}". Content would be formatted with proper headings,
              lists, images, and other rich media elements to provide comprehensive value
              to readers.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">Key Takeaways</h2>
            <ul className="space-y-3 mb-6">
              <li className="text-lg">Important point number one about the topic</li>
              <li className="text-lg">Another crucial insight for students</li>
              <li className="text-lg">Practical advice that can be immediately applied</li>
              <li className="text-lg">Final key takeaway from this article</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-6">Conclusion</h2>
            <p className="text-lg leading-relaxed mb-6">
              In conclusion, understanding these aspects will help you make informed decisions
              about your study abroad journey. For personalized guidance tailored to your
              specific situation, book a free consultation with our expert counselors.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">Need Personalized Guidance?</h3>
            <p className="text-muted-foreground mb-6">
              Our expert counselors are here to help you navigate your study abroad journey.
            </p>
            <Link to="/book-consultation">
              <Button variant="hero" size="lg">
                Book Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
};

export default BlogPost;
