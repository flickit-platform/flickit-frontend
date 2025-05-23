import { lazy, Suspense } from "react";
import { Route, Routes as RrdRoutes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Redirect from "./Redirect";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import ErrorNotFoundPage from "@common/errors/ErrorNotFoundPage";
import AppLayout from "../layouts/AppLayout";

const UserScreen = lazy(() => import("../screens/UserScreen"));

const ExpertGroupScreen = lazy(() => import("../screens/ExpertGroupScreen"));
const ExpertGroupConfirmInvitationScreen = lazy(
  () => import("../screens/ExpertGroupConfirmInvitationScreen"),
);
const AssessmentSettingScreen = lazy(
  () => import("../screens/AssessmentSettingScreen"),
);
const AssessmentHTMLDocumentScreen = lazy(
  () => import("../screens/HtmlDocumentScreen"),
);
const AssessmentDashboardScreen = lazy(
  () => import("../screens/AssessmentDashboardScreen"),
);
const DashboardScreen = lazy(() => import("../screens/DashboardScreen"));
const AssessmentReportScreen = lazy(
  () => import("../screens/AssessmentReportScreen"),
);
const AdviceScreen = lazy(() => import("../screens/AdviceScreen"));
const ReportScreen = lazy(() => import("../screens/ReportScreen"));
const AssessmentAdviceScreen = lazy(
  () => import("../screens/AssessmentAdviceScreen"),
);

const SpacesScreen = lazy(() => import("../screens/SpacesScreen"));
const SpaceSettingScreen = lazy(() => import("../screens/SpaceSettingScreen"));
const AssessmentsScreen = lazy(() => import("../screens/AssessmentsScreen"));
const QuestionsScreen = lazy(() => import("../screens/QuestionsScreen"));
const QuestionScreen = lazy(() => import("../screens/QuestionScreen"));
const QuestionnairesScreen = lazy(
  () => import("../screens/QuestionnairesScreen"),
);
const CompareScreen = lazy(() => import("../screens/CompareScreen"));
const CompareResultScreen = lazy(
  () => import("../screens/CompareResultScreen"),
);
const AssessmentKitsScreen = lazy(
  () => import("../screens/AssessmentKitsScreen"),
);
const AssessmentKitExpertViewScreen = lazy(
  () => import("../screens/AssessmentKitExpertViewScreen"),
);
const AssessmentKitScreen = lazy(
  () => import("../screens/AssessmentKitScreen"),
);
const AssessmentKitPermissionsScreen = lazy(
  () => import("../screens/AssessmentKitPermissionsScreen"),
);

const KitDesignerScreen = lazy(() => import("../screens/KitDesignerScreen"));
/**
 * How does it work?
 * We have two separate routes for users, for unauthorized users we have AuthRoutes and for authenticated users we use PrivateRoutes
 *
 */
const Routes = () => {
  return (
    <Suspense fallback={<GettingThingsReadyLoading />}>
      <RrdRoutes>
        {/* Handles redirecting users to where they wanted to go before login  */}
        <Route path="/" element={<Redirect />} />
        <Route
          path="/assessment-kits"
          element={
            <AppLayout>
              <AssessmentKitsScreen />
            </AppLayout>
          }
        />
        <Route
          path="/assessment-kits/:assessmentKitId"
          element={
            <AppLayout>
              <AssessmentKitScreen />
            </AppLayout>
          }
        />
        <Route
          path="/:spaceId/assessments/:assessmentId/graphical-report/:linkHash/"
          element={
            <AppLayout>
              <AssessmentHTMLDocumentScreen />
            </AppLayout>
          }
        />
        <Route
          element={
            <AppLayout>
              <PrivateRoutes />
            </AppLayout>
          }
        >
          {/* Account related routes */}
          <Route path="/user/:accountTab" element={<UserScreen />} />
          <Route
            path="/user/:accountTab/:expertGroupId"
            element={<ExpertGroupScreen />}
          />
          <Route
            path="/user/:accountTab/:expertGroupId/assessment-kits/:assessmentKitId"
            element={<AssessmentKitExpertViewScreen />}
          />
          <Route
            path="/user/:accountTab/:expertGroupId/assessment-kits/:assessmentKitId/permissions"
            element={<AssessmentKitPermissionsScreen />}
          />
          <Route
            path="/account/expert-group-invitation/:expertGroupId/:token"
            element={<ExpertGroupConfirmInvitationScreen />}
          />

          {/* Spaces and assessments related routes */}
          <Route path="/spaces/:page" element={<SpacesScreen />} />
          <Route path="/:spaceId/setting" element={<SpaceSettingScreen />} />
          <Route
            path="/:spaceId/assessments/:page"
            element={<AssessmentsScreen />}
          />
          <Route
            path="/:spaceId/assessments/:assessmentId/graphical-report/"
            element={<AssessmentHTMLDocumentScreen />}
          />
          <Route
            path="/:spaceId/assessments/:page/:assessmentId/"
            element={<DashboardScreen />}
          >
            <Route path="dashboard/" element={<AssessmentDashboardScreen />} />
            <Route path="settings/" element={<AssessmentSettingScreen />} />
            <Route path="insights/" element={<AssessmentReportScreen />} />
            <Route path="advice/" element={<AdviceScreen />} />
            <Route path="report/" element={<ReportScreen />} />
            <Route
              path="questionnaires/:questionIndex"
              element={<QuestionnairesScreen />}
            />
            <Route path="questionnaires/" element={<QuestionnairesScreen />} />

            <Route
              path="questionnaires/:questionnaireId"
              element={<QuestionsScreen />}
            >
              <Route path="" element={<QuestionScreen />} />
              <Route path=":questionIndex" element={<QuestionScreen />} />
            </Route>
          </Route>
          <Route
            path="/:spaceId/assessments/:page/:assessmentId/advice"
            element={<AssessmentAdviceScreen />}
          />
          {/* Questionnaires and questions related routes */}

          {/* Compare routes */}
          <Route path="/compare" element={<CompareScreen />} />
          <Route path="/compare/result" element={<CompareResultScreen />} />

          <Route
            path="/user/:accountTab/:expertGroupId/kit-designer/:kitVersionId"
            element={<KitDesignerScreen />}
          />
        </Route>

        {/* Any other routes results in 404 page */}
        <Route path="*" element={<ErrorNotFoundPage />} />
      </RrdRoutes>
    </Suspense>
  );
};

export default Routes;
