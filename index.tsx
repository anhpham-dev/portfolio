import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Code, Music, Clapperboard, Monitor, 
  Github, Facebook, Instagram, Mail, 
  ExternalLink, Play, Pause, ChevronRight, 
  Sparkles, Terminal,
  Cpu, Disc, Video, ArrowDown, Mic, Layers, Smartphone
} from 'lucide-react';

// --- Types ---
type Category = 'all' | 'dev' | 'audio' | 'video';

interface Project {
  id: number;
  title: string;
  category: Exclude<Category, 'all'>;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

// --- Data ---
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Neon E-Commerce",
    category: "dev",
    description: "A full-stack Next.js e-commerce platform with real-time inventory and 3D product previews using Three.js.",
    image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=800",
    tags: ["Next.js", "TypeScript", "Three.js", "Stripe"],
    link: "#"
  },
  {
    id: 2,
    title: "Midnight Lo-Fi Pack",
    category: "audio",
    description: "A collection of 50+ royalty-free beats and samples. Smooth jazz chords mixed with dusty hip-hop drums.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800",
    tags: ["Ableton Live", "Lofi", "Sample Pack"],
    link: "#"
  },
  {
    id: 3,
    title: "Cyberpunk City Montage",
    category: "video",
    description: "A high-energy visual edit synced perfectly to a custom synthwave track. Color graded in DaVinci Resolve.",
    image: "https://images.unsplash.com/photo-1535016120720-40c6874c3b13?auto=format&fit=crop&q=80&w=800",
    tags: ["Premiere Pro", "After Effects", "Color Grading"],
    link: "#"
  },
  {
    id: 4,
    title: "AI Task Manager",
    category: "dev",
    description: "Smart task management app that uses Gemini API to prioritize your daily workflow automatically.",
    image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800",
    tags: ["React", "Python", "Gemini API"],
    link: "#"
  },
  {
    id: 5,
    title: "Synthwave Journey",
    category: "audio",
    description: "Full length album exploring retro-futuristic sounds. Mixed and mastered for streaming services.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
    tags: ["Synthesis", "Mixing", "Mastering"],
    link: "#"
  },
  {
    id: 6,
    title: "Tech Review Vlog",
    category: "video",
    description: "Cinematic tech reviews focusing on developer hardware. 4K editing with custom motion graphics.",
    image: "https://images.unsplash.com/photo-1526657772486-45a94af2e70e?auto=format&fit=crop&q=80&w=800",
    tags: ["Videography", "Sound Design", "YouTube"],
    link: "#"
  }
];

// --- Custom Hooks & Utils ---

// Hook for scroll animation triggering
const useOnScreen = (ref: React.RefObject<Element | null>, rootMargin = "0px") => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); }
  }, [ref, rootMargin]);
  return isIntersecting;
};

// Hook for active section in navbar
const useActiveSection = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds]);
  return activeSection;
};

