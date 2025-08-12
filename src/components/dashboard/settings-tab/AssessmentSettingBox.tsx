import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import React, { useEffect, useState } from "react";
import { styles } from "@styles";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { ICustomError } from "@utils/CustomError";
import firstCharDetector from "@utils/firstCharDetector";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@utils/stringAvatar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Link } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { SelectHeight } from "@utils/selectHeight";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import languageDetector from "@/utils/languageDetector";
import TablePagination from "@mui/material/TablePagination";
import { t } from "i18next";
import InputCustomEditor from "@common/fields/InputCustomEditor";
import { getReadableDate } from "@utils/readableDate";
import { FormControlLabel, Switch, useTheme } from "@mui/material";
import { ASSESSMENT_MODE } from "@/utils/enumType";
import {
  CEDialog,
  CEDialogActions,
} from "@/components/common/dialogs/CEDialog";
import useDialog from "@/utils/useDialog";
import {
  assessmentActions,
  useAssessmentContext,
} from "@/providers/AssessmentProvider";
import showToast from "@utils/toastError";

type InfoField = "creator" | "assessmentKit" | "created" | "lastModified";

interface Props {
  AssessmentTitle: string;
  fetchPathInfo: () => void;
  color: string;
}

const infoFields: { key: InfoField; i18n: string }[] = [
  { key: "creator", i18n: "common.creator" },
  { key: "assessmentKit", i18n: "assessmentKit.assessmentKit" },
  { key: "created", i18n: "common.created" },
  { key: "lastModified", i18n: "common.lastModified" },
];

