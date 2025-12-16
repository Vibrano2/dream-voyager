import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! I'm your Dream Voyager AI assistant. How can I help you plan your trip today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' as const };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const response = await api.post('/chat', {
                message: userMsg.text
            });

            const botMsg: Message = {
                id: Date.now() + 1,
                text: response.data.response,
                sender: 'bot' as const
            };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error('Chat Error:', error);
            const errorMsg: Message = {
                id: Date.now() + 1,
                text: "I'm having trouble connecting right now. Please try again later.",
                sender: 'bot' as const
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 flex flex-col h-[500px] border border-slate-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-4 rounded-t-2xl flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#F49129] p-1.5 rounded-full">
                                <Bot size={16} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Dream Bot</h3>
                                <span className="text-[10px] text-slate-300 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                    ? 'bg-slate-900 text-white rounded-br-none'
                                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-slate-700 shadow-sm border border-slate-100 p-3 rounded-2xl rounded-bl-none">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-slate-100 rounded-b-2xl">
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-[#F49129]/20 focus-within:border-[#F49129] transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                disabled={loading}
                                className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="text-[#F49129] hover:text-[#d67a1f] transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#F49129] hover:bg-[#d67a1f] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                    <MessageSquare size={24} />
                </button>
            )}
        </div>
    );
};

export default ChatWidget;
