import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, Heart, Star, Users, Send, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Community() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    name: "", email: "", message: "",
    type: "general" as "general" | "bug" | "feature" | "suggestion",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.name || !feedback.message) {
      toast({ title: "Missing fields", description: "Please fill in your name and message", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast({ title: "Thank you for your feedback!", description: "We appreciate your input and will review it soon." });
      setFeedback({ name: "", email: "", message: "", type: "general" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen pattern-tribal">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between sm:container sm:mx-auto">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="min-h-[44px] min-w-[44px] p-2">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <Logo size="md" />
            <Badge variant="outline" className="ml-1 sm:ml-2 text-xs sm:text-sm">Community</Badge>
          </div>
        </div>
      </header>

      <div className="px-4 sm:container sm:mx-auto py-6 sm:py-8 md:py-12">
        {/* Welcome */}
        <section className="mb-8 sm:mb-12 md:mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-primary/10 mb-4 sm:mb-6">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 sm:mb-4">
              Join Our Community
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6 px-2">
              Connect with fellow language learners, share your experiences, and help us improve NAMQULA
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />Share Feedback
              </Badge>
              <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />Connect
              </Badge>
              <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />Contribute
              </Badge>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-foreground">Share Your Feedback</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">We'd love to hear from you!</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="name" className="text-sm">Your Name *</Label>
                    <Input id="name" placeholder="Enter your name" value={feedback.name} onChange={(e) => setFeedback({ ...feedback, name: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="email" className="text-sm">Email (Optional)</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" value={feedback.email} onChange={(e) => setFeedback({ ...feedback, email: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="type" className="text-sm">Feedback Type</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { value: "general", label: "General" },
                      { value: "bug", label: "Bug Report" },
                      { value: "feature", label: "Feature" },
                      { value: "suggestion", label: "Suggestion" },
                    ].map((type) => (
                      <Button key={type.value} type="button" variant={feedback.type === type.value ? "default" : "outline"} size="sm" onClick={() => setFeedback({ ...feedback, type: type.value as any })} className="w-full text-xs sm:text-sm">
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="message" className="text-sm">Your Message *</Label>
                  <Textarea id="message" placeholder="Tell us what you think..." rows={6} value={feedback.message} onChange={(e) => setFeedback({ ...feedback, message: e.target.value })} required className="resize-none text-sm sm:text-base" />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : (<><Send className="w-4 h-4 mr-2" />Send Feedback</>)}
                </Button>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6">
              <h3 className="font-display text-lg sm:text-xl text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />Community Guidelines
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span>Be respectful and kind to all community members</span></li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span>Share constructive feedback and suggestions</span></li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span>Help others learn and grow together</span></li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span>Report bugs and issues you encounter</span></li>
              </ul>
            </Card>

            <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <h3 className="font-display text-lg sm:text-xl text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />How to Contribute
              </h3>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                <p>Your feedback helps us improve NAMQULA! Share your ideas, report issues, or suggest new features.</p>
                <p>We review all feedback and use it to make the platform better for everyone learning Namibian languages.</p>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h3 className="font-display text-lg sm:text-xl text-foreground mb-3 sm:mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => navigate("/")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />Back to Home
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => navigate("/language/oshikwanyama")}>
                  <MessageSquare className="w-4 h-4 mr-2" />Start Learning
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
