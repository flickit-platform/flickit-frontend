import { Grid } from "@mui/material";
import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { KitDetailsType } from "../../model/types";
import { useKitDetailContainer } from "../../model/useKitDetailContainer";
import KitDetailsTreeView from "./KitDetailsTreeView";
import QueryData from "@/components/common/QueryData";
import { useFooterContainer } from "../../model/models/useFooterContainer";

const FooterContainer = () => {
  const { assessmentKitId } = useParams();
  const { fetchKitDetailQuery, details } = useKitDetailContainer(assessmentKitId);

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
  const { nodeId, setNodeId, Active, activeProps } = useFooterContainer(details);

  return (
    <Grid container sm={12} xs={12} mt={4}>
      <Grid item sm={2} xs={12} sx={{ display: "flex", flexDirection: "column" }}>
        <KitDetailsTreeView
          details={details}
          initialSelectedId={nodeId}
          onSelect={setNodeId}
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
          <Active {...activeProps} />
        </Suspense>
      </Grid>
    </Grid>
  );
}

export default FooterContainer;
