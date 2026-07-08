import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Loader2, Tag } from 'lucide-react';
import api from '../services/api';
import { BlogPost } from './Blog';

const BlogDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await api.get(`/blogs/${id}`);
                setBlog(response.data.blog);
            } catch (err: any) {
                console.error('Error fetching blog post:', err);
                setError('Failed to load the blog post. It may have been removed.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-16 flex justify-center items-center bg-gray-50">
                <Loader2 className="w-12 h-12 animate-spin text-brand-skyblue" />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen pt-32 pb-16 bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
                    <p className="text-gray-600 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
                    <Link to="/blog" className="inline-flex items-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all font-semibold shadow-md">
                        <ArrowLeft size={18} />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
            {/* Hero Image */}
            <div className="w-full h-[40vh] md:h-[50vh] relative">
                <img 
                    src={blog.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80'} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute inset-0 flex items-end pb-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full text-white">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                            <ArrowLeft size={16} />
                            Back to Articles
                        </Link>
                        
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex gap-2 mb-4 flex-wrap">
                                {blog.tags.map((tag, idx) => (
                                    <span key={idx} className="bg-brand-skyblue text-brand-navy px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-outfit mb-6 leading-tight drop-shadow-md">
                            {blog.title}
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-white/90 font-medium">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <User size={18} className="text-brand-skyblue" />
                                <span>{blog.author}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <Calendar size={18} className="text-brand-skyblue" />
                                <span>{new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="prose prose-lg max-w-none text-gray-700 font-inter">
                        {blog.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() !== '' ? (
                                <p key={index} className="mb-6 leading-relaxed text-[1.1rem]">
                                    {paragraph}
                                </p>
                            ) : null
                        ))}
                    </div>
                    
                    {/* Footer Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3 flex-wrap">
                                <Tag size={20} className="text-gray-400" />
                                <span className="font-semibold text-gray-700 mr-2">Tags:</span>
                                {blog.tags.map((tag, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