function getInfoFieldValue(
  field: InfoField,
  assessmentInfo: any,
  getReadableDate: (time: number) => string,
) {
  switch (field) {
    case "creator":
      return assessmentInfo?.createdBy?.displayName ?? "-";
    case "assessmentKit":
      return assessmentInfo?.kit?.title ? (
        <Link
          style={{
            textDecoration: "none",
            color: "inherit",
            fontFamily: languageDetector(assessmentInfo?.kit?.title)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
          to={`/assessment-kits/${assessmentInfo?.kit?.id}`}
        >
          {assessmentInfo.kit.title}
        </Link>
      ) : (
        "-"
      );
    case "created":
      return assessmentInfo?.creationTime
        ? getReadableDate(assessmentInfo.creationTime)
        : "-";
    case "lastModified":
      return assessmentInfo?.lastModificationTime
        ? getReadableDate(assessmentInfo.lastModificationTime)
        : "-";
    default:
      return "-";
  }
}

// ---- Main component ----
export const AssessmentSettingGeneralBox: React.FC<Props> = ({
  AssessmentTitle,
  fetchPathInfo,
  color,
}) => {
  const formMethods = useForm({ shouldUnregister: true });
  const { assessmentInfo } = useAssessmentContext();

  return (
    <Box sx={{ ...styles.boxStyle }} gap={2}>
      <Box height={"100%"} width={"100%"}>
        <Typography
          sx={{ width: "100%", display: "inline-block" }}
          color="#2B333B"
          variant="headlineSmall"
        >
          <Trans i18nKey="common.general" />
        </Typography>

        <Divider sx={{ width: "100%", mt: "24px", mb: "10px !important" }} />

        <Grid container spacing={2} sx={{ ...styles.centerH }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="semiBoldLarge" color="#2B333B">
              <Trans i18nKey="assessment.assessmentTitle" />
            </Typography>
            <Box
              sx={{
                ...styles.centerVH,
                width: { md: "350px" },
                justifyContent: "flex-start",
              }}
            >
              <OnHoverInputTitleSetting
                formMethods={formMethods}
                data={AssessmentTitle}
                infoQuery={fetchPathInfo}
                editable={true}
                color={color}
                type="title"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ ...styles.centerVH }} color="#6C8093" gap={1}>
                <Typography
                  variant="semiBoldLarge"
                  color="#2B333B"
                  lineHeight="normal"
                >
                  <Trans i18nKey="assessment.shortTitle" />
                </Typography>
                <Tooltip title={<Trans i18nKey="assessment.shortTitleInfo" />}>
                  <InfoOutlined
                    fontSize="small"
                    color="inherit"
                    sx={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  width: { md: "350px" },
                  flexDirection: "column",
                }}
              >
                <OnHoverInputTitleSetting
                  formMethods={formMethods}
                  data={AssessmentTitle}
                  infoQuery={fetchPathInfo}
                  editable={true}
                  color={color}
                  type="shortTitle"
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ width: "100%", mb: "24px", mt: "10px" }} />

        <Grid container spacing={2}>
          <Grid item>
            <QuickAssessmentSwitch />
          </Grid>
        </Grid>

        <Divider sx={{ width: "100%", mb: "24px", mt: "10px" }} />

        <Grid container spacing={2} sx={{ ...styles.centerH }}>
          {infoFields.map((field) => (
            <Grid
              key={field.key}
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: "10px",
              }}
            >
              <Typography
                color="#6C8093"
                whiteSpace="nowrap"
                sx={{
                  width: "250px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
                variant="bodyLarge"
              >
                <Trans i18nKey={field.i18n} />
              </Typography>
              <Typography
                color="#2B333B"
                variant="semiBoldLarge"
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: { md: "350px" },
                  fontFamily: languageDetector(
                    getInfoFieldValue(
                      field.key,
                      assessmentInfo,
                      getReadableDate,
                    ),
                  )
                    ? farsiFontFamily
                    : primaryFontFamily,
                }}
              >
                {getInfoFieldValue(field.key, assessmentInfo, getReadableDate)}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

const QuickAssessmentSwitch = () => {
  const { assessmentInfo, dispatch } = useAssessmentContext();

  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();
  const [isQuickMode, setIsQuickMode] = useState(
    assessmentInfo?.mode?.code === ASSESSMENT_MODE.QUICK,
  );
  useEffect(() => {
    setIsQuickMode(assessmentInfo?.mode?.code === ASSESSMENT_MODE.QUICK);
  }, [assessmentInfo?.mode?.code]);

  const dialogProps = useDialog();

  const handleToggleQuickMode = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dialogProps.openDialog({});
  };

  const handleConfirmToggle = () => {
    const newMode = isQuickMode
      ? ASSESSMENT_MODE.ADVANCED
      : ASSESSMENT_MODE.QUICK;
    updateAssessmentMode.query({
      id: assessmentId,
      data: { mode: newMode },
    });
    if (assessmentInfo) {
      dispatch(
        assessmentActions.setAssessmentInfo({
          ...assessmentInfo,
          mode: { ...assessmentInfo.mode, code: newMode },
        }),
      );
    }
    setIsQuickMode(!isQuickMode);
    dialogProps.onClose();
  };

  const updateAssessmentMode = useQuery({
    service: (args, config) =>
      service.assessments.info.updateAssessmentMode(args, config),
    runOnMount: false,
  });

  return (
    <Box sx={{ ...styles.centerV }} color="#6C8093" gap={1}>
      <FormControlLabel
        control={
          <Switch checked={isQuickMode} onChange={handleToggleQuickMode} />
        }
        label={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="semiBoldLarge" color="#2B333B">
              <Trans i18nKey="assessment.quickAssessmentMode" />
            </Typography>
            <Tooltip
              title={
                <Trans i18nKey="assessment.quickAssessmentModeDescription" />
              }
            >
              <InfoOutlined
                fontSize="small"
                color="inherit"
                sx={{ cursor: "pointer" }}
              />
            </Tooltip>
          </Box>
        }
        sx={{
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }}
        labelPlacement="start"
      />

      <CEDialog
        open={dialogProps.open}
        closeDialog={dialogProps.onClose}
        title={
          <Trans
            i18nKey="common.switchTo"
            values={{
              title: t(
                assessmentInfo?.mode?.code === ASSESSMENT_MODE.QUICK
                  ? "assessment.advancedAssessmentMode"
                  : "assessment.quickAssessmentMode",
              ),
            }}
          />
        }
        maxWidth="sm"
      >
        <Typography sx={{ color: "#2B333B" }}>
          <Trans
            i18nKey={
              assessmentInfo?.mode?.code === ASSESSMENT_MODE.QUICK
                ? "assessment.advancedAssessmentSwitchTitle"
                : "assessment.quickAssessmentSwitchTitle"
            }
          />
        </Typography>

        <CEDialogActions
          type="delete"
          loading={false}
          onClose={dialogProps.onClose}
          submitButtonLabel={t("common.switchTo", {
            title: t(
              assessmentInfo?.mode?.code === ASSESSMENT_MODE.QUICK
                ? "assessment.advancedAssessmentMode"
                : "assessment.quickAssessmentMode",
            ),
          })}
          cancelLabel={t("common.cancel")}
          onSubmit={handleConfirmToggle}
        />
      </CEDialog>
    </Box>
  );
};
export const AssessmentSettingMemberBox = (props: {
  listOfRoles: any[];
  listOfUser: any[];
  openModal: () => void;
  openRemoveModal: (id: string, name: string, invited?: boolean) => void;
  setChangeData?: any;
  changeData?: any;
  inviteesMemberList: any;
  totalUser: number;
  page: number;
  handleChangePage: (event: any, newPage: any) => void;
  rowsPerPage: number;
  handleChangeRowsPerPage: (event: any) => void;
}) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const {
    listOfRoles = [],
    listOfUser,
    setChangeData,
    openModal,
    openRemoveModal,
    changeData,
    inviteesMemberList,
    totalUser,
    page,
    handleChangePage,
    rowsPerPage,
    handleChangeRowsPerPage,
  } = props;

  useEffect(() => {
    inviteesMemberList.query();
  }, [changeData]);

  interface Column {
    id: "displayName" | "email" | "role";
    label: string;
    minWidth?: string;
    align?: "right";
    display?: string;
    position: string;
  }

  const editUserRoleInvited = useQuery({
    service: (args, config) =>
      service.assessments.member.updateInviteeRole(args, config),
    runOnMount: false,
  });

  const columns: readonly Column[] = [
    {
      id: "displayName",
      label: "user.name",
      minWidth: "24%",
      position: "start",
    },
    {
      id: "email",
      label: "user.email",
      minWidth: "0%",
      display: "none",
      position: "center",
    },
    {
      id: "role",
      label: "user.role",
      minWidth: "22%",
      position: "center",
    },
  ];

  const inviteesColumns: readonly Column[] = [
    {
      id: "email",
      label: "user.email",
      minWidth: "30vw",
      position: "center",
    },
    {
      id: "role",
      label: "user.role",
      align: "right",
      minWidth: "30vw",
      position: "center",
    },
  ];

  const handleChangeInvitedUser = async (event: any) => {
    try {
      const {
        target: { value, name },
      } = event;
      const { id: roleId } = value;
      await editUserRoleInvited.query({ id: name, roleId });
      setChangeData((prev: boolean) => !prev);
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };
  
  const labelDisplayedRows = ( from: string, to: string, count: number ): string =>{
    let countLabel: string | number = ""
    if(count !== -1){
      countLabel = count
    }else {
      countLabel = `${t("common.moreThan")} ${to}`
    }
    return `${from}-${to} ${t("common.of")} ${countLabel}`
  }

  function getLabelDisplayedRows(t: any) {
    return ({ from, to, count }: { from: number; to: number; count: number }) => {
      let countLabel: string | number = ""
      if(count !== -1){
        countLabel = count
      }else {
        countLabel = `${t("common.moreThan")} ${to}`
      }
      return `${from}-${to} ${t("common.of")} ${countLabel}`;
    };
  }


  const ITEM_HEIGHT = 59;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = SelectHeight(ITEM_HEIGHT, ITEM_PADDING_TOP);
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...styles.boxStyle,
        minHeight: "350px",
      }}
      gap={2}
    >
      <Box height={"100%"} width={"100%"}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: "100%",
          }}
        >
          <Typography color="#2B333B" variant="headlineSmall">
            <Trans i18nKey="settings.grantedRoles" />
          </Typography>
          <Button
            variant="contained"
            onClick={openModal}
            sx={{
              ml: theme.direction === "rtl" ? "unset" : "auto",
              mr: theme.direction !== "rtl" ? "unset" : "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <AddIcon
              sx={{ width: "1.125rem", height: "1.125rem" }}
              fontSize="small"
              style={{ color: "#EDFCFC" }}
            />
            <Trans i18nKey="dashboard.grantAccess" />
          </Button>
        </Box>
        <Divider sx={{ width: "100%", marginTop: "24px" }} />
        <TableContainer
          sx={{
            maxHeight: 840,
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{ width: "100%", overflow: "hidden" }}
              style={{
                position: "sticky",
                top: 0,
                zIndex: 3,
                backgroundColor: "#fff",
              }}
            >
              <TableRow
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  width: "100%",
                  px: "1rem",
                  gap: { xs: "0px", md: "1.3rem" },
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{
                      px: 0,
                      minWidth: {
                        xs: "8.1rem",
                        sm: "12rem",
                        md: column.minWidth,
                      },
                      textAlign: { xs: column.position },
                      display: {
                        xs: column.display,
                        md: "inline-block",
                        border: "none",
                      },
                    }}
                  >
                    <Typography
                      color="rgba(0, 0, 0, 0.56)"
                      variant="semiBoldLarge"
                    >
                      <Trans i18nKey={`${column.label}`} />
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* Move the Divider outside the TableHead */}
            <TableBody>
              {listOfUser.length > 0 &&
                listOfUser.map((row: any) => (
                  <TableRow
                    tabIndex={-1}
                    key={row.id}
                    sx={{ background: !row.editable ? "#ebe8e85c" : "", p: 0 }}
                  >
                    <TableCell
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        border: "none",
                        gap: { xs: "0px", md: "1.3rem" },
                        paddingX: { xs: "0px", md: "1rem" },
                      }}
                    >
                      <Box sx={{ width: "20vw" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: { xs: "flex-start" },
                            alignItems: "center",
                            gap: ".5rem",
                          }}
                        >
                          <Avatar
                            {...stringAvatar(row.displayName.toUpperCase())}
                            src={row.pictureLink}
                            sx={{
                              width: 40,
                              height: 40,
                              display: { xs: "none", sm: "flex" },
                            }}
                          />
                          <Typography
                            sx={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              fontSize: "0.875rem",
                              color: "#1B1B1E",
                              fontWeight: 500,
                              fontFamily: languageDetector(row.displayName)
                                ? farsiFontFamily
                                : primaryFontFamily,
                            }}
                          >
                            {row.displayName}
                          </Typography>
                          {!row.editable && (
                            <Chip
                              sx={{
                                marginRight:
                                  theme.direction === "ltr" ? 1 : "unset",
                                marginLeft:
                                  theme.direction === "rtl" ? 1 : "unset",
                                opacity: 0.7,
                                color: "#9A003C",
                                borderColor: "#9A003C",
                              }}
                              label={<Trans i18nKey="common.owner" />}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: { xs: "none", md: "flex" },
                          justifyContent: "center",
                          width: { xs: "5rem", md: "20vw" },
                        }}
                      >
                        <Typography
                          sx={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            color: "#1B1B1E",
                            fontSize: "0.875",
                            wight: 300,
                          }}
                        >
                          {row.email}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: { xs: "0px", md: ".7rem" },
                          width: { xs: "16.1rem", md: "20vw" },
                        }}
                      >
                        <FormControl
                          sx={{
                            m: 1,
                            width: "100%",
                            textAlign: "center",
                            padding: "6px, 12px, 6px, 12px",
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Grid
                            item
                            lg={8}
                            sx={{ minWidth: { xs: "100%", md: "160px" } }}
                          >
                            <Tooltip
                              disableHoverListener={row.editable}
                              title={
                                <Trans i18nKey="spaces.spaceOwnerRoleIsNotEditable" />
                              }
                            >
                              <div>
                                <SelectionRole
                                  row={row}
                                  listOfRoles={listOfRoles}
                                  MenuProps={MenuProps}
                                  setChangeData={setChangeData}
                                  assessmentId={assessmentId}
                                />
                              </div>
                            </Tooltip>
                          </Grid>
                        </FormControl>
                        <Tooltip
                          disableHoverListener={row.editable}
                          title={
                            <Trans i18nKey="spaces.spaceOwnerRoleIsNotEditable" />
                          }
                        >
                          <Box
                            width="30%"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <IconButton
                              sx={{ "&:hover": { color: "#d32f2f" } }}
                              size="small"
                              disabled={!row.editable}
                              onClick={() =>
                                openRemoveModal(row.displayName, row.id)
                              }
                            >
                              <DeleteRoundedIcon />
                            </IconButton>
                          </Box>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalUser}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t("common.rowsPerPage")}
          labelDisplayedRows={getLabelDisplayedRows(t)}
        />
        <Divider sx={{ width: "100%", marginBlock: "24px" }} />

        {inviteesMemberList?.data?.items?.length > 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", sm: "center" },
                position: "relative",
                gap: "10px",
              }}
            >
              <Typography color="#78818b" variant="headlineSmall">
                <Trans i18nKey={`invitees`} />
              </Typography>
            </Box>

            {/* Moved Divider outside the TableHead */}
            <Divider sx={{ width: "100%", marginTop: "24px" }} />

            <TableContainer
              sx={{
                maxHeight: 840,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead
                  sx={{ width: "100%", overflow: "hidden" }}
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    backgroundColor: "#fff",
                  }}
                >
                  <TableRow
                    sx={{
                      display: "inline-flex",
                      justifyContent: { xs: "space-evenly", md: "center" },
                      width: "100%",
                    }}
                  >
                    {inviteesColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{
                          minWidth: {
                            xs: "10rem",
                            sm: "10rem",
                            md: column.minWidth,
                          },
                          textAlign: { xs: column.position, lg: "center" },
                          display: {
                            xs: column.display,
                            md: "inline-block",
                            color: "#78818b",
                            border: "none",
                            fontSize: "1rem",
                          },
                        }}
                      >
                        <Trans i18nKey={`${column.label}`} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {inviteesMemberList?.data?.items.map((row: any) => {
                    return (
                      <TableRow tabIndex={-1} key={row.id}>
                        <TableCell
                          sx={{
                            display: "flex",
                            justifyContent: {
                              xs: "space-evenly",
                              md: "center",
                            },
                            alignItems: "center",
                            border: "none",
                            gap: { xs: "0px", md: "1.3rem" },
                            paddingX: { xs: "0px", md: "1rem" },
                          }}
                        >
                          <Box
                            sx={{
                              m: 1,
                              textAlign: "center",
                              display: "inline-flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: { xs: "10rem", md: "30vw" },
                            }}
                          >
                            <Typography
                              sx={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                color: "#1B1B1E",
                                fontSize: "0.875",
                                wight: 300,
                              }}
                            >
                              {row.email}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: { xs: "0px", md: ".7rem" },
                              width: { xs: "15rem", md: "28vw" },
                            }}
                          >
                            <FormControl
                              sx={{
                                m: 1,
                                width: "100%",
                                textAlign: "center",
                                padding: "6px, 12px, 6px, 12px",
                                display: "inline-flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Grid
                                item
                                lg={8}
                                sx={{ minWidth: { xs: "100%", md: "160px" } }}
                              >
                                <Select
                                  labelId="demo-multiple-name-label"
                                  id="demo-multiple-name"
                                  value={row?.role?.title}
                                  onChange={handleChangeInvitedUser}
                                  name={row.id}
                                  MenuProps={MenuProps}
                                  sx={{
                                    width: "100%",
                                    boxShadow: "none",
                                    ".MuiOutlinedInput-notchedOutline": {
                                      border: 0,
                                    },
                                    border: row.editable
                                      ? "1px solid #2974B4"
                                      : "1px solid #2974b4",
                                    fontSize: "0.875rem",
                                    borderRadius: "0.5rem",
                                    "&.MuiOutlinedInput-notchedOutline": {
                                      border: 0,
                                    },
                                    "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: 0,
                                      },
                                    "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: 0,
                                      },
                                    ".MuiSvgIcon-root": {
                                      fill: row.editable
                                        ? "#2974B4 !important"
                                        : "#2974b4 !important",
                                    },
                                    "& .MuiSelect-select": {
                                      padding: "4px 5px",
                                    },
                                  }}
                                  IconComponent={KeyboardArrowDownIcon}
                                  inputProps={{
                                    renderValue: () => row?.role?.title,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      paddingY: "16px",
                                      color: "#78818b",
                                      textAlign: "center",
                                      borderBottom: "1px solid #78818b",
                                    }}
                                  >
                                    <Typography sx={{ fontSize: "0.875rem" }}>
                                      <Trans i18nKey="settings.chooseARole" />
                                    </Typography>
                                  </Box>
                                  {listOfRoles?.map(
                                    (role: any, index: number) => (
                                      <MenuItem
                                        style={{ display: "block" }}
                                        key={role.title}
                                        value={role}
                                        sx={{
                                          paddingY: "0px",
                                          maxHeight: "200px",
                                          ...(role.id === row.role.id && {
                                            backgroundColor: "#9CCAFF",
                                          }),
                                          "&.MuiMenuItem-root:hover": {
                                            ...(role.id === row.role.id
                                              ? {
                                                  backgroundColor: "#9CCAFF",
                                                  color: "#004F83",
                                                }
                                              : {
                                                  backgroundColor: "#EFEDF0",
                                                  color: "#1B1B1E",
                                                }),
                                          },
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            maxWidth: "240px",
                                            color: "#2B333B",
                                            fontSize: "0.875rem",
                                            lineHeight: "21px",
                                            fontWeight: 500,
                                            paddingY: "1rem",
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              fontSize: "0.875rem",
                                              ...(role.id === row.role.id
                                                ? {
                                                    color: "#004F83",
                                                  }
                                                : {
                                                    color: "#1B1B1E",
                                                  }),
                                            }}
                                          >
                                            {role.title}
                                          </Typography>

                                          <div
                                            style={{
                                              color: "#2B333B",
                                              fontSize: "0.875rem",
                                              lineHeight: "21px",
                                              fontWeight: 300,
                                              whiteSpace: "break-spaces",
                                              paddingTop: "1rem",
                                            }}
                                          >
                                            {role.description}
                                          </div>
                                        </Box>
                                        {listOfRoles &&
                                          listOfRoles.length > index + 1 && (
                                            <Box
                                              sx={{
                                                height: "0.5px",
                                                width: "80%",
                                                backgroundColor: "#78818b",
                                                mx: "auto",
                                              }}
                                            ></Box>
                                          )}
                                      </MenuItem>
                                    ),
                                  )}
                                </Select>
                              </Grid>
                            </FormControl>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <IconButton
                                sx={{ "&:hover": { color: "#d32f2f" } }}
                                size="small"
                                onClick={() =>
                                  openRemoveModal(row.email, row.id, true)
                                }
                              >
                                <DeleteRoundedIcon />
                              </IconButton>{" "}
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Box>
  );
};

