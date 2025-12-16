import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

interface Package {
    id: string;
    title: string;
    description: string;
    destination: string;
    duration: number;
    price: number;
    category: string;
    image_url?: string;
    is_active: boolean;
    // Study Visa specific fields
    universities?: string[];
    countries?: string[];
    requirements?: string;
    processing_time?: string;
    success_rate?: number;
}

const AdminPackages = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        destination: '',
        duration: 0,
        price: 0,
        category: 'vacation',
        image_url: '',
        is_active: true,
        // Study Visa fields
        universities: [] as string[],
        countries: [] as string[],
        requirements: '',
        processing_time: '',
        success_rate: 0
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await api.get('/packages');
            setPackages(res.data);
        } catch (error) {
            console.error('Failed to fetch packages', error);
            // Mock data fallback
            setPackages([
                { id: '1', title: 'Bali Paradise', description: 'Amazing beach resort', destination: 'Bali, Indonesia', duration: 7, price: 2500000, category: 'vacation', is_active: true },
                { id: '2', title: 'Paris Romance', description: 'City of love tour', destination: 'Paris, France', duration: 5, price: 3200000, category: 'honeymoon', is_active: true }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPackage) {
                await api.put(`/packages/${editingPackage.id}`, formData);
            } else {
                await api.post('/packages', formData);
            }
            fetchPackages();
            closeModal();
        } catch (error) {
            console.error('Failed to save package', error);
            alert('Failed to save package. Please try again.');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) return formData.image_url;

        // TODO: Implement actual image upload to cloud storage (e.g., Cloudinary, AWS S3)
        // For now, return a placeholder URL
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);

        try {
            // const res = await api.post('/upload/image', formDataUpload);
            // return res.data.url;
            return imagePreview; // Temporary: use base64 preview
        } catch (error) {
            console.error('Image upload failed', error);
            return formData.image_url;
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this package?')) return;
        try {
            await api.delete(`/packages/${id}`);
            fetchPackages();
        } catch (error) {
            console.error('Failed to delete package', error);
        }
    };

    const openModal = (pkg?: Package) => {
        if (pkg) {
            setEditingPackage(pkg);
            setFormData({
                title: pkg.title,
                description: pkg.description,
                destination: pkg.destination,
                duration: pkg.duration,
                price: pkg.price,
                category: pkg.category,
                image_url: pkg.image_url || '',
                is_active: pkg.is_active,
                universities: pkg.universities || [],
                countries: pkg.countries || [],
                requirements: pkg.requirements || '',
                processing_time: pkg.processing_time || '',
                success_rate: pkg.success_rate || 0
            });
            setImagePreview(pkg.image_url || '');
        } else {
            setEditingPackage(null);
            setFormData({
                title: '',
                description: '',
                destination: '',
                duration: 0,
                price: 0,
                category: 'vacation',
                image_url: '',
                is_active: true,
                universities: [],
                countries: [],
                requirements: '',
                processing_time: '',
                success_rate: 0
            });
            setImagePreview('');
        }
        setImageFile(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setImageFile(null);
        setImagePreview('');
        setEditingPackage(null);
    };

    const filteredPackages = packages.filter(pkg =>
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading packages...</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search packages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => openModal()}
                    className="ml-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                >
                    <Plus size={20} />
                    Add Package
                </button>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                    <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                            {pkg.image_url ? (
                                <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl">🏖️</span>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg text-slate-800">{pkg.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {pkg.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{pkg.destination}</p>
                            <p className="text-xs text-slate-500 mb-3 line-clamp-2">{pkg.description}</p>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-slate-600">{pkg.duration} days</span>
                                <span className="font-bold text-lg text-blue-600">₦{pkg.price.toLocaleString()}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openModal(pkg)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Edit2 size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(pkg.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPackages.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-slate-500">No packages found</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800">
                                {editingPackage ? 'Edit Package' : 'Add New Package'}
                            </h2>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Destination</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="vacation">Vacation</option>
                                        <option value="honeymoon">Honeymoon</option>
                                        <option value="adventure">Adventure</option>
                                        <option value="business">Business</option>
                                        <option value="study-visa">Study Visa</option>
                                        <option value="visa">Visa Assistance</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (days)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₦)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Package Image</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview('');
                                                    setImageFile(null);
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                                            <div className="mt-2">
                                                <label htmlFor="image-upload" className="cursor-pointer">
                                                    <span className="text-blue-600 hover:text-blue-700 font-medium">Upload an image</span>
                                                    <input
                                                        id="image-upload"
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Or paste image URL below</p>
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={(e) => {
                                        setFormData({ ...formData, image_url: e.target.value });
                                        if (e.target.value) setImagePreview(e.target.value);
                                    }}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                />
                            </div>

                            {/* Study Visa Specific Fields */}
                            {(formData.category === 'study-visa' || formData.category === 'visa') && (
                                <>
                                    <div className="border-t border-slate-200 pt-4 mt-4">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Study Visa Details</h3>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Available Universities (comma separated)</label>
                                            <textarea
                                                rows={3}
                                                value={formData.universities.join(', ')}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    universities: e.target.value.split(',').map(u => u.trim()).filter(u => u)
                                                })}
                                                placeholder="Harvard University, MIT, Stanford University"
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Available Countries (comma separated)</label>
                                            <input
                                                type="text"
                                                value={formData.countries.join(', ')}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    countries: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                                                })}
                                                placeholder="USA, UK, Canada, Australia"
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Requirements</label>
                                            <textarea
                                                rows={4}
                                                value={formData.requirements}
                                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                                placeholder="List all requirements (e.g., IELTS 6.5, Bachelor's degree, etc.)"
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Processing Time</label>
                                                <input
                                                    type="text"
                                                    value={formData.processing_time}
                                                    onChange={(e) => setFormData({ ...formData, processing_time: e.target.value })}
                                                    placeholder="e.g., 4-6 weeks"
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Success Rate (%)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={formData.success_rate}
                                                    onChange={(e) => setFormData({ ...formData, success_rate: parseInt(e.target.value) || 0 })}
                                                    placeholder="95"
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Active Package</label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                                >
                                    {editingPackage ? 'Update Package' : 'Create Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPackages;
