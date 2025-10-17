import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { blogPosts } from "@/lib/constants";

const Blog = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Blog & <span className="gradient-text">Resources</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Expert insights, tips, and guides to help you navigate
            your study abroad journey with confidence.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag size={16} />
                      <span>{post.category}</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="ghost" className="w-full group/btn">
                      Read More
                      <ArrowRight
                        size={16}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stay Updated
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Get the latest tips, guides, and updates on studying abroad
            delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-4 rounded-2xl flex-1 text-foreground"
            />
            <Button variant="secondary" size="lg" className="whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;
