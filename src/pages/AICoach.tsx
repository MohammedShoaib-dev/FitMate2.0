import { useState } from "react";
import { Send, Bot, Sparkles } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const quickPrompts = [
  "Create a workout plan",
  "Suggest post-workout meals",
  "How to improve my form?",
  "Best exercises for abs",
];

const AICoach = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 👋 I'm your AI Fitness Coach. I can help you with workout plans, nutrition advice, exercise form tips, and more. What would you like to know today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "Create a workout plan":
          "Great! Based on your goals, I recommend a 4-day split:\n\n📅 **Monday**: Chest & Triceps\n📅 **Tuesday**: Back & Biceps\n📅 **Wednesday**: Rest\n📅 **Thursday**: Legs\n📅 **Friday**: Shoulders & Core\n\nWould you like me to detail the exercises for each day?",
        "Suggest post-workout meals":
          "Here are some excellent post-workout meal ideas:\n\n🥗 **Option 1**: Grilled chicken with sweet potato\n🥤 **Option 2**: Protein shake with banana\n🍳 **Option 3**: Eggs with whole grain toast\n🐟 **Option 4**: Salmon with quinoa\n\nAim to eat within 30-60 minutes after your workout!",
        "How to improve my form?":
          "Great question! Here are key form tips:\n\n1️⃣ **Start with lighter weights** to master the movement\n2️⃣ **Use mirrors** to check your posture\n3️⃣ **Record yourself** to review later\n4️⃣ **Focus on slow, controlled movements**\n5️⃣ **Consider working with a trainer** initially\n\nWhat specific exercise would you like form tips for?",
        "Best exercises for abs":
          "Here are the top exercises for strong abs:\n\n💪 **Planks** - Hold for 30-60 seconds\n💪 **Dead bugs** - 3 sets of 10 each side\n💪 **Bicycle crunches** - 3 sets of 15\n💪 **Hanging leg raises** - 3 sets of 10\n💪 **Mountain climbers** - 3 sets of 20\n\nRemember: visible abs require low body fat percentage + nutrition!",
      };

      const defaultResponses = [
        "That's a great question! Let me think about the best approach for you. Generally, consistency and proper form are key to seeing results.",
        "I'd recommend focusing on progressive overload - gradually increasing weight or reps over time. Would you like specific guidance for your goals?",
        "Nutrition is just as important as exercise! Make sure you're getting enough protein (about 0.8-1g per pound of body weight) and staying hydrated.",
        "Rest and recovery are crucial! Aim for 7-9 hours of sleep and consider adding stretching or yoga to your routine.",
      ];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          responses[messageText] ||
          defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="header-gradient px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">AI Fitness Coach</h1>
              <p className="text-sm text-primary-foreground/80 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Powered by AI
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex animate-fade-in", message.isBot ? "justify-start" : "justify-end")}
            >
              {message.isBot && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] px-4 py-3 rounded-2xl whitespace-pre-line",
                  message.isBot
                    ? "bg-muted text-foreground rounded-bl-none"
                    : "bg-primary text-primary-foreground rounded-br-none"
                )}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="secondary"
                size="sm"
                className="whitespace-nowrap flex-shrink-0"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about fitness..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={() => handleSend()} size="icon" disabled={isTyping}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AICoach;
