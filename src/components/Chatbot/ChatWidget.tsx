"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { MessageSquare, X, Send, Sparkles, User, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Initial greeting
  const showGreeting = messages.length === 0;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-50 p-4 rounded-full bg-[#92400e] text-white shadow-2xl hover:bg-[#712c00] hover:scale-105 transition-all duration-300 flex items-center justify-center ${
          isOpen ? "opacity-0 pointer-events-none translate-y-4 scale-90" : "opacity-100 translate-y-0 scale-100"
        }`}
        aria-label="සහායකයා විවෘත කරන්න"
      >
        <MessageSquare className="w-7 h-7" />
        {showGreeting && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[80vh] sm:h-[600px] max-h-[800px] bg-[#fdfbf7] rounded-3xl shadow-2xl border border-[#e6dfd3] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100 pointer-events-auto translate-y-0" : "scale-90 opacity-0 pointer-events-none translate-y-8"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#92400e] to-[#712c00] text-white p-4 flex items-center justify-between shrink-0 shadow-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif-monastic font-bold text-lg leading-tight tracking-wide">සුභූති හිමි (AI)</h3>
              <p className="text-[11px] text-amber-100 font-medium tracking-wide flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                සෙනසුන සහායක මාර්ගගතයි
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="වසන්න"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[url('/images/pattern-bg.png')] bg-repeat bg-white/40 bg-blend-overlay">
          {showGreeting && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shadow-sm">
                <Sparkles className="w-8 h-8 text-[#92400e]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif-monastic font-bold text-[#1e293b] text-lg">තෙරුවන් සරණයි!</h4>
                <p className="text-sm text-[#475569] max-w-[250px] leading-relaxed mx-auto">
                  සේනාසනය පිළිබඳව හෝ ධර්ම කරුණු පිළිබඳව ඔබට අවශ්‍ය තොරතුරු මාගෙන් විමසන්න.
                </p>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[88%] animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                  m.role === "user" ? "bg-[#14532d] text-white" : "bg-[#92400e] text-white"
                }`}
              >
                {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`px-4 py-3 text-sm shadow-sm ${
                  m.role === "user"
                    ? "bg-[#14532d] text-white rounded-2xl rounded-tr-sm"
                    : "bg-white border border-[#e6dfd3] text-[#1e293b] rounded-2xl rounded-tl-sm"
                }`}
              >
                {m.role === "user" ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                ) : (
                  <div className="text-sm leading-relaxed space-y-2">
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        a: ({ node, ...props }) => (
                          <a className="text-[#92400e] underline hover:text-[#712c00] font-semibold" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-semibold text-[#92400e]" {...props} />
                        ),
                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 max-w-[85%] mr-auto animate-in fade-in duration-300">
              <div className="w-7 h-7 rounded-full bg-[#92400e] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-[#e6dfd3] flex items-center gap-2.5 shadow-sm">
                <Loader2 className="w-4 h-4 text-[#92400e] animate-spin" />
                <span className="text-xs font-medium text-[#64748b]">සිතමින් පවතී... (Thinking)</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-2.5 max-w-[85%] mr-auto animate-in fade-in duration-300">
              <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-red-50 border border-red-100 flex flex-col gap-1 shadow-sm">
                <span className="text-sm font-medium text-red-800">කණගාටුයි, දෝෂයක් මතු විය.</span>
                <span className="text-xs text-red-600">කරුණාකර API Key එක නිවැරදි දැයි පරීක්ෂා කරන්න. ({error.message || 'Unknown Error'})</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-[#e6dfd3] shrink-0 z-10 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-[#f8f5ee] border border-[#e6dfd3] rounded-full p-1.5 focus-within:ring-2 focus-within:ring-[#92400e]/30 focus-within:border-[#92400e] transition-all shadow-inner"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="ඔබේ ප්‍රශ්නය මෙහි සටහන් කරන්න..."
              className="flex-1 bg-transparent px-3 py-1.5 text-sm text-[#1e293b] focus:outline-none placeholder:text-[#94a3b8]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-full bg-[#92400e] text-white flex items-center justify-center hover:bg-[#712c00] transition-colors disabled:opacity-50 shrink-0 cursor-pointer shadow-md active:scale-95"
              aria-label="පණිවිඩය යවන්න"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-2 flex justify-center items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#94a3b8]" />
            <span className="text-[9px] text-[#94a3b8] font-medium tracking-wide">
              AI සහායකයා ලබාදෙන පිළිතුරු වල දෝෂ පැවතිය හැක.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
