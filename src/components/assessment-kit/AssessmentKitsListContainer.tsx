import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import forLoopComponent from "@utils/forLoopComponent";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import AssessmentKitsMarketListItem from "./AssessmentKitsMarketListItem";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import { uniqueId } from "lodash";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { t } from "i18next";
import {MenuItem, Typography} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";

const AssessmentKitsListContainer = () => {
  const { service } = useServiceContext();
  const [value, setValue] = useState("public");
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<any>(
    i18n.language.toUpperCase(),
  );
  const [kitLanguages, setKitLanguages] = useState<any>([]);
  const publicAssessmentKitsQueryData = useQuery({
    service: (args = { isPrivate: false, lang: currentLang }, config) =>
      service.fetchAssessmentKits(args, config),
    runOnMount: false,
  });
  const privateAssessmentKitsQueryData = useQuery({
    service: (args = { isPrivate: true, lang: currentLang }, config) =>
      service.fetchAssessmentKits(args, config),
    runOnMount: false,
  });
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const fetchKitLanguage = useQuery({
    service: (args, config) => service.fetchKitLanguage(args, config),
  });
  useEffect(() => {
    (async () => {
      const { kitLanguages } = await fetchKitLanguage?.data;
      setKitLanguages(kitLanguages);
    })();
  }, [fetchKitLanguage?.data]);

  useEffect(() => {
    (async () => {
      await privateAssessmentKitsQueryData.query();
      await publicAssessmentKitsQueryData.query();
    })();
  }, [currentLang]);

  const handleChange = (selected: any) => {
    const { value } = selected.target;
    let lang: string = "";
    if (value == "Persian" || value == "فارسی") {
      lang = "FA";
    } else if (value == "English" || value == "انگلیسی") {
      lang = "EN";
    }
    setCurrentLang((prev: any) => {
      if (prev === lang) {
        return null;
      } else {
        return lang;
      }
    });
  };
  return (
    <Box>
      <FormControl sx={{ m: 1, width: 250 }}>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          // multiple
          value={currentLang}
          onChange={handleChange}
          displayEmpty={true}
          renderValue={
            (selected) => {
              const find = kitLanguages.find((item: any) => item.code == selected);
              if (find) {
                return find.title;
              } else {
                return  <Typography
                    sx={{ ...theme.typography.semiBoldMedium, color: "#333333" }}
                >
                  <Trans i18nKey="none" />
                </Typography>;
              }
            }
            // kitLanguages.map((item: any) => {
            //   if (item.code == selected) {
            //     return item.title;
            //   }else if(!selected){
            //     return <Box>none</Box>
            //   }
            // })
          }
          sx={{
            ...theme.typography.semiBoldMedium,
            background: "#fff",
            px: "0px",
            height: "40px",
          }}
        >
          {kitLanguages.map((lang: { code: string; title: string }) => {
            return (
              <MenuItem key={lang.code} value={lang.title}>
                <Checkbox checked={lang.code === currentLang} />
                <ListItemText
                  sx={{
                    ...theme.typography.semiBoldMedium,
                    color: "#333333",
                  }}
                  primary={lang.title}
                />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <TabContext value={value}>
        <Box>
          <TabList onChange={handleTabChange}>
            <Tab
              label={
                <Box sx={{ ...styles.centerV }}>
                  <Trans
                    style={{ ...theme.typography.titleSmall }}
                    i18nKey="public"
                  />
                </Box>
              }
              value="public"
            />
            <Tab
              label={
                <Box sx={{ ...styles.centerV }}>
                  <Trans
                    style={{ ...theme.typography.titleSmall }}
                    i18nKey="private"
                  />
                </Box>
              }
              value="private"
            />
          </TabList>
        </Box>
        <TabPanel value="public">
          <QueryData
            {...publicAssessmentKitsQueryData}
            renderLoading={() => (
              <>
                <Box mt={`2`}>
                  <Grid container spacing={2}>
                    {forLoopComponent(5, (index) => (
                      <Grid item xs={12} md={6} lg={4} key={uniqueId()}>
                        <LoadingSkeleton
                          key={uniqueId()}
                          sx={{ height: "340px", mb: 1 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </>
            )}
            render={(data) => {
              const { items = [] } = data;
              return (
                <Box mt={3}>
                  <Grid container spacing={2}>
                    {items?.map((assessmentKit: any) => {
                      return (
                        <Grid item xs={12} md={4} lg={3} key={assessmentKit.id}>
                          <AssessmentKitsMarketListItem
                            bg1={"#4568dc"}
                            bg2={"#b06ab3"}
                            data={assessmentKit}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              );
            }}
          />
        </TabPanel>
        <TabPanel value="private">
          <QueryData
            {...privateAssessmentKitsQueryData}
            renderLoading={() => (
              <>
                <Box mt={`2`}>
                  <Grid container spacing={2}>
                    {forLoopComponent(5, () => (
                      <Grid item xs={12} md={6} lg={4} key={uniqueId()}>
                        <LoadingSkeleton
                          key={uniqueId()}
                          sx={{ height: "340px", mb: 1 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </>
            )}
            render={(data) => {
              const { items = [] } = data;
              return (
                <Box mt={3}>
                  <Grid container spacing={2}>
                    {items?.map((assessmentKit: any) => {
                      return (
                        <Grid item xs={12} md={4} lg={3} key={assessmentKit.id}>
                          <AssessmentKitsMarketListItem
                            bg1={"#4568dc"}
                            bg2={"#b06ab3"}
                            data={assessmentKit}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              );
            }}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default AssessmentKitsListContainer;
