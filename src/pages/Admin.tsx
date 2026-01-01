import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/ui/Logo";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, allVocabulary } from "@/data/oshikwanyamaData";
import { ArrowLeft, Plus, Globe, BookOpen, Database, Upload, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"vocabulary" | "languages">("vocabulary");
  
  // Vocabulary form state
  const [newWord, setNewWord] = useState({
    english: "",
    oshikwanyama: "",
    category: "",
    difficulty: "easy",
  });

  // Language form state
  const [newLanguage, setNewLanguage] = useState({
    name: "",
    nativeName: "",
    speakers: "",
    regions: "",
    description: "",
  });

  const handleAddWord = () => {
    if (!newWord.english || !newWord.oshikwanyama || !newWord.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would save to a database
    toast({
      title: "Word Added!",
      description: `"${newWord.english}" → "${newWord.oshikwanyama}" has been added to the knowledge base.`,
    });

    setNewWord({
      english: "",
      oshikwanyama: "",
      category: "",
      difficulty: "easy",
    });
  };

  const handleAddLanguage = () => {
    if (!newLanguage.name || !newLanguage.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Language Added!",
      description: `${newLanguage.name} has been added. You can now add vocabulary for this language.`,
    });

    setNewLanguage({
      name: "",
      nativeName: "",
      speakers: "",
      regions: "",
      description: "",
    });
  };

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
            <Badge variant="outline" className="ml-2">Admin Panel</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl text-foreground mb-2">
              Knowledge Base Manager
            </h1>
            <p className="text-muted-foreground">
              Add new languages and vocabulary to the learning platform
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <Database className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-foreground">{allVocabulary.length}</p>
              <p className="text-sm text-muted-foreground">Total Words</p>
            </Card>
            <Card className="p-4 text-center">
              <Globe className="w-6 h-6 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-sm text-muted-foreground">Languages</p>
            </Card>
            <Card className="p-4 text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold text-foreground">{categories.length}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </Card>
            <Card className="p-4 text-center">
              <Check className="w-6 h-6 mx-auto mb-2 text-warning" />
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Game Types</p>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "vocabulary" ? "default" : "outline"}
              onClick={() => setActiveTab("vocabulary")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Vocabulary
            </Button>
            <Button
              variant={activeTab === "languages" ? "default" : "outline"}
              onClick={() => setActiveTab("languages")}
            >
              <Globe className="w-4 h-4 mr-2" />
              Add Language
            </Button>
          </div>

          {/* Vocabulary Form */}
          {activeTab === "vocabulary" && (
            <Card className="p-6 glass-card">
              <h2 className="font-display text-xl text-foreground mb-6">
                Add New Vocabulary Word
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="english">English Word *</Label>
                    <Input
                      id="english"
                      placeholder="e.g., Hello"
                      value={newWord.english}
                      onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="oshikwanyama">Oshikwanyama Translation *</Label>
                    <Input
                      id="oshikwanyama"
                      placeholder="e.g., Ongeipi"
                      value={newWord.oshikwanyama}
                      onChange={(e) => setNewWord({ ...newWord, oshikwanyama: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={newWord.category}
                      onValueChange={(value) => setNewWord({ ...newWord, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select 
                      value={newWord.difficulty}
                      onValueChange={(value) => setNewWord({ ...newWord, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button className="mt-6" onClick={handleAddWord}>
                <Plus className="w-4 h-4 mr-2" />
                Add Word to Knowledge Base
              </Button>
            </Card>
          )}

          {/* Language Form */}
          {activeTab === "languages" && (
            <Card className="p-6 glass-card">
              <h2 className="font-display text-xl text-foreground mb-6">
                Add New Language
              </h2>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="langName">Language Name *</Label>
                    <Input
                      id="langName"
                      placeholder="e.g., Otjiherero"
                      value={newLanguage.name}
                      onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nativeName">Native Name</Label>
                    <Input
                      id="nativeName"
                      placeholder="e.g., Otjiherero"
                      value={newLanguage.nativeName}
                      onChange={(e) => setNewLanguage({ ...newLanguage, nativeName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="speakers">Number of Speakers</Label>
                    <Input
                      id="speakers"
                      placeholder="e.g., 250,000+ speakers"
                      value={newLanguage.speakers}
                      onChange={(e) => setNewLanguage({ ...newLanguage, speakers: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="regions">Regions (comma-separated)</Label>
                    <Input
                      id="regions"
                      placeholder="e.g., Kunene, Omaheke"
                      value={newLanguage.regions}
                      onChange={(e) => setNewLanguage({ ...newLanguage, regions: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the language, its history, and cultural significance..."
                    rows={4}
                    value={newLanguage.description}
                    onChange={(e) => setNewLanguage({ ...newLanguage, description: e.target.value })}
                  />
                </div>

                <Button onClick={handleAddLanguage}>
                  <Globe className="w-4 h-4 mr-2" />
                  Add Language
                </Button>
              </div>
            </Card>
          )}

          {/* Bulk Upload Note */}
          <Card className="mt-8 p-6 bg-secondary/20 border-dashed">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Bulk Upload Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Upload CSV or document files to add vocabulary in bulk. Connect Lovable Cloud to enable database persistence.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
