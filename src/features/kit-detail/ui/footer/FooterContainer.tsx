import React, { Suspense } from "react";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import QueryData from "@/components/common/QueryData";
import { useKitDetailContainer } from "../../model/useKitDetailContainer";
import { KitDetailsType } from "../../model/types";
import { useFooterController } from "../../model/footer/useFooterController";
import KitDetailsTreeView from "./KitDetailsTreeView";

const FooterContainer: React.FC = () => {
  const { assessmentKitId } = useParams();
  const { fetchKitDetailQuery, details } =
    useKitDetailContainer(assessmentKitId);

  return (
    <QueryData
      {...fetchKitDetailQuery}
      render={(detailsData) => {
        const _details = (details ?? detailsData) as KitDetailsType;
        return <Inner details={_details} />;
      }}
    />
  );
};

function Inner({ details }: { details: KitDetailsType }) {
  const { selectedId, setSelectedId, ActiveComp, activeProps } =
    useFooterController(details);

  return (
    <Grid container sm={12} xs={12} mt={4}>
      <Grid
        item
        sm={2}
        xs={12}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <KitDetailsTreeView
          details={details}
          initialSelectedId={selectedId}
          onSelect={setSelectedId}
        />
      </Grid>
      <Grid
        item
        sm={9.8}
        xs={12}
        sx={{
          height: "100%",
          padding: "16px 32px",
          bgcolor: "background.containerLowest",
          borderStartEndRadius: "12px",
          borderEndEndRadius: "12px",
        }}
      >
        <Suspense fallback={null}>
          <ActiveComp {...activeProps} />
        </Suspense>
      </Grid>
    </Grid>
  );
}

export default FooterContainer;
