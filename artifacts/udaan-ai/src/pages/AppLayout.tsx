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

export default function AppLayout() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #050511 0%, #0d0d2b 50%, #0a0520 100%)",
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
          </Switch>
        </main>
      </div>

      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
