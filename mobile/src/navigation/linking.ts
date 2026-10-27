import { getStateFromPath } from "@react-navigation/native";
import { allowsAudience, roleHome, routeAudience } from "@/lms/access";
import type { LinkingOptions } from "@react-navigation/native";

import type { RootStackParamList } from "./types";

/**
 * Deep-link map for the five assigned pages.
 *
 * React Navigation appends unrecognised query parameters to `route.params`,
 * so `thinkzai://learner/courses/course-1?moduleId=mod-1-0` arrives at
 * `CourseDetail` as `{ courseId: 'course-1', moduleId: 'mod-1-0' }`.
 *
 * Examples:
 *   thinkzai://learner/dashboard
 *   thinkzai://learner/courses
 *   thinkzai://learner/courses/course-1?moduleId=mod-1-0
 *   thinkzai://search
 *   thinkzai://forum?categoryId=cat-1
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["thinkzai://", "https://app.thinkzai.com"],
  config: {
    screens: {
      SignIn: "auth/login",
      AdminHome: "admin",
      Account: "account",
      LmsHome: "learner/workspace",
      CoursePlayer: {
        path: "learner/courses/:courseId/play",
        parse: { courseId: Number, lessonId: Number },
      },
      AssessmentTaking: {
        path: "learner/assessments/:assessmentId/take",
        parse: { assessmentId: Number, enrollmentId: Number },
      },
      AssessmentResults: {
        path: "learner/assessments/:assessmentId/results",
        parse: { assessmentId: Number, attemptId: Number },
      },
      Certificate: {
        path: "learner/certificates/:certificateId",
        parse: { certificateId: Number },
      },
      Analytics: "admin/analytics",
      CodePlayground: "learner/playground",
      PlaygroundHistory: "learner/playground/history",
      LearnerProfile: "learner/profile",
      LmsSettings: "learner/settings",
      Downloads: "learner/downloads",
      LearnerDashboard: "learner/dashboard",
      MyCourses: "learner/courses",
      CourseDetail: "learner/courses/:courseId",
      GlobalSearch: "search",
      ForumHome: "forum",
      // Pages 6–10 mirror the web routes.
      ForumThread: "forum/threads/:threadId",
      CreatePost: "forum/new",
      Bookmarks: "forum/bookmarks",
      Moderation: "forum/moderate",
      Checkout: "checkout",
    },
  },
};

export function linkingForRole(
  role: string | null,
  signedIn: boolean,
): LinkingOptions<RootStackParamList> {
  return {
    ...linking,
    getStateFromPath(path, options) {
      const state = getStateFromPath(path, options);
      if (!state) return state;
      const current = state.routes[state.index ?? state.routes.length - 1];
      const name = current?.name as keyof RootStackParamList | undefined;
      if (name === "SignIn")
        return signedIn ? { routes: [{ name: roleHome(role) }] } : state;
      const audience = name ? routeAudience[name] : undefined;
      if (!signedIn || !audience || !allowsAudience(audience, role))
        return { routes: [{ name: signedIn ? roleHome(role) : "SignIn" }] };
      return state;
    },
  };
}
