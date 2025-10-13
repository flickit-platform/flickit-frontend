import { Suspense } from "react";
import { Grid } from "@mui/material";
import { KitDetailsType } from "../../model/types";
import { useFooterController } from "../../model/footer/useFooterController";
import KitDetailsTreeView from "./KitDetailsTreeView";

function FooterContainer({ details }: { details: KitDetailsType }) {
  const { selectedId, setSelectedId, ActiveComp, activeProps } =
    useFooterController(details);

  return (
    <Grid container sm={12} xs={12} height="100%" mt={2}>
      <Grid
        item
        sm={2.3}
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
        sm={9.7}
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
