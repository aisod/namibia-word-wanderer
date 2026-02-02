import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminGuard } from "@/components/AdminGuard";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { DEFAULT_CATEGORIES } from "@/lib/defaultCategories";
import {
  ArrowLeft,
  Plus,
  Globe,
  BookOpen,
  Database,
  LogOut,
  Loader2,
  Trash2,
  Filter,
  Search,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CATEGORY_MAP = Object.fromEntries(DEFAULT_CATEGORIES.map((c) => [c.slug, c]));

function getDifficultyColor(d: string) {
  switch (d) {
    case "easy": return "bg-success/20 text-success border-success/30";
    case "medium": return "bg-warning/20 text-warning border-warning/30";
    case "hard": return "bg-destructive/20 text-destructive border-destructive/30";
    default: return "bg-muted text-muted-foreground";
  }
}

function AdminContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile, signOut, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"vocabulary" | "languages">("vocabulary");
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [newWord, setNewWord] = useState({
    english: "",
    native_word: "",
    category: "greetings",
    difficulty: "easy" as "easy" | "medium" | "hard",
  });

  const [newLanguage, setNewLanguage] = useState({
    name: "",
    native_name: "",
    slug: "",
    speakers: "",
    regions: "",
    description: "",
    history: "",
  });

  // Fetch languages
  const { data: languages = [], isLoading: loadingLangs } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const selectedLang = languages.find((l: { id: string }) => l.id === selectedLanguageId) ?? languages[0];

  useEffect(() => {
    if (!selectedLanguageId && languages.length > 0) {
      setSelectedLanguageId(languages[0].id);
    }
  }, [languages, selectedLanguageId]);

  // Fetch vocabulary for selected language
  const { data: vocabulary = [], isLoading: loadingVocab } = useQuery({
    queryKey: ["vocabulary", selectedLanguageId],
    queryFn: async () => {
      if (!selectedLanguageId) return [];
      const { data, error } = await supabase
        .from("vocabulary")
        .select("*")
        .eq("language_id", selectedLanguageId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!selectedLanguageId,
  });

  // Derived data: vocabulary grouped by category with counts
  const vocabByCategory = useMemo(() => {
    const map: Record<string, { count: number; words: typeof vocabulary }> = {};
    for (const cat of DEFAULT_CATEGORIES) {
      map[cat.slug] = { count: 0, words: [] };
    }
    for (const v of vocabulary) {
      const slug = v.category;
      if (!map[slug]) map[slug] = { count: 0, words: [] };
      map[slug].count++;
      map[slug].words.push(v);
    }
    return map;
  }, [vocabulary]);

  const filteredVocabulary = useMemo(() => {
    let list = vocabulary;
    if (categoryFilter !== "all") list = list.filter((v) => v.category === categoryFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (v) =>
          v.english.toLowerCase().includes(q) || v.native_word.toLowerCase().includes(q)
      );
    }
    return list;
  }, [vocabulary, categoryFilter, searchQuery]);

  const addLanguageMutation = useMutation({
    mutationFn: async (lang: typeof newLanguage) => {
      const slug = lang.slug || lang.name.toLowerCase().replace(/\s+/g, "-");
      const regions = lang.regions
        ? lang.regions.split(",").map((r) => r.trim()).filter(Boolean)
        : [];
      const { data: langData, error: langError } = await supabase
        .from("languages")
        .insert({
          name: lang.name,
          native_name: lang.native_name || lang.name,
          slug,
          speakers: lang.speakers || null,
          regions,
          description: lang.description || null,
          history: lang.history || null,
          is_available: true,
        })
        .select("id")
        .single();
      if (langError) throw langError;
      for (const cat of DEFAULT_CATEGORIES) {
        await supabase.from("categories").insert({
          language_id: langData.id,
          slug: cat.slug,
          name: cat.name,
          icon: cat.icon,
          sort_order: cat.sort_order,
        });
      }
      return langData.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["languages"] });
      toast({ title: "Language added", description: "Default categories created." });
      setNewLanguage({ name: "", native_name: "", slug: "", speakers: "", regions: "", description: "", history: "" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const addVocabularyMutation = useMutation({
    mutationFn: async (word: typeof newWord) => {
      if (!selectedLanguageId) throw new Error("Select a language first");
      const { error } = await supabase.from("vocabulary").insert({
        language_id: selectedLanguageId,
        english: word.english,
        native_word: word.native_word,
        category: word.category,
        difficulty: word.difficulty,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary", selectedLanguageId] });
      toast({ title: "Word added" });
      setNewWord({ english: "", native_word: "", category: "greetings", difficulty: "easy" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteVocabularyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vocabulary").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary", selectedLanguageId] });
      toast({ title: "Word removed" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const handleAddWord = () => {
    if (!newWord.english || !newWord.native_word) {
      toast({ title: "Missing fields", description: "Enter English and translation", variant: "destructive" });
      return;
    }
    if (!selectedLanguageId) {
      toast({ title: "Select language", description: "Choose a language first", variant: "destructive" });
      return;
    }
    addVocabularyMutation.mutate(newWord);
  };

  const handleAddLanguage = () => {
    if (!newLanguage.name) {
      toast({ title: "Missing fields", description: "Enter language name", variant: "destructive" });
      return;
    }
    addLanguageMutation.mutate(newLanguage);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen pattern-tribal">
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="lg" onClick={() => navigate("/")} className="min-h-[48px] min-w-[48px] p-2">
              <ArrowLeft className="w-6 h-6 md:w-7 md:h-7" />
            </Button>
            <Logo size="lg" />
            <Badge variant="outline">Admin</Badge>
            {profile && (
              <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
                {profile.role.replace("_", " ")}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl text-foreground mb-2">Knowledge Base Manager</h1>
            <p className="text-muted-foreground">
              Manage languages and vocabulary for the learning platform
            </p>
          </div>

          {/* Stats derived from data */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{vocabulary.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedLang ? `Words in ${selectedLang.name}` : "Total words"}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{languages.length}</p>
                  <p className="text-xs text-muted-foreground">Languages</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {Object.values(vocabByCategory).filter((c) => c.count > 0).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Categories in use</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Filter className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{DEFAULT_CATEGORIES.length}</p>
                  <p className="text-xs text-muted-foreground">Total categories</p>
                </div>
              </div>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="vocabulary" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Vocabulary
                {vocabulary.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{vocabulary.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="languages" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Languages
                {languages.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{languages.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vocabulary" className="space-y-6">
              <Card className="p-6 glass-card">
                <h2 className="font-display text-xl text-foreground mb-2">Add New Word</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Add vocabulary for {selectedLang?.name ?? "a language"}. Words appear in games and lessons.
                </p>
                <div className="mb-4">
                  <Label>Language</Label>
                  <Select value={selectedLanguageId ?? ""} onValueChange={setSelectedLanguageId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((l: { id: string; name: string; native_name?: string }) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}{l.native_name ? ` (${l.native_name})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedLanguageId && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="english">English *</Label>
                          <Input
                            id="english"
                            placeholder="e.g., Hello"
                            value={newWord.english}
                            onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="native">Translation *</Label>
                          <Input
                            id="native"
                            placeholder={`e.g., ${selectedLang?.native_name ? "Ongeipi" : "native word"}`}
                            value={newWord.native_word}
                            onChange={(e) => setNewWord({ ...newWord, native_word: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label>Category</Label>
                          <Select
                            value={newWord.category}
                            onValueChange={(v) => setNewWord({ ...newWord, category: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DEFAULT_CATEGORIES.map((c) => (
                                <SelectItem key={c.slug} value={c.slug}>
                                  {c.icon} {c.name}
                                  {vocabByCategory[c.slug]?.count > 0 && (
                                    <span className="ml-2 text-muted-foreground">({vocabByCategory[c.slug].count})</span>
                                  )}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Difficulty</Label>
                          <Select
                            value={newWord.difficulty}
                            onValueChange={(v: "easy" | "medium" | "hard") => setNewWord({ ...newWord, difficulty: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">🟢 Easy</SelectItem>
                              <SelectItem value="medium">🟡 Medium</SelectItem>
                              <SelectItem value="hard">🔴 Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="mt-6"
                      onClick={handleAddWord}
                      disabled={addVocabularyMutation.isPending}
                    >
                      {addVocabularyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      Add Word
                    </Button>
                  </>
                )}
                {!selectedLanguageId && languages.length === 0 && (
                  <p className="text-muted-foreground text-sm mt-4">Add a language first in the Languages tab.</p>
                )}
              </Card>

              {/* Vocabulary browser - data interpreted by category */}
              {selectedLanguageId && (
                <Card className="p-6 glass-card">
                  <h2 className="font-display text-xl text-foreground mb-2">Vocabulary Browser</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedLang?.name} · {vocabulary.length} words across {Object.values(vocabByCategory).filter((c) => c.count > 0).length} categories
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search English or translation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {DEFAULT_CATEGORIES.map((c) => (
                          <SelectItem key={c.slug} value={c.slug}>
                            {c.icon} {c.name} ({vocabByCategory[c.slug]?.count ?? 0})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg border overflow-hidden">
                    <div className="max-h-[400px] overflow-y-auto">
                      {filteredVocabulary.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          {searchQuery || categoryFilter !== "all"
                            ? "No words match your filters."
                            : "No vocabulary yet. Add words above."}
                        </div>
                      ) : (
                        <div className="divide-y">
                          {filteredVocabulary.map((v: { id: string; english: string; native_word: string; category: string; difficulty: string }) => {
                            const cat = CATEGORY_MAP[v.category];
                            return (
                              <div
                                key={v.id}
                                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50"
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <span className="text-lg flex-shrink-0" title={cat?.name}>
                                    {cat?.icon ?? "📚"}
                                  </span>
                                  <div className="min-w-0">
                                    <span className="font-medium text-foreground">{v.english}</span>
                                    <span className="text-muted-foreground mx-2">→</span>
                                    <span className="text-foreground">{v.native_word}</span>
                                  </div>
                                  <Badge variant="outline" className="flex-shrink-0 hidden sm:inline">
                                    {cat?.name ?? v.category}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`flex-shrink-0 text-xs ${getDifficultyColor(v.difficulty)}`}
                                  >
                                    {v.difficulty}
                                  </Badge>
                                </div>
                                {isAdmin && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="flex-shrink-0"
                                    onClick={() => deleteVocabularyMutation.mutate(v.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Category breakdown summary */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Words per category</p>
                    <div className="flex flex-wrap gap-2">
                      {DEFAULT_CATEGORIES.filter((c) => (vocabByCategory[c.slug]?.count ?? 0) > 0).map((c) => (
                        <Badge key={c.slug} variant="secondary" className="text-xs">
                          {c.icon} {c.name}: {vocabByCategory[c.slug].count}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="languages" className="space-y-6">
              <Card className="p-6 glass-card">
                <h2 className="font-display text-xl text-foreground mb-2">Add New Language</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Add a Namibian language. Default categories (Greetings, Verbs, Numbers, etc.) will be created.
                </p>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="langName">Name *</Label>
                      <Input
                        id="langName"
                        placeholder="e.g., Otjiherero"
                        value={newLanguage.name}
                        onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Input
                        id="slug"
                        placeholder="e.g., otjiherero"
                        value={newLanguage.slug}
                        onChange={(e) => setNewLanguage({ ...newLanguage, slug: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nativeName">Native Name</Label>
                      <Input
                        id="nativeName"
                        placeholder="e.g., Otjiherero"
                        value={newLanguage.native_name}
                        onChange={(e) => setNewLanguage({ ...newLanguage, native_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="speakers">Speakers</Label>
                      <Input
                        id="speakers"
                        placeholder="e.g., 250,000+"
                        value={newLanguage.speakers}
                        onChange={(e) => setNewLanguage({ ...newLanguage, speakers: e.target.value })}
                      />
                    </div>
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
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the language..."
                      rows={4}
                      value={newLanguage.description}
                      onChange={(e) => setNewLanguage({ ...newLanguage, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="history">History</Label>
                    <Textarea
                      id="history"
                      placeholder="Brief history..."
                      rows={3}
                      value={newLanguage.history}
                      onChange={(e) => setNewLanguage({ ...newLanguage, history: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddLanguage} disabled={addLanguageMutation.isPending}>
                    {addLanguageMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
                    Add Language
                  </Button>
                </div>
              </Card>

              {/* Languages list */}
              {languages.length > 0 && (
                <Card className="p-6 glass-card">
                  <h2 className="font-display text-xl text-foreground mb-4">Languages</h2>
                  <div className="space-y-3">
                    {languages.map((l: { id: string; name: string; native_name?: string; slug: string; is_available?: boolean }) => (
                      <div
                        key={l.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          selectedLanguageId === l.id ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-foreground">{l.name}</p>
                          {l.native_name && (
                            <p className="text-sm text-muted-foreground">{l.native_name}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">/{l.slug}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={l.is_available ? "default" : "secondary"}>
                            {l.is_available ? "Live" : "Coming soon"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedLanguageId(l.id);
                              setActiveTab("vocabulary");
                            }}
                          >
                            Manage words
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}
