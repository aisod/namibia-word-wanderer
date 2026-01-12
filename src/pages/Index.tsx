import { Logo } from "@/components/ui/Logo";
import { LanguageCard } from "@/components/LanguageCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { AchievementBadge } from "@/components/AchievementBadge";
import { oshikwanyamaInfo } from "@/data/oshikwanyamaData";
import { Globe, Sparkles, BookOpen, Gamepad2, Users, MapPin, ChevronRight, Users as UsersIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pattern-tribal relative">
      <ParticleBackground particleCount={30} />
      {/* Hero Section */}
      <header className="relative overflow-hidden py-8 md:py-12 lg:py-16">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/heroimage.jpg)' }}
        >
          {/* Dark overlay with neon gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />
          {/* Animated neon particles */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-glow-pulse" />
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent rounded-full animate-glow-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-success rounded-full animate-glow-pulse" style={{animationDelay: '2s'}} />
          </div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          {/* Nav - Logo and Join */}
          <nav className="flex items-center justify-between mb-8 md:mb-10">
            <div className="flex-1"></div>
            <Logo size="2xl" showText={false} clickable={true} />
            <div className="flex-1 flex justify-end">
              <Button 
                variant="ghost" 
                size="lg" 
                className="min-h-[44px] px-4 md:px-6 text-white hover:text-white hover:bg-white/10"
                onClick={() => navigate("/community")}
              >
                <UsersIcon className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Join</span>
              </Button>
            </div>
          </nav>

          {/* Hero Content - NAMQULA Information */}
          <div className="text-center max-w-4xl mx-auto">

            {/* About NAMQULA */}
            <div className="mb-12 md:mb-16">
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight drop-shadow-lg">
                Learn Namibian Languages{" "}
                <span className="text-primary drop-shadow-md">Through Play</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-6 leading-relaxed drop-shadow-md">
                NAMQULA is an interactive game-based learning platform designed to help English speakers 
                master key words and grammar in Namibian local languages. Experience the beauty of 
                African languages through fun, engaging games and interactive lessons.
              </p>

              <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto drop-shadow-sm">
                Preserving and sharing the rich cultural heritage of Namibian languages for future generations.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center mt-8">
              <button
                className="cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-200 mb-3 group"
                onClick={() => {
                  // Scroll to languages section
                  const languagesSection = document.getElementById('languages-section');
                  if (languagesSection) {
                    languagesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <div className="relative">
                  <img
                    src="/playbutton.png"
                    alt="Play button"
                    className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain group-hover:animate-float-gentle"
                  />
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-glow-pulse group-hover:bg-primary/40 transition-colors duration-300" />
                </div>
              </button>
              <p className="text-white text-base md:text-lg font-medium drop-shadow-md">
                Play Now
              </p>
            </div>
          </div>

          {/* Stats & Progress */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-12 md:mt-16">
            {[
              { icon: Globe, label: "Languages", value: "1+", progress: 1, max: 3 },
              { icon: BookOpen, label: "Words", value: "100+", progress: 100, max: 500 },
              { icon: Gamepad2, label: "Games", value: "4", progress: 4, max: 8 },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-3 text-white/90 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 min-w-[120px]">
                <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-white flex-shrink-0" />
                <span className="font-display text-2xl md:text-3xl text-white">{stat.value}</span>
                <span className="text-sm md:text-base text-white/90 text-center">{stat.label}</span>
                <ProgressIndicator current={stat.progress!} total={stat.max!} size="sm" showNumbers={false} />
              </div>
            ))}
          </div>

          {/* Achievement Preview */}
          <div className="mt-8 md:mt-12">
            <div className="flex flex-wrap justify-center gap-4">
              <AchievementBadge
                title="First Steps"
                description="Started learning Oshikwanyama"
                icon="star"
                earned={true}
              />
              <AchievementBadge
                title="Word Master"
                description="Found 50 words in word search"
                icon="target"
                earned={false}
              />
              <AchievementBadge
                title="Game Champion"
                description="Completed all games"
                icon="trophy"
                earned={false}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Languages Section */}
      <section id="languages-section" className="py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Choose Your Language
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto px-4">
              Select a language to learn. Each language comes with its unique history, 
              vocabulary, and interactive games.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {/* Oshikwanyama - Available */}
            <LanguageCard
              name="Oshikwanyama"
              nativeName="Oshiwambo"
              speakers={oshikwanyamaInfo.speakers}
              regions={oshikwanyamaInfo.regions}
              coverImage="/oshiwambo.png"
              onClick={() => navigate("/language/oshikwanyama")}
              isAvailable={true}
            />

            {/* Coming Soon Languages */}
            <LanguageCard
              name="Otjiherero"
              nativeName="Otjiherero"
              speakers="250,000+ speakers"
              regions={["Kunene", "Omaheke", "Otjozondjupa"]}
              coverImage="/herero.jpg"
              onClick={() => {}}
              isAvailable={false}
            />
            
            <LanguageCard
              name="Khoekhoegowab"
              nativeName="Damara/Nama"
              speakers="200,000+ speakers"
              regions={["Hardap", "Karas", "Erongo"]}
              coverImage="/khoikhoi.jpg"
              onClick={() => {}}
              isAvailable={false}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-b from-secondary/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Pick a Language",
                description: "Choose from our growing collection of Namibian languages to learn.",
                image: "/pickyourlanguage.jpg",
              },
              {
                step: "02",
                title: "Learn the Basics",
                description: "Discover the history and key facts about your chosen language.",
                image: "/learnthebasics.jpg",
              },
              {
                step: "03",
                title: "Play & Learn",
                description: "Master vocabulary through fun, interactive games and quizzes.",
                image: "/playandlearn.jpg",
              },
            ].map((item, index) => (
              <div 
                key={item.step} 
                className={`text-center animate-slide-up stagger-${index + 1}`}
                style={{ opacity: 0 }}
              >
                <div className="w-48 h-48 md:w-56 md:h-56 mx-auto mb-6 rounded-2xl overflow-hidden shadow-glow border-2 border-border/50">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">{item.title}</h3>
                <p className="text-base md:text-lg text-muted-foreground px-4">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Contributors Section */}
      <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-b from-transparent to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Bringing This Project to Life
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto px-4">
              Meet the dedicated individuals making NAMQULA possible
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Team Member Cards */}
              <div className="text-center p-8 md:p-10 rounded-2xl app-card transform hover:scale-105 transition-all duration-300">
                <div className="relative mb-6">
                  <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-primary/30 shadow-lg animate-float-gentle">
                    <img
                      src="/mbongue.jpeg"
                      alt="Mbongue Lucas Shuukifeni"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-glow-pulse">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">Mbongue Lucas Shuukifeni</h3>
                <p className="text-base text-muted-foreground mb-3">
                  Language Teacher & Researcher
                </p>
                <p className="text-base text-muted-foreground/60 mt-2">
                  Ministry of Education
                </p>
              </div>

              <div className="text-center p-8 md:p-10 rounded-2xl app-card transform hover:scale-105 transition-all duration-300">
                <div className="relative mb-6">
                  <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-accent/30 shadow-lg animate-float-gentle">
                    <img
                      src="/MASAMBO.jpg"
                      alt="Johannes Masambo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center animate-glow-pulse">
                    <BookOpen className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">Johannes Masambo</h3>
                <p className="text-base text-muted-foreground mb-3">Software Developer</p>
                <p className="text-base text-muted-foreground/80">
                  AISOD
                </p>
              </div>

              <div className="text-center p-8 md:p-10 rounded-2xl app-card transform hover:scale-105 transition-all duration-300">
                <div className="relative mb-6">
                  <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-success/30 shadow-lg animate-float-gentle">
                    <img
                      src="/JOEL.jpg"
                      alt="Joel Tiago"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-success to-warning rounded-full flex items-center justify-center animate-glow-pulse">
                    <Gamepad2 className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">Joel Tiago</h3>
                <p className="text-base text-muted-foreground mb-3">Technologist & CEO</p>
                <p className="text-base text-muted-foreground/80">
                  AISOD
                </p>
              </div>

              <div className="text-center p-8 md:p-10 rounded-2xl app-card transform hover:scale-105 transition-all duration-300">
                <div className="relative mb-6">
                  <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-warning/30 shadow-lg animate-float-gentle">
                    <img
                      src="/Edna.avif"
                      alt="Edna Silva"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-warning to-destructive rounded-full flex items-center justify-center animate-glow-pulse">
                    <Zap className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">Edna Silva</h3>
                <p className="text-base text-muted-foreground mb-3">Software Developer</p>
                <p className="text-base text-muted-foreground/80">
                  AISOD
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <Logo size="sm" className="justify-center mb-4" />
          <p className="text-base md:text-lg text-muted-foreground mb-4">
            Preserving and sharing the beauty of Namibian languages through interactive learning.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-sm md:text-base text-muted-foreground/60">Powered by</span>
            <a 
              href="https://www.aisod.tech/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block hover:opacity-80 transition-opacity"
            >
              <img 
                src="/AISOD_TECH.png" 
                alt="AISOD" 
                className="h-7 md:h-8 w-auto object-contain"
              />
            </a>
          </div>
          <p className="text-sm text-muted-foreground/50 mt-6">
            © 2026 NAMQULA. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button
        className="fab animate-glow-pulse"
        onClick={() => {
          const languagesSection = document.getElementById('languages-section');
          if (languagesSection) {
            languagesSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        aria-label="Quick play"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H15m2 0h1.586a1 1 0 01.707.293l.707.707A1 1 0 0021 12.414V15m0 2a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h3.586a1 1 0 01.707.293l.707.707A1 1 0 009.414 7H15" />
        </svg>
      </button>
    </div>
  );
}
