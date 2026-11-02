import { useEffect, useState } from 'react';

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ErrorBoundary } from '@/components/common';
import { getSession } from '@/api/session';
import { isOnboardingCompleted } from '@/features/onboarding/utils/onboardingStorage';
import { ApiClientProvider } from '@/hooks/useApiClient';
import type { RootStackParamList } from '@/navigation/types';
import { useDeepLinks } from '@/navigation/useDeepLinks';
import { withErrorBoundary } from '@/navigation/withErrorBoundary';
import { CheckoutScreen } from '@/screens/checkout/CheckoutScreen';
import { CourseDetailScreen } from '@/screens/course/CourseDetailScreen';
import { BookmarksScreen } from '@/screens/forum/BookmarksScreen';
import { CreatePostScreen } from '@/screens/forum/CreatePostScreen';
import { ForumHomeScreen } from '@/screens/forum/ForumHomeScreen';
import { ForumThreadDetailScreen } from '@/screens/forum/ForumThreadDetailScreen';
import { ModerationScreen } from '@/screens/forum/ModerationScreen';
import { LearnerDashboardScreen } from '@/screens/learner/LearnerDashboardScreen';
import { MyCoursesScreen } from '@/screens/learner/MyCoursesScreen';
import { MyLearningScreen } from '@/screens/learner/MyLearningScreen';
import { ProfileScreen } from '@/screens/learner/ProfileScreen';
import { WishlistScreen } from '@/screens/learner/WishlistScreen';
import { GlobalSearchScreen } from '@/screens/search/GlobalSearchScreen';
import { NotificationPreferencesScreen } from '@/features/notifications/screens/NotificationPreferencesScreen';
import { PaymentFailedScreen } from '@/features/payments/screens/PaymentFailedScreen';
import { PaymentSuccessScreen } from '@/features/payments/screens/PaymentSuccessScreen';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { AssessmentScreen } from '@/screens/learning/AssessmentScreen';
import { CertificateScreen } from '@/screens/learning/CertificateScreen';
import { OnboardingFlowScreen } from '@/screens/onboarding/OnboardingFlowScreen';
import { ResultsScreen } from '@/screens/learning/ResultsScreen';
import { VideoPlayerScreen } from '@/screens/learning/VideoPlayerScreen';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();

const LearnerDashboardRoute = withErrorBoundary(
  LearnerDashboardScreen,
  'learner-dashboard'
);
const MyCoursesRoute = withErrorBoundary(MyCoursesScreen, 'my-courses');
const MyLearningRoute = withErrorBoundary(MyLearningScreen, 'my-learning');
const WishlistRoute = withErrorBoundary(WishlistScreen, 'wishlist');
const ProfileRoute = withErrorBoundary(ProfileScreen, 'profile');
const CourseDetailRoute = withErrorBoundary(CourseDetailScreen, 'course-detail');
const GlobalSearchRoute = withErrorBoundary(GlobalSearchScreen, 'global-search');
const ForumHomeRoute = withErrorBoundary(ForumHomeScreen, 'forum-home');
const ForumThreadRoute = withErrorBoundary(ForumThreadDetailScreen, 'forum-thread');
const CreatePostRoute = withErrorBoundary(CreatePostScreen, 'create-post');
const BookmarksRoute = withErrorBoundary(BookmarksScreen, 'bookmarks');
const ModerationRoute = withErrorBoundary(ModerationScreen, 'moderation');
const CheckoutRoute = withErrorBoundary(CheckoutScreen, 'checkout');
const PaymentSuccessRoute = withErrorBoundary(
  PaymentSuccessScreen,
  'payment-success'
);
const PaymentFailedRoute = withErrorBoundary(
  PaymentFailedScreen,
  'payment-failed'
);
const NotificationPreferencesRoute = withErrorBoundary(
  NotificationPreferencesScreen,
  'notification-preferences'
);
const LoginRoute = withErrorBoundary(LoginScreen, 'login');
const VideoPlayerRoute = withErrorBoundary(VideoPlayerScreen, 'video-player');
const AssessmentRoute = withErrorBoundary(AssessmentScreen, 'assessment');
const ResultsRoute = withErrorBoundary(ResultsScreen, 'results');
const CertificateRoute = withErrorBoundary(CertificateScreen, 'certificate');

