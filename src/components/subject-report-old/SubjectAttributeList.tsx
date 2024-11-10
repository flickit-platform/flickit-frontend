import Box from "@mui/material/Box";
import Title from "@common/Title";
import { Trans } from "react-i18next";
import SubjectAttributeCard from "./SubjectAttributeCard";
import { IPermissions } from "@/types";

export const SubjectAttributeList = (props: any) => {
  const {
    data,
    attributesData,
    updateAttributeAndData,
    attributesDataPolicy,
    editable,
  } = props;
  const { subject, attributes, maturityLevelsCount } = data;
  const { permissions }: { permissions: IPermissions } = data;
  const { title } = subject;
  return (
    <Box mt={15} id="attributes">
      <Title sx={{ opacity: 0.8, fontSize: "1.7rem" }} titleProps={{ style:{unicodeBidi: "plaintext" }} } inPageLink="attributes">
        {title} <Trans i18nKey="attributes" />
      </Title>
      <Box mt={3}>
        {attributes.map((result: any = {}) => {
          return (
            <SubjectAttributeCard
              maturity_levels_count={maturityLevelsCount}
              {...result}
              key={result.id}
              attributesData={attributesData}
              attributesDataPolicy={attributesDataPolicy}
              updateAttributeAndData={updateAttributeAndData}
              editable={editable}
              permissions={permissions}
            />
          );
        })}
      </Box>
    </Box>
  );
};
