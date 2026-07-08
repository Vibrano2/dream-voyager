import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Search, Loader2, Sparkles } from 'lucide-react';
import api from '../../../services/api';
import { BlogPost } from '../../../pages/Blog';

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: '',
        image_url: '',
        tags: '',
        published: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAIGenerating, setIsAIGenerating] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await api.get('/blogs?show_hidden=true');
            setBlogs(response.data.blogs || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (blog: BlogPost | null = null) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                title: blog.title,
                content: blog.content,
                author: blog.author,
                image_url: blog.image_url || '',
                tags: blog.tags ? blog.tags.join(', ') : '',
                published: blog.published
            });
        } else {
            setEditingBlog(null);
            setFormData({
                title: '',
                content: '',
                author: '',
                image_url: '',
                tags: '',
                published: true
            });
        }
        setIsModalOpen(true);
    };

    const handleGenerateAI = async () => {
        const topic = window.prompt("What should the blog post be about? (e.g., 'Top 5 beaches in Maldives')");
        if (!topic) return;

        setIsAIGenerating(true);
        try {
            const response = await api.post('/blogs/generate', { topic });
            const generatedBlog = response.data.blog;
            
            setEditingBlog(null);
            setFormData({
                title: generatedBlog.title || '',
                content: generatedBlog.content || '',
                author: 'Dream Voyager Admin',
                image_url: generatedBlog.image_url || '', 
                tags: generatedBlog.tags ? generatedBlog.tags.join(', ') : '',
                published: false // Default to false for review
            });
            setIsModalOpen(true);
        } catch (error: any) {
            console.error('Error generating AI blog:', error);
            const errorMsg = error.response?.data?.error || 'Failed to generate blog post with AI.';
            alert(errorMsg);
        } finally {
            setIsAIGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            };

            if (editingBlog) {
                await api.put(`/blogs/${editingBlog.id}`, payload);
            } else {
                await api.post('/blogs', payload);
            }
            
            setIsModalOpen(false);
            fetchBlogs();
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Failed to save blog post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await api.delete(`/blogs/${id}`);
                fetchBlogs();
            } catch (error) {
                console.error('Error deleting blog:', error);
                alert('Failed to delete blog post');
            }
        }
    };

    const filteredBlogs = blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Blog Posts</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleGenerateAI}
                        disabled={isAIGenerating}
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {isAIGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                        {isAIGenerating ? 'Generating...' : 'Generate with AI'}
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-[#F49129] text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        <Plus size={20} />
                        Create Post
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F49129]/20 focus:border-[#F49129]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-left">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Author</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Loading blogs...
                                    </td>
                                </tr>
                            ) : filteredBlogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No blog posts found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBlogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-800">{blog.title}</td>
                                        <td className="px-6 py-4 text-slate-600">{blog.author}</td>
                                        <td className="px-6 py-4">
                                            {blog.published ? (
                                                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                    <CheckCircle size={16} /> Published
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                                                    <XCircle size={16} /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(blog.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => handleOpenModal(blog)} className="text-blue-600 hover:text-blue-800" title="Edit">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:text-red-700" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                        placeholder="travel, guides, tips"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                    />
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="published"
                                        checked={formData.published}
                                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                        className="w-4 h-4 text-[#F49129] border-slate-300 rounded"
                                    />
                                    <label htmlFor="published" className="text-sm font-medium text-slate-700">Publish immediately</label>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                                    <textarea
                                        required
                                        rows={10}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg resize-y"
                                        placeholder="Write your blog post content here... (Paragraphs are separated by new lines)"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-[#F49129] text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlogs;
