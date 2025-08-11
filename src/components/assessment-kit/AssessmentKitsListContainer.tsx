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
import uniqueId from "@/utils/uniqueId";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { useConfigContext } from "@providers/ConfgProvider";
import Chip from "@mui/material/Chip";
import { IMapper } from "@/types/index";
import keycloakService from "@/service/keycloakService";
import { useTheme } from "@mui/material";

const AssessmentKitsListContainer = () => {
  const theme = useTheme();
  const { service } = useServiceContext();
  const [value, setValue] = useState("public");
  const { i18n } = useTranslation();
  const [langsCode, setLangsCode] = useState<string[]>([
    i18n.language.toUpperCase(),
  ]);
  const {
    config: { languages },
  }: any = useConfigContext();
  const isAuthenticated = keycloakService.isLoggedIn();
  const isPublic = isAuthenticated ? "" : "/public"
  const assessmentKitsQueryData = useQuery({
    service: (args = { isPublic }, config) =>
      service.assessmentKit.info.getAll(args, config),
    runOnMount: false,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const fetchData = async () => {
    const langs = langsCode.join(",");
    await Promise.all([
      assessmentKitsQueryData.query({ isPrivate: true, langs }),
      assessmentKitsQueryData.query({ isPrivate: false, langs }),
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
          color="text.primary"
          variant="semiBoldLarge"
        >
          <Trans i18nKey="common.language" />
        </Typography>
      );
    } else if (selected.length >= 1) {
      return (
        <Typography color="primary.contrastText" variant="semiBoldLarge">
          <Trans i18nKey="common.language" /> ({selected.length})
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
                    i18nKey="common.public"
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
                    i18nKey="common.private"
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
                background: theme.palette.background.containerLowest,
                px: "0px",
                backgroundColor:
                  langsCode.length >= 1 ? theme.palette.primary.main : "",
                "& .MuiSelect-icon": {
                  color: langsCode.length >= 1 ? theme.palette.primary.contrastText : "unset",
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
            {filtredLangs.map((lang: IMapper) => {
              return (
                <Chip
                  key={uniqueId()}
                  color="primary"
                  variant="outlined"
                  sx={{ background: theme.palette.primary.bg }}
                  label={
                    <Box sx={{ ...styles.centerVH, gap: "10px" }}>
                      <Typography
                        variant="labelSmall"
                        color="background.onVariant"
                        sx={{ ...styles.centerVH, }}
                      >
                        <Trans i18nKey="common.language" />:
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
            {...assessmentKitsQueryData}
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
            {...assessmentKitsQueryData}
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
