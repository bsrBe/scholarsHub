import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag, Loader2 } from "lucide-react";
import { getBlogPost, type BlogPost } from "@/services/blogService";
import { useToast } from "@/components/ui/use-toast";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL;
  const isLoadedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    isLoadedRef.current = false;

    const fetchPost = async () => {
      if (!id) return;

      try {
        setLoading(true);
        console.log('Starting to fetch blog post with ID:', id);

        // Direct fetch without any service
        const response = await fetch(`${apiBaseURL}/articles/${id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        console.log('Raw fetch response received. Status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json().catch(e => {
          console.error('Error parsing JSON:', e);
          throw new Error('Invalid JSON response from server');
        });

        console.log('Successfully parsed response data:', data);

        if (isMounted) {
          isLoadedRef.current = true;
          setPost({
            _id: data._id,
            title: data.title || 'No Title',
            slug: data.slug || data._id,
            content: data.content || '',
            excerpt: data.excerpt || '',
            category: data.category || 'Uncategorized',
            thumbnail: data.thumbnail,
            isPublished: data.isPublished !== false,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            author: data.author ? {
              _id: data.author._id || 'unknown',
              name: data.author.name || 'Unknown Author',
              avatar: data.author.avatar,
            } : undefined,
            tags: data.tags || [],
          });
        }
      } catch (error) {
        console.error('Error in fetchPost:', error);
        if (isMounted) {
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to load blog post',
            variant: 'destructive',
          });
          navigate('/blog');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Set a longer timeout for debugging
    const timeoutId = setTimeout(() => {
      if (isMounted && !isLoadedRef.current) {
        console.error('Fetch timeout reached. Current state:', {
          loading,
          post: post ? 'Post exists' : 'No post',
          id,
          timestamp: new Date().toISOString()
        });

        // Try one more time before giving up
        console.log('Attempting one more time...');
        fetchPost();

        // If still no response after retry, show error
        setTimeout(() => {
          if (isMounted && !isLoadedRef.current) {
            toast({
              title: 'Timeout',
              description: 'The server is taking too long to respond. Please try again later.',
              variant: 'destructive',
            });
            navigate('/blog');
          }
        }, 5000);
      }
    }, 15000); // 15 second initial timeout

    fetchPost();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
    <main className="min-h-screen py-12">
      <article className="section-padding">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft size={20} className="mr-2" />
              Back to Blog
            </Button>
          </Link>

          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            {post.category && (
              <div className="flex items-center gap-2">
                <Tag size={18} />
                <span>{post.category}</span>
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8">
              {post.excerpt}
            </p>
          )}

          {post.thumbnail && (
            <div className="my-8 rounded-lg overflow-hidden">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {post.content && (
            <div
              className="prose prose-lg dark:prose-invert max-w-none mt-8 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {post.author && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                {post.author.avatar && (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{post.author.name}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">Need Personalized Guidance?</h3>
            <p className="text-muted-foreground mb-6">
              Our expert counselors are here to help you navigate your study abroad journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book-consultation">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Book Free Consultation
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
};

export default BlogPost;
