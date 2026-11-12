
import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, useNavigationContainerRef, DefaultTheme, DarkTheme } from "@react-navigation/native";

// import { ErrorBoundary } from '@/components/common';
import { ErrorBoundary } from "@/components/common";
import { useLms } from "@/hooks/useLms";
import { ApiClientProvider } from "@/hooks/useApiClient";
import { isOnboardingCompleted } from "@/features/onboarding/utils/onboardingStorage";
import type { RootStackParamList } from "@/navigation/types";
// import { withErrorBoundary } from "@/navigation/withErrorBoundary";
import { withErrorBoundary } from "@/navigation/withErrorBoundary";

// Screen Imports
import { CheckoutScreen } from "@/screens/checkout/CheckoutScreen";
import { CourseDetailScreen } from "@/screens/course/CourseDetailScreen";
import { BookmarksScreen } from "@/screens/forum/BookmarksScreen";
import { CreatePostScreen } from "@/screens/forum/CreatePostScreen";
import LoginScreen from "@/screens/onboarding/OnboardingFlowScreen";
import { ForumHomeScreen } from "@/screens/forum/ForumHomeScreen";
import { ForumThreadDetailScreen } from "@/screens/forum/ForumThreadDetailScreen";
import { ModerationScreen } from "@/screens/forum/ModerationScreen";
import { LearnerDashboardScreen } from "@/screens/learner/LearnerDashboardScreen";
import { MyCoursesScreen } from "@/screens/learner/MyCoursesScreen";
import { MyLearningScreen } from "@/screens/learner/MyLearningScreen";
const PaymentSuccessScreen = () => null;
const PaymentFailedScreen = () => null;
const NotificationPreferencesScreen = () => null;
import { GlobalSearchScreen } from "./screens/search/GlobalSearchScreen";
import { ProfileScreen } from "./screens/learner/ProfileScreen";
import { WishlistScreen } from "./screens/learner/WishlistScreen";
// import { GlobalSearchScreen } from "./screens/search/GlobalSearchScreen";
// import { NotificationPreferencesScreen } from "./features/payments/screens/NotificationPreferencesScreen";
// import { PaymentFailedScreen } from "./features/payments/screens/PaymentFailedScreen";
// import { PaymentSuccessScreen } from "./features/payments/screens/PaymentSuccessScreen";
import { AssessmentScreen } from "./screens/learning/AssessmentScreen";
import { CertificateScreen } from "./screens/learning/CertificateScreen";
import { OnboardingFlowScreen } from "./screens/onboarding/OnboardingFlowScreen";
import { ResultsScreen } from "./screens/learning/ResultsScreen";
import { VideoPlayerScreen } from "./screens/learning/VideoPlayerScreen";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";
import { signout } from "@/api/session";
import { AccessGate } from "@/lms/AccessGate";
import { isAdmin, type AccessAudience } from "@/lms/access";

// import { AdminHomeScreen } from "@/lms/screens/AdminHomeScreen";
// import { LmsSettingScreen } from "@/lms/screens/LmsSettingScreen";
// import { CompanyProfileScreen } from "@/lms/screens/CompanyProfileScreen";
// import { PlaygroundHistoryScreen } from "@/lms/screens/PlaygroundHistoryScreen";
// import { CodePlaygroundScreen } from "@/lms/screens/CodePlaygroundScreen";
// import { LmsSettingScreen } from "@/lms/screens/LmsSettingScreen";
// import { AdminHomeScreen } from "@/lms/screens/AdminHomeScreen";
// import { CompanyProfileScreen } from "@/lms/screens/CompanyProfileScreen";
// import { PlaygroundHistoryScreen } from "@/lms/screens/PlaygroundHistoryScreen";
// import { CodePlaygroundScreen } from "@/lms/screens/CodePlaygroundScreen";
// import { AdminHomeScreen } from "@/lms/screens/AdminHomeScreen";
// import { LmsSettingScreen } from "@/lms/screens/LmsSettingScreen";
 import { CompanyProfileScreen } from "@/lms/screens/CompanyProfileScreen";
 //import { PlaygroundHistoryScreen } from "@/screens/learner/PlaygroundHistoryScreen";
 //import { CodePlaygroundScreen } from "@/screens/learner/CodePlaygroundScreen";
// Comment out or delete the duplicate line 65 completely:
 import { AdminHomeScreen } from "@/lms/screens/AdminHomeScreen";
// import { CompanyProfileScreen } from "@/lms/screens/CompanyProfileScreen";
// import { PlaygroundHistoryScreen } from "@/lms/screens/PlaygroundHistoryScreen";
// import { CodePlaygroundScreen } from "@/lms/screens/CodePlaygroundScreen";


// import { AnalyticsScreen } from "@/lms/screens/AnalyticsScreen";
// import { AssessmentScreen as LmsAssessmentScreen } from "@/lms/screens/AssessmentScreen";
// import { ResultsScreen as LmsResultsScreen } from "@/lms/screens/ResultsScreen";
// import { CertificateScreen as LmsCertificateScreen } from "@/lms/screens/CertificateScreen";
// import { DownloadsScreen as LmsDownloadScreen } from "@/lms/screens/DownloadScreen";
import { AnalyticsScreen } from "@/lms/screens/AnalyticsScreen";
import { AssessmentTakingScreen } from "@/lms/screens/AssessmentTakingScreen";
import { ResultsScreen as LmsResultsScreen } from "@/lms/screens/ResultsScreen";
import { CertificateScreen as LmsCertificateScreen } from "@/lms/screens/CertificateScreen";
import { DownloadsScreen as DownloadScreen } from "@/lms/screens/DownloadsScreen";

