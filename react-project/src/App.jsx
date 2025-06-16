import Main from './pages/main.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './components/root_layout.jsx'
import Login from './pages/login.jsx'
import './App.css'
import User from './pages/userPage.jsx'
import Register from './pages/register.jsx'
import Thread from './pages/threadPage.jsx'
import Topic from './components/topic.jsx'
import { MainPageLoader } from './pages/main.jsx'
import { TopicPageLoader } from './components/topic.jsx'
import { ThreadPageLoader } from './pages/threadPage.jsx'
import { UserPageLoader } from './pages/userPage.jsx'
import EmailVerification from './pages/verification.jsx'
import ExpiredLink from './components/expired_link.jsx'
import { EmailVerificationLoader } from './pages/verification.jsx'
import NotFound from './components/not_found.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import PasswordResetPage from './pages/passwordReset.jsx'
import RequestPasswordReset from './components/forgotPassword/RequestPasswordReset.jsx'
import AdminDashboard from './components/reports/AdminDashboard.jsx'
import { ReportsLoader } from './components/reports/AdminDashboard.jsx'
import Leaderboard from './components/leaderboard/Leaderboard.jsx'
import { leaderboardLoader } from './components/leaderboard/Leaderboard.jsx'
import ForumStatsDashboard from './components/stats/ForumStatsDashboard.jsx'
import { StatsLoader } from './components/stats/ForumStatsDashboard.jsx'
import RulesDisplay from './components/rules/RulesDisplay.jsx'
import { RulesLoader } from './components/rules/RulesDisplay.jsx'
import NewsForum from './components/news/NewsForum.jsx'
import { NewsForumLoader } from './components/news/NewsForum.jsx'
import RandomThread from './components/random/RandomThread.jsx'
import { RandomThreadLoader } from './components/random/RandomThread.jsx'
import MyPosts from './components/myPosts/MyPosts.jsx'
import { MyPostsLoader } from './components/myPosts/MyPosts.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Main />, loader: MainPageLoader },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'topic/:id', element: <Topic />, loader: TopicPageLoader },
      { path: 'thread/:threadId', element: <Thread />, loader: ThreadPageLoader },
      { path: 'user/:userId', element: <User />, loader: UserPageLoader },
      { path: 'user/verification/:token', element: <EmailVerification />, loader: EmailVerificationLoader, errorElement: <ExpiredLink /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'user/password-reset/:token', element: <PasswordResetPage /> },
      { path: 'user/request-password-reset', element: < RequestPasswordReset /> },
      { path: 'reports', element: <AdminDashboard />, loader: ReportsLoader },
      { path: 'leaderboard', element: <Leaderboard />, loader: leaderboardLoader },
      { path: 'stats', element: <ForumStatsDashboard />, loader: StatsLoader },
      { path: 'rules', element: <RulesDisplay />, loader: RulesLoader },
      { path: 'news', element: <NewsForum />, loader: NewsForumLoader },
      { path: 'random', element: <RandomThread />, loader: RandomThreadLoader },
      { path: 'myposts/:userId', element: <MyPosts />, loader: MyPostsLoader },
    ],
  },
  {
    path: '*', element: <NotFound />
  }
])
function App() {


  return (
    <>
      <RouterProvider router={router} />
    </>)
}

export default App
