import { Logo } from "@/components/ui/Logo";
import { LanguageCard } from "@/components/LanguageCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { AchievementBadge } from "@/components/AchievementBadge";
import { oshikwanyamaInfo } from "@/data/oshikwanyamaData";
import { useLanguages } from "@/hooks/useLanguages";
import { Globe, Sparkles, BookOpen, Gamepad2, Users, MapPin, ChevronRight, Users as UsersIcon, GraduationCap, Zap, Cpu, Megaphone } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const STATIC_LANGUAGES = [
  { slug: "oshikwanyama", name: "Oshikwanyama", nativeName: "Oshiwambo", speakers: oshikwanyamaInfo.speakers, regions: oshikwanyamaInfo.regions, coverImage: "/oshiwambo.png", isAvailable: true },
  { slug: "otjiherero", name: "Otjiherero", nativeName: "Otjiherero", speakers: "250,000+ speakers", regions: ["Kunene", "Omaheke", "Otjozondjupa"], coverImage: "/herero.jpg", isAvailable: false },
  { slug: "khoekhoegowab", name: "Khoekhoegowab", nativeName: "Damara/Nama", speakers: "200,000+ speakers", regions: ["Hardap", "Karas", "Erongo"], coverImage: "/khoikhoi.jpg", isAvailable: false },
];

