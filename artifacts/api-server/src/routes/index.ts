import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import studentsRouter from "./students";
import assessmentRouter from "./assessment";
import roadmapRouter from "./roadmap";
import coursesRouter from "./courses";
import progressRouter from "./progress";
import certificatesRouter from "./certificates";
import chatRouter from "./chat";
import mentorRouter from "./mentor";
import mockTestRouter from "./mock-test";
import mockInterviewRouter from "./mock-interview";
import resumeRouter from "./resume";
import growthRouter from "./growth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(studentsRouter);
router.use(assessmentRouter);
router.use(roadmapRouter);
router.use(coursesRouter);
router.use(progressRouter);
router.use(certificatesRouter);
router.use(chatRouter);
router.use(mentorRouter);
router.use(mockTestRouter);
router.use(mockInterviewRouter);
router.use(resumeRouter);
router.use(growthRouter);

export default router;
