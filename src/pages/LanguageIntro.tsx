import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/Logo";
import { oshikwanyamaInfo, categories } from "@/data/oshikwanyamaData";
import { ArrowLeft, ArrowRight, Users, MapPin, Globe, Lightbulb, BookOpen, CheckCircle } from "lucide-react";

export default function LanguageIntro() {
  const navigate = useNavigate();
  const { languageId } = useParams();

  // For now, we only have Oshikwanyama
  const languageInfo = oshikwanyamaInfo;

  return (
    <div className="min-h-screen pattern-tribal">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => navigate("/")}
              className="min-h-[48px] min-w-[48px] p-2"
            >
              <ArrowLeft className="w-6 h-6 md:w-7 md:h-7" />
            </Button>
            <Logo size="lg" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/oshiwambo.png)' }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-6xl text-white mb-4 drop-shadow-lg">
              {languageInfo.name}
            </h1>
            <p className="font-display text-2xl text-primary mb-8 drop-shadow-md">
              {languageInfo.nativeName}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <Users className="w-5 h-5 text-white" />
                <span className="text-white font-medium">{languageInfo.speakers}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <MapPin className="w-5 h-5 text-white" />
                <span className="text-white font-medium">
                  {languageInfo.regions.length} Regions
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Description */}
              <Card className="p-6 glass-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-xl text-foreground">About the Language</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {languageInfo.description}
                </p>
              </Card>

              {/* History */}
              <Card className="p-6 glass-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="font-display text-xl text-foreground">History & Culture</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {languageInfo.history}
                </p>
              </Card>
            </div>

            {/* Regions */}
            <Card className="p-6 mt-8 glass-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-success" />
                </div>
                <h2 className="font-display text-xl text-foreground">Where It's Spoken</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {languageInfo.regions.map((region) => (
                  <Badge key={region} variant="secondary" className="px-4 py-1.5 text-sm">
                    {region}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Fun Facts */}
            <Card className="p-6 mt-8 glass-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-warning" />
                </div>
                <h2 className="font-display text-xl text-foreground">Fun Facts</h2>
              </div>
              <ul className="space-y-3">
                {languageInfo.funFacts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{fact}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl text-foreground mb-2">
                What You'll Learn
              </h2>
              <p className="text-muted-foreground">
                Master these vocabulary categories through interactive games
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((cat, index) => (
                <Card 
                  key={cat.id}
                  className={`p-4 text-center animate-slide-up`}
                  style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="font-semibold text-foreground text-sm">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">{cat.count} words</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 md:p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-muted-foreground mb-8">
              Choose from multiple game modes to master {languageInfo.name} vocabulary 
              in a fun and interactive way.
            </p>
            <Button 
              size="lg" 
              className="relative text-base md:text-lg px-10 h-14 md:h-16 text-white hover:opacity-90 active:scale-95 transition-transform overflow-hidden border-2 border-white/30"
              style={{
                backgroundImage: 'url(/heroimage.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
              onClick={() => navigate(`/games/${languageId}`)}
            >
              <div className="absolute inset-0 bg-black/40" />
              <span className="relative z-10 flex items-center">
                Choose a Game
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
              </span>
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
