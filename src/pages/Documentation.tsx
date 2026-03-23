import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Book, ChevronRight, Menu, X, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { docSections } from "./docs/sections";

const Documentation: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pendingSubsectionRef = useRef<string | null>(null);

  const currentSection =
    docSections.find((section) => section.id === sectionId) ?? docSections[0];
  const activeSection = currentSection.id;

  useEffect(() => {
    const pendingSubsection = pendingSubsectionRef.current;
    pendingSubsectionRef.current = null;

    if (pendingSubsection) {
      const element = document.getElementById(pendingSubsection);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    setIsSidebarOpen(false);

    if (activeSection === id) {
      window.scrollTo(0, 0);
      return;
    }

    navigate(`/docs/${id}`);
  };

  const scrollToSubsection = (
    targetSectionId: string,
    subsectionId: string,
  ) => {
    setIsSidebarOpen(false);

    if (activeSection !== targetSectionId) {
      pendingSubsectionRef.current = subsectionId;
      navigate(`/docs/${targetSectionId}`);
      return;
    }

    const element = document.getElementById(subsectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#020202]">
      <button
        onClick={() => setIsSidebarOpen((open) => !open)}
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-purple-600 text-white shadow-2xl"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="container flex items-start gap-12 py-12 relative">
        <aside
          className={`
            fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:bg-transparent md:backdrop-blur-none
            md:sticky md:top-24 md:block md:w-72 md:shrink-0
            md:h-[calc(100vh-6rem)] md:overflow-y-auto custom-scrollbar
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="p-8 md:p-0 md:pb-24">
            <div
              className="flex items-center gap-3 mb-10 px-2 cursor-pointer md:cursor-default"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Book className="text-purple-500" />
              <span className="text-xl font-black uppercase tracking-[0.2em]">
                Docs
              </span>
            </div>

            <nav className="space-y-8">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4 px-2">
                  Content
                </p>
                <div className="space-y-1">
                  {docSections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          activeSection === section.id
                            ? "bg-purple-500/10 text-white font-bold border border-purple-500/20 shadow-lg shadow-purple-500/5"
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <section.icon
                            size={18}
                            className={
                              activeSection === section.id
                                ? "text-purple-500"
                                : "text-gray-500"
                            }
                          />
                          <span>{section.title}</span>
                        </div>
                        {activeSection === section.id ? (
                          <motion.div
                            layoutId="active-indicator"
                            className="w-1 h-4 bg-purple-500 rounded-full"
                          />
                        ) : null}
                      </button>

                      <AnimatePresence>
                        {activeSection === section.id && section.subsections ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-9 mt-1 flex flex-col gap-1 overflow-hidden border-l border-white/5 py-1"
                          >
                            {section.subsections.map((subsection) => (
                              <button
                                key={subsection.id}
                                onClick={() =>
                                  scrollToSubsection(section.id, subsection.id)
                                }
                                className="w-full text-left px-3 py-1.5 text-[11px] text-gray-500 hover:text-purple-400 transition-colors hover:bg-white/5 rounded-lg"
                              >
                                {subsection.title}
                              </button>
                            ))}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </aside>

        <main
          className={`flex-grow max-w-4xl pt-4 transition-all duration-300 ${
            isSidebarOpen ? "blur-sm md:blur-none" : ""
          }`}
        >
          <motion.div
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentSection.content}

            <div className="mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-sm">
              <div className="text-gray-500 font-mono flex items-center gap-2">
                <Zap size={14} className="text-purple-500" />
                TejX Documentation
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-gray-400 hover:text-white flex items-center gap-2 group"
              >
                Back to Top
                <ChevronRight
                  size={14}
                  className="-rotate-90 text-purple-500 group-hover:-translate-y-1 transition-transform"
                />
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Documentation;
