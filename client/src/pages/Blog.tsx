import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    author: string;
    image_url: string;
    tags: string[];
    published: boolean;
    created_at: string;
}

const Blog = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get('/blogs');
                setBlogs(response.data.blogs || []);
            } catch (err: any) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load blog posts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const truncate = (text: string, length: number) => {
        if (!text) return '';
        // Strip basic markdown syntax for the preview
        const plainText = text.replace(/[#*`_>\[\]]/g, '').trim();
        return plainText.length > length ? plainText.substring(0, length) + '...' : plainText;
    };

    return (
        <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-brand-navy mb-4 font-outfit">Our Travel Blog</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover travel tips, destination guides, and inspiring stories from our experts.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-brand-skyblue" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center shadow-sm">
                        <p className="text-lg">{error}</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">No blog posts available at the moment.</p>
                        <p className="mt-2">Check back soon for exciting travel stories!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((post) => (
                            <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
                                <div className="relative h-56 overflow-hidden">
                                    <img 
                                        src={post.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80'} 
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                                            {post.tags.slice(0, 2).map((tag, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-brand-navy text-xs font-semibold rounded-full shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} className="text-brand-skyblue" />
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={14} className="text-brand-skyblue" />
                                            <span>{post.author}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-brand-navy mb-3 group-hover:text-brand-skyblue transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                                        {truncate(post.content, 150)}
                                    </p>
                                    <Link 
                                        to={`/blog/${post.id}`}
                                        className="inline-flex items-center gap-2 text-brand-skyblue font-semibold hover:gap-3 transition-all mt-auto group/btn"
                                    >
                                        Read More
                                        <ArrowRight size={18} className="group-hover/btn:text-brand-navy transition-colors" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