export function RootNavigator() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const { handleReady } = useDeepLinks(navigationRef);
  const { palette: themePalette, isDark } = useTheme();
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const activeNavigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: themePalette.background,
      card: themePalette.surface,
      text: themePalette.textPrimary,
      border: themePalette.border,
      primary: themePalette.brand,
      notification: themePalette.danger,
    },
  };

  return (
    <NavigationContainer
      onReady={handleReady}
      ref={navigationRef}
      theme={activeNavigationTheme}>
      <Stack.Navigator
        initialRouteName={
          getSession().isSignedIn ? 'LearnerDashboard' : 'Login'
        }
        screenOptions={{
          headerStyle: { backgroundColor: themePalette.surface },
          headerTintColor: themePalette.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: themePalette.background },
        }}>
        <Stack.Screen
          component={LoginRoute}
          name="Login"
          options={{ headerShown: false, title: 'Sign in' }}
        />
        <Stack.Screen
          component={LearnerDashboardRoute}
          name="LearnerDashboard"
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen
          component={MyCoursesRoute}
          name="MyCourses"
          options={{ title: 'My Courses' }}
        />
        <Stack.Screen
          component={MyLearningRoute}
          name="MyLearning"
          options={{ title: 'My Learning' }}
        />
        <Stack.Screen
          component={WishlistRoute}
          name="Wishlist"
          options={{ title: 'Wishlist' }}
        />
        <Stack.Screen
          component={ProfileRoute}
          name="Profile"
          options={{ title: 'Profile' }}
        />
        <Stack.Screen
          component={CourseDetailRoute}
          name="CourseDetail"
          options={{ title: 'Course Detail' }}
        />
        <Stack.Screen
          component={GlobalSearchRoute}
          name="GlobalSearch"
          options={{ title: 'Search' }}
        />
        <Stack.Screen
          component={ForumHomeRoute}
          name="ForumHome"
          options={{ title: 'Forum' }}
        />
        <Stack.Screen
          component={ForumThreadRoute}
          name="ForumThread"
          options={{ title: 'Thread' }}
        />
        <Stack.Screen
          component={CreatePostRoute}
          name="CreatePost"
          options={{ title: 'New Thread' }}
        />
        <Stack.Screen
          component={BookmarksRoute}
          name="Bookmarks"
          options={{ title: 'Bookmarks' }}
        />
        <Stack.Screen
          component={ModerationRoute}
          name="Moderation"
          options={{ title: 'Moderation' }}
        />
        <Stack.Screen
          component={CheckoutRoute}
          name="Checkout"
          options={{ title: 'Checkout' }}
        />
        <Stack.Screen
          component={PaymentSuccessRoute}
          name="PaymentSuccess"
          options={{ title: 'Payment Successful' }}
        />
        <Stack.Screen
          component={PaymentFailedRoute}
          name="PaymentFailed"
          options={{ title: 'Payment Failed' }}
        />
        <Stack.Screen
          component={NotificationPreferencesRoute}
          name="NotificationPreferences"
          options={{ title: 'Notification Preferences' }}
        />
        <Stack.Screen
          component={VideoPlayerRoute}
          name="VideoPlayer"
          options={{ title: 'Lesson' }}
        />
        <Stack.Screen
          component={AssessmentRoute}
          name="Assessment"
          options={{ title: 'Assessment' }}
        />
        <Stack.Screen
          component={ResultsRoute}
          name="Results"
          options={{ title: 'Results' }}
        />
        <Stack.Screen
          component={CertificateRoute}
          name="Certificate"
          options={{ title: 'Certificate' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export function App() {
  const [checking, setChecking] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    isOnboardingCompleted()
      .then((completed) => {
        setShowOnboarding(!completed);
      })
      .catch(() => {
        setShowOnboarding(true);
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  if (checking) {
    return null;
  }

  if (showOnboarding) {
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <ApiClientProvider>
            <ErrorBoundary context="root">
              <ThemedStatusBar />
              <OnboardingFlowScreen onFinish={() => setShowOnboarding(false)} />
            </ErrorBoundary>
          </ApiClientProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <ApiClientProvider>
          <ErrorBoundary context="root">
            <StatusBar style="light" />
            <RootNavigator />
          </ErrorBoundary>
        </ApiClientProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