import { StaffToolsScreen } from "@/screens/staff/StaffToolsScreen";
import { AttendanceRegisterScreen } from "@/screens/staff/AttendanceRegisterScreen";
import { AttendanceReportScreen } from "@/screens/staff/AttendanceReportScreen";
import { GradingQueueScreen } from "@/screens/staff/GradingQueueScreen";
import { InstructorControlScreen } from "@/screens/staff/InstructorControlScreen";
import { BacktrackScreen } from "@/screens/staff/BacktrackScreen";
import { LiveStudioScreen } from "@/screens/staff/LiveStudioScreen";

// Dummy Route Utilities
const protect = (Component: any, role?: string) => Component;

import { palette } from "@/theme/tokens";
const Stack = createNativeStackNavigator<RootStackParamList>();

// Wrapped Error Boundary Screens
const LearnerDashboardRoute = withErrorBoundary(LearnerDashboardScreen, 'learner-dashboard');
const MyCoursesRoute = withErrorBoundary(MyCoursesScreen, 'my-courses');
const MyLearningRoute = withErrorBoundary(MyLearningScreen, 'my-learning');
const WishlistRoute = withErrorBoundary(WishlistScreen, 'wishlist');
const ProfileRoute = withErrorBoundary(ProfileScreen, 'profile');
const CourseDetailRoute = withErrorBoundary(CourseDetailScreen, 'course-detail');
const GlobalSearchRoute = withErrorBoundary(GlobalSearchScreen, 'global-search');
const ForumHomeScreenRoute = withErrorBoundary(ForumHomeScreen, 'forum-home');
const ForumThreadRoute = withErrorBoundary(ForumThreadDetailScreen, 'forum-thread');
const CreatePostRoute = withErrorBoundary(CreatePostScreen, 'create-post');
const BookmarksRoute = withErrorBoundary(BookmarksScreen, 'bookmarks');
const ModerationRoute = withErrorBoundary(ModerationScreen, 'moderation');
const CheckoutRoute = withErrorBoundary(CheckoutScreen, 'checkout');
const PaymentSuccessScreenRoute = withErrorBoundary(PaymentSuccessScreen, 'payment-success');
const PaymentFailedRoute = withErrorBoundary(PaymentFailedScreen, 'payment-failed');
const NotificationPreferencesRoute = withErrorBoundary(NotificationPreferencesScreen, 'notification-preferences');
const VideoPlayerRoute = withErrorBoundary(VideoPlayerScreen, 'video-player');
const AssessmentRoute = withErrorBoundary(AssessmentScreen, 'assessment');
const ResultsRoute = withErrorBoundary(ResultsScreen, 'results');
const CertificateRoute = withErrorBoundary(CertificateScreen, 'certificate');

// Protected Variations
const ProtectedAssessment = protect(AssessmentScreen, "learner");
const ProtectedResults = protect(ResultsScreen, "learner");
const ProtectedCompanyCertificate = protect(ProfileScreen, "learner"); // Bypassed fallback reference

export function RootNavigator() {
 const session = { token: 'mock-token' };
 const admin = false;

  
  return (
    <Stack.Navigator
      initialRouteName={session.token ? (admin ? "AdminHome" : "LmsHome") : "SignIn"}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: palette.surface },
        headerTintColor: palette.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: palette.background },
        headerRight: () => (
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sign out"
              style={{ minHeight: 44, padding: 8, justifyContent: 'center' }}
              onPress={() => {
                signout().catch(() => {});
              }}
            >
              <Text style={{ color: palette.textSecondary }}>Sign out</Text>
            </Pressable>
          </View>
        )
      })}
    >
      <Stack.Screen name="SignIn" component={OnboardingFlowScreen} options={{ title: 'Sign In' }} />
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Admin Workspace' }} />
      <Stack.Screen name="Account" component={ProfileScreen} options={{ title: 'My Account' }} />
      <Stack.Screen name="MyLearning" component={MyLearningRoute} options={{ title: 'My Learning' }} />
      <Stack.Screen name="Wishlist" component={WishlistRoute} options={{ title: 'Wishlist' }} />
      <Stack.Screen name="Profile" component={ProfileRoute} options={{ title: 'Profile' }} />
      <Stack.Screen name="CourseDetail" component={CourseDetailRoute} options={{ title: 'Course Detail' }} />
      <Stack.Screen name="CoursePlayer" component={VideoPlayerRoute} options={{ title: 'Course Player' }} />
      <Stack.Screen name="AssessmentTaking" component={AssessmentTakingScreen} options={{ title: 'Assessment' }} />
      <Stack.Screen name="AssessmentResults" component={ResultsRoute} options={{ title: 'Results' }} />
      <Stack.Screen name="LmsCertificate" component={LmsCertificateScreen} options={{ title: 'Certificate' }} />
      <Stack.Screen name="Downloads" component={DownloadScreen} options={{ title: 'Downloads' }} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
      
      {/* <Stack.Screen name="LearnerProfile" component={ProfileScreen} options={{ title: 'Profile' }} /> */}
{/* <Stack.Screen name="LmsSettings" component={LmsSettingsScreen} options={{ title: 'Settings' }} /> */}
<Stack.Screen name="LearnerDashboard" component={LearnerDashboardScreen} options={{ title: 'Dashboard' }} />
<Stack.Screen name="MyCourses" component={MyCoursesScreen} options={{ title: 'My Courses' }} />
{/* <Stack.Screen name="CourseDetailTab" component={CourseDetailRoute} options={{ title: 'Course Detail' }} /> */}
{/* <Stack.Screen name="GlobalSearch" component={GlobalSearchRoute} options={{ title: 'Search' }} /> */}
{/* <Stack.Screen name="ForumHome" component={ForumHomeScreenRoute} options={{ title: 'Forum' }} /> */}
</Stack.Navigator>
  );
}

export default function App() {
  const [checking, setChecking] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}