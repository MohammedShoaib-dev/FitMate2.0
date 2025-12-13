import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getFitnessAdvice, testGeminiAPI } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI Gym Assistant. I can help you with workouts, nutrition, form tips, and fitness goals. What would you like to know? 💪",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [apiWorking, setApiWorking] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Test API connection on component mount
  useEffect(() => {
    const testAPI = async () => {
      const result = await testGeminiAPI();
      setApiWorking(result.success);
      if (!result.success) {
        console.error('Gemini API test failed:', result.error);
      }
    };
    testAPI();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      console.log('Attempting to get AI response for:', currentInput);
      
      // Get AI response from Gemini
      const aiResponse = await getFitnessAdvice(currentInput);
      
      if (!aiResponse || aiResponse.trim().length === 0) {
        throw new Error('Empty response from AI');
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      
      // Update API status to working if successful
      if (apiWorking === false) {
        setApiWorking(true);
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      
      // Update API status
      setApiWorking(false);
      
      // Fallback responses if AI fails
      const fallbackResponses = [
        "I'm having trouble connecting to my AI brain right now. Here's some general advice: Always warm up before exercising and cool down afterward!",
        "Sorry, I'm experiencing some technical difficulties. In the meantime, remember to stay hydrated during your workouts! 💧",
        "I can't access my full AI capabilities at the moment, but I can tell you that consistency is key to reaching your fitness goals!",
        "Technical issue on my end! While I sort this out, remember that proper form is more important than lifting heavy weights.",
        `API Error: ${error instanceof Error ? error.message : 'Unknown error'}. Using fallback response for now.`
      ];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      
      toast({
        title: "AI Assistant Notice",
        description: `API Error: ${error instanceof Error ? error.message : 'Unknown error'}. Using fallback responses.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-[99999]"
          style={{ position: 'fixed', zIndex: 99999 }}
        >
          <button
            onClick={() => {
              setIsOpen(true);
              setShowNotification(false);
            }}
            className="floating-chat-btn relative"
            title="Chat with AI Assistant"
          >
            <MessageCircle className="w-6 h-6" />
            {showNotification && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 bg-background flex flex-col animate-fade-in" style={{ zIndex: 10000 }}>
          {/* Header */}
          <div className="header-gradient px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-primary-foreground">AI Gym Assistant</h2>
                <p className="text-sm text-primary-foreground/80">
                  {apiWorking === null ? "Testing connection..." : 
                   apiWorking ? "✅ AI Powered by Gemini" : "⚠️ Fallback mode - Check console"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isBot ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-3 rounded-2xl",
                    message.isBot
                      ? "bg-muted text-foreground rounded-bl-none"
                      : "bg-primary text-primary-foreground rounded-br-none"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2 mb-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about fitness..."
                className="flex-1"
                disabled={isLoading}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
              />
              <Button onClick={handleSend} size="icon" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            {/* Debug button for testing API */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  console.log('🧪 Manual API test triggered');
                  const result = await testGeminiAPI();
                  console.log('🧪 Test result:', result);
                  
                  const testMessage: Message = {
                    id: Date.now().toString(),
                    text: result.success 
                      ? `✅ API Test Success: ${result.response}` 
                      : `❌ API Test Failed: ${result.error}`,
                    isBot: true,
                    timestamp: new Date(),
                  };
                  setMessages(prev => [...prev, testMessage]);
                }}
                disabled={isLoading}
                className="text-xs"
              >
                Test API
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  console.log('📊 Current API Status:', { apiWorking });
                  console.log('📊 Environment Variables:', {
                    hasGeminiKey: !!import.meta.env.VITE_GEMINI_API_KEY,
                    keyLength: import.meta.env.VITE_GEMINI_API_KEY?.length || 0
                  });
                }}
                className="text-xs"
              >
                Debug Info
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
