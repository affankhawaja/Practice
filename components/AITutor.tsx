
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Send, Loader2, Code, Terminal, BookOpen, ShieldCheck } from 'lucide-react';

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleAsk = async (textToSubmit?: string) => {
    const query = textToSubmit || input;
    if (!query.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, text: query }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction: "You are the StelleCloud AI Mentor, a world-class DevOps and SRE expert. You help students with Kubernetes, Terraform, AWS, and modern Cloud Native architectures. Keep answers technical but encouraging. Use Markdown for code snippets.",
        }
      });

      setMessages([...newMessages, { role: 'ai' as const, text: response.text || "I'm having trouble connecting to the Cloud Engine. Try again." }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'ai' as const, text: "Connectivity issue detected in the AI core. Please check your credentials." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Explain K8s Pods', icon: <Terminal size={14} /> },
    { label: 'Terraform S3 Module', icon: <Code size={14} /> },
    { label: 'AWS EKS vs ECS', icon: <BookOpen size={14} /> }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-slate-950 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="font-black text-white text-lg tracking-tight">AI DevOps Lab</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NPU Core Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
           <ShieldCheck size={14} className="text-blue-400" />
           Verified Logic
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-black/20"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-10 max-w-xl mx-auto">
             <div className="space-y-4">
               <h4 className="text-2xl font-black text-white tracking-tight">Accelerate your Cloud Journey.</h4>
               <p className="text-slate-400 font-bold">I am your private DevOps mentor. Ask me about Infrastructure as Code, CI/CD pipelines, or Kubernetes orchestration.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
               {quickPrompts.map((p, i) => (
                 <button 
                   key={i}
                   onClick={() => handleAsk(p.label)}
                   className="flex flex-col items-center gap-3 p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500/50 hover:bg-slate-800 transition-all group"
                 >
                   <div className="text-blue-500 group-hover:scale-110 transition-transform">{p.icon}</div>
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">{p.label}</span>
                 </button>
               ))}
             </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[80%] p-6 rounded-[2rem] ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none font-medium text-sm leading-relaxed prose prose-invert prose-sm max-w-2xl'
              }`}>
                {m.text}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl rounded-tl-none flex items-center gap-3">
               <Loader2 size={16} className="animate-spin text-blue-500" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generating Insight...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-8 bg-slate-900/80 border-t border-white/5">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
          className="flex gap-4 max-w-4xl mx-auto bg-black/50 p-2 rounded-3xl border border-white/10"
        >
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your mentor anything about Cloud Architecture..."
            className="flex-1 bg-transparent border-none text-white px-6 py-4 text-sm font-bold placeholder:text-slate-600 outline-none"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-blue-600 text-white px-8 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 disabled:opacity-20 transition-all flex items-center gap-2"
          >
            Query <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AITutor;