// --- Reusable Animated Components ---

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref, "-50px");

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Typewriter = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStartTyping(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!startTyping) return;
    let i = 0;
    const typing = setInterval(() => {
      setDisplayText(text.substring(0, i + 1));
      i++;
      if (i === text.length) clearInterval(typing);
    }, 50);
    return () => clearInterval(typing);
  }, [text, startTyping]);

  return <span className="font-mono">{displayText}<span className="animate-pulse text-primary">_</span></span>;
};

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (limit to 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

// --- Main Components ---

const Navbar = () => {
  const activeSection = useActiveSection(['home', 'projects', 'skills', 'contact']);

  const navLinks = [
    { name: 'Work', id: 'projects' },
    { name: 'Skills', id: 'skills' },
    { name: 'Contact', id: 'contact' },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div 
          onClick={() => scrollTo('home')}
          className="text-xl font-bold font-mono tracking-tighter flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <span className="text-white text-lg font-bold">A</span>
          </div>
          <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Anh Pham</span>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`relative transition-colors hover:text-white ${
                activeSection === link.id ? 'text-white' : 'text-gray-400'
              }`}
            >
              {link.name}
              {activeSection === link.id && (
                <span className="absolute -bottom-5 left-0 w-full h-0.5 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(99,102,241,0.5)]"></span>
              )}
            </button>
          ))}
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
            <Github size={20} />
          </a>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth - 0.5) * 20, 
        y: (e.clientY / window.innerHeight - 0.5) * 20 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-16">
      {/* Dynamic Background Elements */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"
        style={{ transform: `translate(${mousePos.x * -2}px, ${mousePos.y * 2}px)` }}
      ></div>
      <div 
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-1000"
        style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * -2}px)` }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] mix-blend-screen animate-blob"
      ></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <FadeIn delay={100}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-xs font-mono text-gray-300">Open for Freelance</span>
              </div>
            </FadeIn>
            
            <FadeIn delay={300}>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient bg-[length:200%_auto]">Digital Experiences</span>
              </h1>
            </FadeIn>

            <FadeIn delay={500}>
              <p className="text-xl text-gray-300 mb-8 max-w-lg leading-relaxed h-20">
                I am a <Typewriter text="Fullstack Developer, Beat Maker, & Video Editor." delay={1000} />
              </p>
            </FadeIn>

            <FadeIn delay={700}>
              <div className="flex flex-wrap gap-4">
                <a href="#projects" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  View Work <ChevronRight size={18} />
                </a>
              </div>
            </FadeIn>
          </div>
          
          <div className="relative hidden lg:block h-[500px]">
             {/* Abstract Visualization */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
                  {/* Floating Elements representing 3 disciplines with 3D feel */}
                  <div 
                    className="absolute top-10 left-10 p-6 card-gradient border border-primary/30 rounded-2xl backdrop-blur-xl animate-float shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                    style={{ transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <Code size={40} className="text-primary" />
                      <div className="flex gap-1">
                         <div className="w-2 h-2 rounded-full bg-red-500"></div>
                         <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="space-y-2 opacity-60">
                      <div className="h-2 w-32 bg-gray-400 rounded"></div>
                      <div className="h-2 w-24 bg-gray-400 rounded"></div>
                      <div className="h-2 w-28 bg-gray-400 rounded"></div>
                    </div>
                  </div>

                  <div 
                    className="absolute top-1/2 right-10 p-6 card-gradient border border-secondary/30 rounded-2xl backdrop-blur-xl animate-float shadow-[0_0_30px_rgba(236,72,153,0.2)]" 
                    style={{ animationDelay: '1s', transform: `translateZ(20px) rotateY(${mousePos.x * -0.5}deg)` }}
                  >
                    <Music size={40} className="text-secondary mb-4" />
                    <div className="flex gap-1 h-12 items-end justify-center w-32">
                      {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="w-2 bg-secondary/80 rounded-t animate-equalizer" style={{ animationDelay: `${i * 0.1}s` }}></div>
                      ))}
                    </div>
                  </div>

                  <div 
                    className="absolute bottom-20 left-1/3 p-6 card-gradient border border-accent/30 rounded-2xl backdrop-blur-xl animate-float shadow-[0_0_30px_rgba(6,182,212,0.2)]" 
                    style={{ animationDelay: '2s', transform: `translateZ(-10px) rotateX(${mousePos.y * -0.5}deg)` }}
                  >
                    <div className="relative">
                      <Clapperboard size={40} className="text-accent mb-2" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex gap-2 mt-2">
                       <div className="h-10 w-16 bg-white/10 rounded border border-white/10 flex items-center justify-center">
                         <Play size={12} className="text-gray-400"/>
                       </div>
                       <div className="h-10 w-16 bg-white/10 rounded border border-white/10"></div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gray-500 cursor-pointer hover:text-white transition-colors">
          <a href="#skills"><ArrowDown size={24} /></a>
        </div>
      </div>
    </section>
  );
}

const Skills = () => {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">My Arsenal</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Tools and technologies I use to bring ideas to life across different mediums.</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Dev */}
          <FadeIn delay={100} className="h-full">
            <TiltCard className="h-full p-8 rounded-2xl bg-surface border border-white/5 hover:border-primary/50 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary border border-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  <Terminal size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-primary transition-colors">Development</h3>
                <ul className="space-y-4 text-gray-400">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                    <span className="font-medium text-gray-300">React / Next.js / TS</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Node.js / Python / Go
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    PostgreSQL / MongoDB
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Tailwind CSS / Three.js
                  </li>
                </ul>
              </div>
            </TiltCard>
          </FadeIn>

          {/* Audio */}
          <FadeIn delay={200} className="h-full">
            <TiltCard className="h-full p-8 rounded-2xl bg-surface border border-white/5 hover:border-secondary/50 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-secondary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/20 transition-colors"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 text-secondary border border-secondary/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  <Disc size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-secondary transition-colors">Audio Production</h3>
                <ul className="space-y-4 text-gray-400">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
                    <span className="font-medium text-gray-300">Ableton Live 11 Suite</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Sound Design / Synthesis
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Mixing & Mastering
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Logic Pro X
                  </li>
                </ul>
              </div>
            </TiltCard>
          </FadeIn>

          {/* Video */}
          <FadeIn delay={300} className="h-full">
            <TiltCard className="h-full p-8 rounded-2xl bg-surface border border-white/5 hover:border-accent/50 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/20 transition-colors"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 text-accent border border-accent/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Video size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-accent transition-colors">Video Editing</h3>
                <ul className="space-y-4 text-gray-400">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                    <span className="font-medium text-gray-300">DaVinci Resolve</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    Adobe Premiere Pro
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    After Effects
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    Blender (3D)
                  </li>
                </ul>
              </div>
            </TiltCard>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

const Projects = () => {
  const [filter, setFilter] = useState<Category>('all');

  const filteredProjects = filter === 'all' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 relative">
       <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Selected Works</h2>
            <p className="text-gray-400">A curation of code, beats, and frames.</p>
          </FadeIn>
          
          <FadeIn delay={200}>
            <div className="flex p-1 bg-surface rounded-xl border border-white/10">
              {(['all', 'dev', 'audio', 'video'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filter === cat 
                      ? 'bg-white text-black shadow-lg scale-105' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <FadeIn key={project.id} delay={index * 100}>
              <div className="group relative rounded-xl overflow-hidden bg-surface border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                     <button className="p-4 bg-white rounded-full text-black hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-xl">
                        <ExternalLink size={24} />
                     </button>
                  </div>
                  <div className="absolute top-4 left-4 z-20">
                    {project.category === 'dev' && <div className="bg-primary/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-lg backdrop-blur-md"><Code size={12}/> Dev</div>}
                    {project.category === 'audio' && <div className="bg-secondary/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-lg backdrop-blur-md"><Music size={12}/> Audio</div>}
                    {project.category === 'video' && <div className="bg-accent/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-lg backdrop-blur-md"><Video size={12}/> Video</div>}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/5 group-hover:border-white/10 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

const Contact = () => {
  return (
    <footer id="contact" className="bg-black pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Footer background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <FadeIn>
            <h2 className="text-4xl font-bold mb-6">Let's Create Together</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Whether you need a full-stack app, a custom beat, or a promotional video, I'm ready to help you build your vision.
            </p>
            <div className="space-y-4">
              <a href="mailto:anh.pham.ngo.quoc@gmail.com" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Mail size={20} className="text-primary" />
                </div>
                 anh.pham.ngo.quoc@gmail.com
              </a>
              <div className="flex gap-4 pt-4">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white hover:scale-110 transition-all border border-white/5">
                  <Github size={22} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white hover:scale-110 transition-all border border-white/5">
                  <Facebook size={22} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white hover:scale-110 transition-all border border-white/5">
                  <Instagram size={22} />
                </a>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={200}>
            <form className="space-y-4 p-6 bg-surface/50 rounded-2xl border border-white/5 backdrop-blur-sm" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase font-semibold ml-1">Name</label>
                  <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase font-semibold ml-1">Email</label>
                  <input type="email" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase font-semibold ml-1">Service</label>
                <select className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                  <option>Web Development</option>
                  <option>Beat Production</option>
                  <option>Video Editing</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-1">
                 <label className="text-xs text-gray-500 uppercase font-semibold ml-1">Message</label>
                 <textarea rows={4} className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"></textarea>
              </div>
              <button className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white font-bold py-4 rounded-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all transform hover:-translate-y-1 active:scale-95">
                Send Message
              </button>
            </form>
          </FadeIn>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Anh Pham. All rights reserved.</p>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
             <span>Built with React</span>
             <Sparkles size={14} className="text-secondary" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-transparent text-gray-100 font-sans selection:bg-primary/30">
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Projects />
      </main>
      <Contact />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);