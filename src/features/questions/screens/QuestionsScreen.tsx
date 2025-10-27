import { Outlet } from "react-router-dom";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { Provider } from "../context";
import Layout from "../ui/Layout";

const QuestionsScreen = () => {
  useDocumentTitle();
  return (
    <Provider>
      <Layout>
        <Outlet />
      </Layout>
    </Provider>
  );
};

export default QuestionsScreen;
