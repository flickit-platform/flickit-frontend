import Box from "@mui/material/Box";
import Title from "@common/Title";
import { Trans } from "react-i18next";
import SubjectAttributeCard from "./SubjectAttributeCard";
import { IPermissions } from "@/types";

export const SubjectAttributeList = (props: any) => {
  const { data, progress } = props;
  const { subject, attributes, maturityLevelsCount } = data;
  const { permissions }: { permissions: IPermissions } = data;
  const { title } = subject;
  return (
    <Box mt={7} id="attributes">
      <Title
        sx={{ opacity: 0.8, fontSize: "1.7rem" }}
        titleProps={{ style: { unicodeBidi: "plaintext" } }}
        inPageLink="attributes"
      >
        <Trans i18nKey="subjectAttributes" values={{ subject: title }} />
      </Title>
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
