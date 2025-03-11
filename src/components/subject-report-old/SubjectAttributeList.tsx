import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import SubjectAttributeCard from "./SubjectAttributeCard";
import { IPermissions } from "@/types";
import Typography from "@mui/material/Typography";

export const SubjectAttributeList = (props: any) => {
  const { data, progress, subjAtt } = props;
  const { attributes, maturityLevelsCount } = data;
  const { permissions }: { permissions: IPermissions } = data;
  return (
    <Box mt={5} id="attributes">
      <Typography color="#73808C" variant="semiBoldMedium">
        <Trans i18nKey="attributes" />
      </Typography>
      <Box mt={3}>
        {attributes.map((result: any = {}, index: number) => {
          return (
            <SubjectAttributeCard
              maturity_levels_count={maturityLevelsCount}
              {...result}
              key={result.id}
              defaultInsight={subjAtt[index].insight}
              permissions={permissions}
              progress={progress}
            />
          );
        })}
      </Box>
    </Box>
  );
};
