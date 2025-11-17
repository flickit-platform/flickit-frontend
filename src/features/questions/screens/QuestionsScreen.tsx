import { Outlet } from "react-router-dom";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import Layout from "../ui/Layout";

const QuestionsScreen = () => {
  useDocumentTitle();
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default QuestionsScreen;
