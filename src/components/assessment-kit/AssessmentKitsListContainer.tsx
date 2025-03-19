import { useEffect, useMemo, useState } from "react";
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
import { Trans, useTranslation } from "react-i18next";
import { theme } from "@config/theme";
import uniqueId from "@/utils/uniqueId";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { useConfigContext } from "@providers/ConfgProvider";
import Chip from "@mui/material/Chip";
import { ILangs } from "@types";

const AssessmentKitsListContainer = () => {
  const { service } = useServiceContext();
  const [value, setValue] = useState("public");
  const { i18n } = useTranslation();
  const [langsCode, setLangsCode] = useState<string[]>([
    i18n.language.toUpperCase(),
  ]);
  const {
    config: { languages },
  }: any = useConfigContext();
  const publicAssessmentKitsQueryData = useQuery({
    service: (args, config) => service.fetchAssessmentKits(args, config),
    runOnMount: false,
  });
  const privateAssessmentKitsQueryData = useQuery({
    service: (args, config) => service.fetchAssessmentKits(args, config),
    runOnMount: false,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const fetchData = async () => {
    const langs = langsCode.join(",");
    await Promise.all([
      privateAssessmentKitsQueryData.query({ isPrivate: true, langs }),
      publicAssessmentKitsQueryData.query({ isPrivate: false, langs }),
    ]);
  };

  useEffect(() => {
    fetchData();
  }, [langsCode]);

  const filtredLangs = useMemo(
    () =>
      languages.filter((item: { code: string; title: string }) =>
        langsCode.includes(item.code),
      ),
    [langsCode.length],
  );

  const handleChange = (event: SelectChangeEvent<typeof langsCode>) => {
    const {
      target: { value },
    } = event;
    setLangsCode(Array.isArray(value) ? value : value.split(","));
  };

  const handleSelected = (selected: string[]) => {
    if (selected.length == 0) {
      return (
        <Typography
          sx={{ ...theme.typography.semiBoldLarge, color: "#2B333B" }}
        >
          <Trans i18nKey="language" />
        </Typography>
      );
    } else if (selected.length >= 1) {
      return (
        <Typography sx={{ ...theme.typography.semiBoldLarge, color: "#fff" }}>
          <Trans i18nKey="language" /> ({selected.length})
        </Typography>
      );
    }
  };

  const handleDelete = (langCode: string): void => {
    const filteredLanguages: string[] = langsCode.filter(
      (lang: string) => lang !== langCode,
    );
    setLangsCode(filteredLanguages);
  };
  return (
    <Box>
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
        <Box sx={{ ...styles.centerV }} mt={2} gap={2}>
          <FormControl>
            <Select
              size="small"
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={langsCode}
              onChange={handleChange}
              displayEmpty={true}
              renderValue={(selected) => handleSelected(selected)}
              sx={{
                background: "#fff",
                px: "0px",
                backgroundColor:
                  langsCode.length >= 1 ? theme.palette.primary.main : "",
                "& .MuiSelect-icon": {
                  color: langsCode.length >= 1 ? "#fff" : "unset",
                },
                "& .MuiTypography-root": {
                  ...theme.typography.semiBoldMedium,
                },
              }}
            >
              {languages.map((lang: { code: string; title: string }) => {
                return (
                  <MenuItem key={lang.code} value={lang.code}>
                    <Checkbox checked={langsCode.includes(lang.code)} />
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
          <Box
            sx={{ ...styles.centerVH, justifyContent: "flex-start", gap: 1 }}
          >
            {filtredLangs.map((lang: ILangs) => {
              return (
                <Chip
                  key={uniqueId()}
                  color="primary"
                  variant="outlined"
                  sx={{ background: "#EAF2FB" }}
                  label={
                    <Box sx={{ ...styles.centerVH, gap: "10px" }}>
                      <Typography
                        variant="labelSmall"
                        sx={{ ...styles.centerVH, color: "#6C8093" }}
                      >
                        <Trans i18nKey={"language"} />:
                      </Typography>
                      <Typography variant="labelSmall">{lang.title}</Typography>
                    </Box>
                  }
                  onDelete={() => handleDelete(lang.code)}
                />
              );
            })}
          </Box>
        </Box>
        <TabPanel value="public">
          <QueryData
            {...publicAssessmentKitsQueryData}
            renderLoading={() => (
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
            )}
            render={(data) => {
              const { items = [] } = data;
              return (
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
              );
            }}
          />
        </TabPanel>
        <TabPanel value="private">
          <QueryData
            {...privateAssessmentKitsQueryData}
            renderLoading={() => (
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
