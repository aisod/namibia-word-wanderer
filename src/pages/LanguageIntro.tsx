import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/Logo";
import { useLanguageData } from "@/hooks/useLanguageData";
import { ArrowLeft, ArrowRight, Users, MapPin, Globe, Lightbulb, BookOpen, CheckCircle } from "lucide-react";

export default function LanguageIntro() {
  const navigate = useNavigate();
  const { languageId } = useParams();
  const { languageInfo, categories, isLoading } = useLanguageData(languageId);

  if (!languageInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <p className="text-muted-foreground">Language not found</p>
        )}
      </div>
    );
  }

  const coverImage = languageInfo.coverImage ?? "/oshiwambo.png";

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
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-8 sm:py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${coverImage})` }}>
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 px-4 sm:container sm:mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl text-white mb-3 sm:mb-4 drop-shadow-lg">
              {languageInfo.name}
            </h1>
            <p className="font-display text-xl sm:text-2xl text-primary mb-6 sm:mb-8 drop-shadow-md">
              {languageInfo.nativeName}
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-10">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-white font-medium text-sm sm:text-base">{languageInfo.speakers}</span>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-white font-medium text-sm sm:text-base">{languageInfo.regions.length} Regions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-secondary/30 to-transparent">
        <div className="px-4 sm:container sm:mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <Card className="p-4 sm:p-6 glass-card">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-lg sm:text-xl text-foreground">About the Language</h2>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{languageInfo.description}</p>
              </Card>

              <Card className="p-4 sm:p-6 glass-card">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <h2 className="font-display text-lg sm:text-xl text-foreground">History & Culture</h2>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{languageInfo.history}</p>
              </Card>
            </div>

            <Card className="p-4 sm:p-6 mt-4 sm:mt-6 md:mt-8 glass-card">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                </div>
                <h2 className="font-display text-lg sm:text-xl text-foreground">Where It's Spoken</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {languageInfo.regions.map((region) => (
                  <Badge key={region} variant="secondary" className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">{region}</Badge>
                ))}
              </div>
            </Card>

            <Card className="p-4 sm:p-6 mt-4 sm:mt-6 md:mt-8 glass-card">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                </div>
                <h2 className="font-display text-lg sm:text-xl text-foreground">Fun Facts</h2>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                {languageInfo.funFacts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-muted-foreground">{fact}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="px-4 sm:container sm:mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-2">What You'll Learn</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Master these vocabulary categories through interactive games</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((cat, index) => (
                <Card key={cat.id} className="p-3 sm:p-4 text-center animate-slide-up" style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}>
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{cat.icon}</div>
                  <h3 className="font-semibold text-foreground text-xs sm:text-sm">{cat.name}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{cat.count} words</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="px-4 sm:container sm:mx-auto">
          <Card className="max-w-2xl mx-auto p-6 sm:p-8 md:p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-3 sm:mb-4">Ready to Start Learning?</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
              Choose from multiple game modes to master {languageInfo.name} vocabulary in a fun and interactive way.
            </p>
            <Button 
              size="lg" 
              className="relative text-sm sm:text-base md:text-lg px-6 sm:px-10 h-12 sm:h-14 md:h-16 text-white hover:opacity-90 active:scale-95 transition-transform overflow-hidden border-2 border-white/30 w-full sm:w-auto"
              style={{ backgroundImage: 'url(/heroimage.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
              onClick={() => navigate(`/games/${languageId}`)}
            >
              <div className="absolute inset-0 bg-black/40" />
              <span className="relative z-10 flex items-center justify-center">
                Choose a Game
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-2" />
              </span>
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
