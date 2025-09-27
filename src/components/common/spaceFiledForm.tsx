import React from 'react';
import {Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Trans} from "react-i18next";
import {SpaceField} from "@common/fields/SpaceField";
import FormProviderWithForm from "@common/FormProviderWithForm";

const SpaceFieldForm = (props: any) => {
    const {formMethods, staticData} = props
    const { spaceList, queryDataSpaces } = staticData ;
    return (
        <FormProviderWithForm formMethods={formMethods}>
            <Grid container>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography variant="bodyMedium">
                        <Trans i18nKey="assessment.chooseTargetSpace" />
                    </Typography>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <SpaceField
                        queryDataSpaces={queryDataSpaces}
                        spaces={spaceList}
                        sx={{ mt: "24px" }}
                        label={<Trans i18nKey="spaces.targetSpace" />}
                        filterSelectedOptions={false}
                    />{" "}
                </Grid>
            </Grid>
        </FormProviderWithForm>
    );
};

export default SpaceFieldForm;