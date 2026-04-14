import { useState } from "react";
import { Switch, Route } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { ChatBot } from "@/components/ChatBot";
import { StarField } from "@/components/StarField";
import Dashboard from "./Dashboard";
import Roadmap from "./Roadmap";
import Courses from "./Courses";
import CourseDetail from "./CourseDetail";
import Progress from "./Progress";
import Certificates from "./Certificates";
import Library from "./Library";
import MockTest from "./MockTest";
import MockInterview from "./MockInterview";
import ResumeBuilder from "./ResumeBuilder";
import Skills from "./Skills";
import SkillLevels from "./SkillLevels";
import SkillPhases from "./SkillPhases";
import PhaseContent from "./PhaseContent";
import PhaseQuizPage from "./PhaseQuizPage";
import LevelQuizPage from "./LevelQuizPage";
import FinalSkillQuizPage from "./FinalSkillQuizPage";
import SkillProject from "./SkillProject";

export default function AppLayout() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d0b1e 0%, #151030 50%, #0d0b1e 100%)",
        display: "flex",
        position: "relative",
      }}
    >
      <StarField />

      <div style={{ position: "relative", zIndex: 5, display: "flex", width: "100%" }}>
        <Sidebar onChatOpen={() => setChatOpen(!chatOpen)} />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: "100vh",
            maxHeight: "100vh",
          }}
        >
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/roadmap" component={Roadmap} />
            <Route path="/courses/:courseId" component={CourseDetail} />
            <Route path="/courses" component={Courses} />
            <Route path="/progress" component={Progress} />
            <Route path="/certificates" component={Certificates} />
            <Route path="/library" component={Library} />
            <Route path="/mock-test" component={MockTest} />
            <Route path="/mock-interview" component={MockInterview} />
            <Route path="/resume" component={ResumeBuilder} />
            <Route path="/resume-builder" component={ResumeBuilder} />
            <Route path="/skills/:skillId/skill-final" component={FinalSkillQuizPage} />
            <Route path="/skills/:skillId/project" component={SkillProject} />
            <Route path="/skills/:skillId/:levelId/level-test" component={LevelQuizPage} />
            <Route path="/skills/:skillId/:levelId/:phaseId/test" component={PhaseQuizPage} />
            <Route path="/skills/:skillId/:levelId/:phaseId" component={PhaseContent} />
            <Route path="/skills/:skillId/:levelId" component={SkillPhases} />
            <Route path="/skills/:skillId" component={SkillLevels} />
            <Route path="/skills" component={Skills} />
          </Switch>
        </main>
      </div>

      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
