import Box from "@mui/material/Box";
import Title from "@common/Title";
import { Trans } from "react-i18next";
import SubjectAttributeCard from "./SubjectAttributeCard";
import { IPermissions } from "@/types";
import { Typography } from "@mui/material";

export const SubjectAttributeList = (props: any) => {
  const { data, progress } = props;
  const { subject, attributes, maturityLevelsCount } = data;
  const { permissions }: { permissions: IPermissions } = data;
  return (
    <Box mt={2} id="attributes">
      <Typography color="#73808C" variant="semiBoldMedium">
        <Trans i18nKey="attributes" />
      </Typography>
      <Box mt={3}>
        {attributes.map((result: any = {}) => {
          return (
            <SubjectAttributeCard
              maturity_levels_count={maturityLevelsCount}
              {...result}
              key={result.id}
              permissions={permissions}
              progress={progress}
            />
          );
        })}
      </Box>
    </Box>
  );
};
