import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { LanguageCard } from "@/components/LanguageCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { oshikwanyamaInfo } from "@/data/oshikwanyamaData";
import { Globe, Sparkles, BookOpen, Gamepad2, Users, MapPin, ChevronRight, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pattern-tribal">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 container mx-auto px-4 pt-8 pb-16">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-12">
            <Logo size="lg" />
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Learn Namibian Languages Through Play
            </Badge>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
              Discover the Beauty of{" "}
              <span className="text-gradient-sunset">African Languages</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              An interactive game-based learning experience designed to help English speakers 
              master key words and grammar in Namibian local languages.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                onClick={() => navigate("/language/oshikwanyama")}
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 h-14">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Languages
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {[
              { icon: Globe, label: "Languages", value: "1+" },
              { icon: BookOpen, label: "Words", value: "100+" },
              { icon: Gamepad2, label: "Games", value: "3" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 text-muted-foreground">
                <stat.icon className="w-5 h-5 text-primary" />
                <span className="font-display text-2xl text-foreground">{stat.value}</span>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Languages Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Choose Your Language
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select a language to learn. Each language comes with its unique history, 
              vocabulary, and interactive games.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Oshikwanyama - Available */}
            <LanguageCard
              name="Oshikwanyama"
              nativeName="Oshiwambo"
              speakers={oshikwanyamaInfo.speakers}
              regions={oshikwanyamaInfo.regions}
              onClick={() => navigate("/language/oshikwanyama")}
              isAvailable={true}
            />

            {/* Coming Soon Languages */}
            <LanguageCard
              name="Otjiherero"
              nativeName="Otjiherero"
              speakers="250,000+ speakers"
              regions={["Kunene", "Omaheke", "Otjozondjupa"]}
              onClick={() => {}}
              isAvailable={false}
            />
            
            <LanguageCard
              name="Khoekhoegowab"
              nativeName="Damara/Nama"
              speakers="200,000+ speakers"
              regions={["Hardap", "Karas", "Erongo"]}
              onClick={() => {}}
              isAvailable={false}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Pick a Language",
                description: "Choose from our growing collection of Namibian languages to learn.",
                icon: Globe,
              },
              {
                step: "02",
                title: "Learn the Basics",
                description: "Discover the history and key facts about your chosen language.",
                icon: BookOpen,
              },
              {
                step: "03",
                title: "Play & Learn",
                description: "Master vocabulary through fun, interactive games and quizzes.",
                icon: Gamepad2,
              },
            ].map((item, index) => (
              <div 
                key={item.step} 
                className={`text-center animate-slide-up stagger-${index + 1}`}
                style={{ opacity: 0 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <Logo size="sm" className="justify-center mb-4" />
          <p className="text-sm text-muted-foreground">
            Preserving and sharing the beauty of Namibian languages through interactive learning.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Language content sourced from Teacher Vaskez (Mbongue Lucas Shuukifeni)
          </p>
        </div>
      </footer>
    </div>
  );
}