const SelectionRole = (props: any) => {
  const { row, setChangeData, assessmentId, MenuProps, listOfRoles } = props;
  const { service } = useServiceContext();

  const editUserRole = useQuery({
    service: (args, config) =>
      service.assessments.member.updateUserRole(
        { assessmentId, ...args },
        config,
      ),
    runOnMount: false,
  });

  const handleChange = async (event: any) => {
    try {
      const {
        target: { value, name },
      } = event;
      await editUserRole.query({ userId: name, roleId: value.id });
      setChangeData((prev: boolean) => !prev);
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  return (
    <Select
      value={row.role}
      onChange={handleChange}
      name={row.id}
      MenuProps={MenuProps}
      disabled={!row.editable}
      renderValue={() =>
        editUserRole.loading ? (
          <CircularProgress style={{ color: "#2974b442" }} size="1rem" />
        ) : (
          row?.role?.title
        )
      }
      IconComponent={KeyboardArrowDownIcon}
      sx={{
        width: "100%",
        minWidth: "160px",
        height: "100%",
        boxShadow: "none",
        border: row.editable ? "1px solid #2974B4" : "1px solid #2974b442",
        fontSize: "0.875rem",
        borderRadius: "0.5rem",
        "& .MuiOutlinedInput-notchedOutline": {
          border: 0,
        },
        ".MuiSvgIcon-root": {
          color: "#2974B4",
        },
        "& .MuiSelect-select": {
          padding: "4px 5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Box
        sx={{
          paddingY: "16px",
          color: "#78818b",
          textAlign: "center",
          borderBottom: "1px solid #78818b",
        }}
      >
        <Typography sx={{ fontSize: "0.875rem" }}>
          <Trans i18nKey="settings.chooseARole" />
        </Typography>
      </Box>

      {listOfRoles?.map((role: any, index: number) => (
        <MenuItem
          key={role.id}
          value={role}
          sx={{
            display: "block",
            paddingY: "0px",
            ...(role.id === row.role.id && {
              backgroundColor: "#9CCAFF",
            }),
            "&:hover": {
              backgroundColor: role.id === row.role.id ? "#9CCAFF" : "#EFEDF0",
              color: role.id === row.role.id ? "#004F83" : "#1B1B1E",
            },
          }}
        >
          <Box
            sx={{
              maxWidth: "240px",
              paddingY: "1rem",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: role.id === row.role.id ? "#004F83" : "#1B1B1E",
              }}
            >
              {role.title}
            </Typography>
            <Typography
              sx={{
                color: "#2B333B",
                fontSize: "0.875rem",
                fontWeight: 300,
                paddingTop: "1rem",
                whiteSpace: "break-spaces",
              }}
            >
              {role.description}
            </Typography>
          </Box>
          {listOfRoles.length > index + 1 && (
            <Box
              sx={{
                height: "0.5px",
                width: "80%",
                backgroundColor: "#78818b",
                mx: "auto",
              }}
            />
          )}
        </MenuItem>
      ))}
    </Select>
  );
};

const OnHoverInputTitleSetting = (props: any) => {
  const { assessmentInfo, dispatch } = useAssessmentContext();

  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, type, editable, infoQuery, color } = props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [inputData, setInputData] = useState<string>(data);
  const [inputDataShortTitle, setInputDataShortTitle] = useState<
    string | undefined | null
  >(assessmentInfo?.shortTitle);
  const handleCancel = () => {
    setShow(false);
    setInputData(data);
    setHasError(false);
  };

  useEffect(() => {
    setInputDataShortTitle(assessmentInfo?.shortTitle);
  }, [assessmentInfo?.shortTitle]);
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (type === "title") setInputData(value);
    else setInputDataShortTitle(value);
  };

  const updateAssessmentQuery = useQuery({
    service: (args, config) =>
      service.assessments.info.update(
        args ?? {
          id: assessmentId,
          data: {
            title: inputData,
            shortTitle: inputDataShortTitle === "" ? null : inputDataShortTitle,
            colorId: color?.id ?? 6,
          },
        },
        config,
      ),
    runOnMount: false,
  });
  const updateAssessmentTitle = async () => {
    try {
      const res = await updateAssessmentQuery.query();
      res.message && showToast(res.message, { variant: "success" });
      await infoQuery();
      if (assessmentInfo) {
        dispatch(
          assessmentActions.setAssessmentInfo({
            ...assessmentInfo,
            shortTitle: inputDataShortTitle,
            title: inputData,
          }),
        );
      }
    } catch (e) {
      const err = e as ICustomError;
      setHasError(true);
      if (Array.isArray(err.response?.data?.message)) {
        showToast(err.response?.data?.message[0]);
      } else if (err.response?.data?.hasOwnProperty("message")) {
        showToast(err.response?.data?.message);
      }
    }
  };

  function getTextAlign(type: string, inputData: string, inputDataShortTitle: any) {
    if (type === "title") {
      return firstCharDetector(inputData) ? "right" : "left";
    }
    if (type === "shortTitle") {
      return firstCharDetector(inputDataShortTitle) ? "right" : "left";
    }
    return "left";
  }

  const textAlign = getTextAlign(type, inputData, inputDataShortTitle);

  const inputProps: React.HTMLProps<HTMLInputElement> = {
    style: {
      textAlign
    },
  };

  return (
    <Box>
      <Box
        my={1.5}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          cursor: "pointer",
        }}
        width="100%"
      >
        {editable && show ? (
          <Box
            sx={{ display: "flex", flexDirection: "column", width: "100% " }}
          >
            <InputCustomEditor
              inputProps={inputProps}
              hasError={hasError}
              name={type}
              inputHandler={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
              value={type == "title" ? inputData : inputDataShortTitle}
              handleDone={updateAssessmentTitle}
              handleCancel={handleCancel}
            />
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: "38px",
              borderRadius: "4px",
              paddingLeft: "8px;",
              paddingRight: "12px;",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              wordBreak: "break-word",
            }}
            onClick={() => setShow(!show)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <Typography
              color="#004F83"
              sx={{
                fontFamily: languageDetector(data)
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
              variant="semiBoldLarge"
            >
              {type == "title" && data?.replace(/<\/?p>/g, "")}
              {type == "shortTitle" &&
                assessmentInfo?.shortTitle?.replace(/<\/?p>/g, "")}
            </Typography>
            {(isHovering || !assessmentInfo?.shortTitle) && (
              <EditRoundedIcon
                sx={{ color: "#78818b", position: "absolute", right: -10 }}
                fontSize="small"
                width={"32px"}
                height={"32px"}
                onClick={() => setShow(!show)}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