export default function Index() {
  const navigate = useNavigate();
  const { data: dbLanguages = [], isLoading: loadingLangs } = useLanguages();
  const languages = dbLanguages.length > 0
    ? dbLanguages.map((l) => ({
        slug: l.slug,
        name: l.name,
        nativeName: l.nativeName,
        speakers: l.speakers,
        regions: l.regions,
        coverImage: l.coverImage ?? "/oshiwambo.png",
        isAvailable: l.isAvailable,
      }))
    : STATIC_LANGUAGES;

  return (
    <div className="min-h-screen pattern-tribal relative">
      <ParticleBackground particleCount={20} />
      {/* Hero Section */}
      <header className="relative overflow-hidden py-6 sm:py-8 md:py-12 lg:py-16">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/heroimage.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-glow-pulse" />
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent rounded-full animate-glow-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-success rounded-full animate-glow-pulse" style={{animationDelay: '2s'}} />
          </div>
        </div>
        
        <div className="relative z-10 px-4 sm:container sm:mx-auto">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
            <div className="flex-1"></div>
            <Logo size="xl" showText={false} clickable={true} />
            <div className="flex-1 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="min-h-[44px] px-3 sm:px-4 md:px-6 text-white hover:text-white hover:bg-white/10"
                onClick={() => navigate("/community")}
              >
                <UsersIcon className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">Join</span>
              </Button>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 sm:mb-12 md:mb-16">
              <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
                Learn Namibian Languages{" "}
                <span className="text-primary drop-shadow-md">Through Play</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-4 sm:mb-6 leading-relaxed drop-shadow-md px-2">
                NAMQULA is an interactive game-based learning platform designed to help English speakers 
                master key words and grammar in Namibian local languages.
              </p>

              <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto drop-shadow-sm px-2">
                Preserving and sharing the rich cultural heritage of Namibian languages for future generations.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center mt-6 sm:mt-8">
              <button
                className="cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-200 mb-3 group"
                onClick={() => {
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
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain group-hover:animate-float-gentle"
                  />
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-glow-pulse group-hover:bg-primary/40 transition-colors duration-300" />
                </div>
              </button>
              <p className="text-white text-sm sm:text-base md:text-lg font-medium drop-shadow-md">
                Play Now
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 mt-8 sm:mt-12 md:mt-16">
            {[
              { icon: Globe, label: "Languages", value: "1+", progress: 1, max: 3 },
              { icon: BookOpen, label: "Words", value: "100+", progress: 100, max: 500 },
              { icon: Gamepad2, label: "Games", value: "4", progress: 4, max: 8 },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 sm:gap-3 text-white/90 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 min-w-[100px] sm:min-w-[120px]">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white flex-shrink-0" />
                <span className="font-display text-xl sm:text-2xl md:text-3xl text-white">{stat.value}</span>
                <span className="text-xs sm:text-sm md:text-base text-white/90 text-center">{stat.label}</span>
                <ProgressIndicator current={stat.progress!} total={stat.max!} size="sm" showNumbers={false} />
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="mt-6 sm:mt-8 md:mt-12">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <AchievementBadge title="First Steps" description="Started learning Oshikwanyama" icon="star" earned={true} />
              <AchievementBadge title="Word Master" description="Found 50 words in word search" icon="target" earned={false} />
              <AchievementBadge title="Game Champion" description="Completed all games" icon="trophy" earned={false} />
            </div>
          </div>
        </div>
      </header>

      {/* Languages Section */}
      <section id="languages-section" className="py-8 sm:py-12 md:py-20 lg:py-24">
        <div className="px-4 sm:container sm:mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 sm:mb-4">
              Choose Your Language
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto px-2">
              Select a language to learn. Each language comes with its unique history, 
              vocabulary, and interactive games.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto">
            {languages.map((lang) => (
              <LanguageCard
                key={lang.slug}
                name={lang.name}
                nativeName={lang.nativeName}
                speakers={lang.speakers}
                regions={lang.regions}
                coverImage={lang.coverImage}
                onClick={() => lang.isAvailable ? navigate(`/language/${lang.slug}`) : undefined}
                isAvailable={lang.isAvailable}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 sm:py-12 md:py-20 lg:py-24 bg-gradient-to-b from-secondary/30 to-transparent">
        <div className="px-4 sm:container sm:mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 sm:mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 md:gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Pick a Language", description: "Choose from our growing collection of Namibian languages to learn.", image: "/pickyourlanguage.jpg" },
              { step: "02", title: "Learn the Basics", description: "Discover the history and key facts about your chosen language.", image: "/learnthebasics.jpg" },
              { step: "03", title: "Play & Learn", description: "Master vocabulary through fun, interactive games and quizzes.", image: "/playandlearn.jpg" },
            ].map((item, index) => (
              <div 
                key={item.step} 
                className={`text-center animate-slide-up stagger-${index + 1}`}
                style={{ opacity: 0 }}
              >
                <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto mb-4 sm:mb-6 rounded-2xl overflow-hidden shadow-glow border-2 border-border/50">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-display text-lg sm:text-xl md:text-2xl text-foreground mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2 sm:px-4">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 sm:py-12 md:py-20 lg:py-24 bg-gradient-to-b from-transparent to-secondary/30">
        <div className="px-4 sm:container sm:mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 sm:mb-4">
              Bringing This Project to Life
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto px-2">
              Meet the dedicated individuals making NAMQULA possible
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
              {[
                { name: "Mbongue Lucas Shuukifeni", role: "Language Teacher & Researcher", org: "Ministry of Education", img: "/mbongue.jpeg", icon: Sparkles, colors: "from-primary to-accent", border: "border-primary/30" },
                { name: "Johannes Masambo", role: "Software Developer", org: "AISOD", img: "/MASAMBO.jpg", icon: BookOpen, colors: "from-accent to-primary", border: "border-accent/30" },
                { name: "Joel Tiago", role: "Technologist & CEO", org: "AISOD", img: "/JOEL.jpg", icon: Gamepad2, colors: "from-success to-warning", border: "border-success/30" },
                { name: "Edna Silva", role: "Software Developer", org: "AISOD", img: "/Edna.avif", icon: Zap, colors: "from-warning to-destructive", border: "border-warning/30" },
                { name: "Sarafina Frans", role: "Teacher (ICT, English and Oshikwanyama)", org: "Ministry of Education", img: "/sarafina_frans.jpeg", icon: GraduationCap, colors: "from-primary to-accent", border: "border-primary/30" },
                { name: "Maria Mathews", role: "LRLM AI Training and Development", org: "NEDBANK", img: "/Maria_methews.jpeg", icon: Cpu, colors: "from-accent to-primary", border: "border-accent/30" },
                { name: "Hope", role: "Marketing and Communication", org: "AISOD", img: "/HOPE.jpeg", icon: Megaphone, colors: "from-success to-warning", border: "border-success/30" },
              ].map((member) => (
                <div key={member.name} className="text-center p-4 sm:p-6 md:p-8 rounded-2xl app-card transform hover:scale-105 transition-all duration-300">
                  <div className="relative mb-3 sm:mb-6">
                    <div className={`w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto rounded-full overflow-hidden border-4 ${member.border} shadow-lg animate-float-gentle`}>
                      <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br ${member.colors} rounded-full flex items-center justify-center animate-glow-pulse`}>
                      <member.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="font-display text-sm sm:text-lg md:text-xl lg:text-2xl text-foreground mb-1 sm:mb-3">{member.name}</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-1 sm:mb-3">{member.role}</p>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground/60">{member.org}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-border/50">
        <div className="px-4 sm:container sm:mx-auto text-center">
          <Logo size="sm" className="justify-center mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-3 sm:mb-4 px-2">
            Preserving and sharing the beauty of Namibian languages through interactive learning.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
            <span className="text-xs sm:text-sm md:text-base text-muted-foreground/60">Powered by</span>
            <a href="https://www.aisod.tech/" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition-opacity">
              <img src="/AISOD_TECH.png" alt="AISOD" className="h-6 sm:h-7 md:h-8 w-auto object-contain" />
            </a>
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 sm:mt-4">
            <Link to="/admin" className="text-xs sm:text-sm text-muted-foreground/60 hover:text-muted-foreground">Admin</Link>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground/50 mt-4 sm:mt-6">© 2026 NAMQULA. All rights reserved.</p>
        </div>
      </footer>

      {/* FAB */}
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
