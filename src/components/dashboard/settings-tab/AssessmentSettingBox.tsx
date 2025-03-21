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
import { toast } from "react-toastify";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import firstCharDetector from "@utils/firstCharDetector";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
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
import formatDate from "@utils/formatDate";
import { Link } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { SelectHeight } from "@utils/selectHeight";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import uniqueId from "@/utils/uniqueId";
import languageDetector from "@/utils/languageDetector";
import TablePagination from "@mui/material/TablePagination";
import { t } from "i18next";

export const AssessmentSettingGeneralBox = (props: {
  AssessmentInfo: any;
  AssessmentInfoQuery: any;
  AssessmentTitle: string;
  fetchPathInfo: () => void;
  color: any;
}) => {
  const {
    AssessmentInfo,
    AssessmentInfoQuery,
    AssessmentTitle,
    fetchPathInfo,
    color,
  } = props;
  const {
    createdBy: { displayName },
    creationTime,
    lastModificationTime,
    kit,
    shortTitle,
  } = AssessmentInfo;

  const title = ["creator", "assessmentKit", "created", "lastModified"];
  const formMethods = useForm({ shouldUnregister: true });

  return (
    <Box
      sx={{
        ...styles.boxStyle,
      }}
      gap={2}
    >
      <Box height={"100%"} width={"100%"}>
        <Typography
          sx={{
            width: "100%",
            display: "inline-block",
          }}
          color="#2B333B"
          variant="headlineMedium"
        >
          <Trans i18nKey="general" />
        </Typography>

        <Divider
          sx={{
            width: "100%",
            marginTop: "24px",
            marginBottom: "10px !important",
          }}
        />
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
            <Typography
              sx={{
                ...theme.typography.titleLarge,
                fontSize: { xs: "1rem", sm: "1.375rem" },
                whiteSpace: { xs: "wrap", sm: "nowrap" },
                color: "#78818b",
                width: "250px",
              }}
            >
              <Trans i18nKey="assessmentTitle" />:
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
                shortTitle={shortTitle}
                infoQuery={fetchPathInfo}
                AssessmentInfoQuery={AssessmentInfoQuery}
                editable={true}
                color={color}
                type={"title"}
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
              <Typography
                color="#78818b"
                fontWeight={500}
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "6px",
                  fontSize: { xs: "1rem", sm: "1.375rem" },
                  whiteSpace: { xs: "wrap", sm: "nowrap" },
                  width: "250px",
                }}
                lineHeight={"normal"}
              >
                <Trans i18nKey="shortTitle" />:
              </Typography>
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
                  shortTitle={shortTitle}
                  infoQuery={fetchPathInfo}
                  AssessmentInfoQuery={AssessmentInfoQuery}
                  editable={true}
                  color={color}
                  type={"shortTitle"}
                  displayEdit={!shortTitle}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "5px",
                  color: "#78818b",
                  ...theme.typography.labelMedium,
                }}
              >
                <InfoOutlined fontSize="small" />
                <Trans i18nKey={"shortTitleInfo"} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Divider
          sx={{ width: "100%", marginBottom: "24px", marginTop: "10px" }}
        />
        <Grid container spacing={2} sx={{ ...styles.centerH }}>
          {title.map((itemList: string, index: number) => {
            return (
              <Grid
                key={uniqueId()}
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
                  color="#78818b"
                  fontWeight={500}
                  whiteSpace={"nowrap"}
                  sx={{
                    width: "250px",
                    display: "flex",
                    justifyContent: "flex-start",
                    fontSize: { xs: "1rem", md: "1.375rem" },
                  }}
                  lineHeight={"normal"}
                >
                  <Trans i18nKey={`${itemList}`} />:
                </Typography>

                <Typography
                  color="#0A2342"
                  fontWeight={500}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    fontSize: { xs: "1rem", md: "1.375rem" },
                    width: { md: "350px" },
                  }}
                  lineHeight={"normal"}
                >
                  {index == 0 && displayName}
                  {index == 1 && (
                    <Link
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        fontFamily: languageDetector(kit.title)
                          ? farsiFontFamily
                          : primaryFontFamily,
                      }}
                      to={`/assessment-kits/${kit.id}`}
                    >
                      {kit.title}
                    </Link>
                  )}
                  {index == 2 &&
                    (theme.direction == "rtl"
                      ? formatDate(creationTime, "Shamsi")
                      : formatDate(creationTime, "Miladi"))}
                  {index == 3 &&
                    (theme.direction == "rtl"
                      ? formatDate(lastModificationTime, "Shamsi")
                      : formatDate(lastModificationTime, "Miladi"))}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </Box>
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
    service: (args, config) => service.editUserRoleInvited(args, config),
    runOnMount: false,
  });

  const columns: readonly Column[] = [
    { id: "displayName", label: "name", minWidth: "24%", position: "center" },
    {
      id: "email",
      label: "email",
      minWidth: "0%",
      display: "none",
      position: "center",
    },
    {
      id: "role",
      label: "role",
      minWidth: "22%",
      position: "start",
    },
  ];

  const inviteesColumns: readonly Column[] = [
    {
      id: "email",
      label: "email",
      minWidth: "30vw",
      position: "center",
    },
    {
      id: "role",
      label: "role",
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
      const { id } = name;
      await editUserRoleInvited.query({ id, roleId });
      setChangeData((prev: boolean) => !prev);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const ITEM_HEIGHT = 59;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = SelectHeight(ITEM_HEIGHT, ITEM_PADDING_TOP);

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
          <Typography color="#2B333B" variant="headlineMedium">
            <Trans i18nKey="grantedRoles" />
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
            <Trans i18nKey={"grantAccess"} />
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
                  justifyContent: "space-between",
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
                              label={<Trans i18nKey={"owner"} />}
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
                          width: { xs: "10.1rem", md: "20vw" },
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
                                <Trans i18nKey="spaceOwnerRoleIsNotEditable" />
                              }
                            >
                              <SelectionRole
                                row={row}
                                listOfRoles={listOfRoles}
                                MenuProps={MenuProps}
                                setChangeData={setChangeData}
                                assessmentId={assessmentId}
                              />
                            </Tooltip>
                          </Grid>
                        </FormControl>
                        <Tooltip
                          disableHoverListener={row.editable}
                          title={
                            <Trans i18nKey="spaceOwnerRoleIsNotEditable" />
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
          labelRowsPerPage={t("rowsPerPage")}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to}  ${t("of")} ${count !== -1 ? count : `${t("moreThan")} ${to}`}`
          }
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
              <Typography color="#78818b" variant="headlineMedium">
                <Trans i18nKey={`invitees`} />
              </Typography>
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
                      display: "inline-flex",
                      justifyContent: "center",
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
                  <Divider sx={{ width: "100%" }} />
                </TableHead>
                <TableBody>
                  {inviteesMemberList?.data?.items.map((row: any) => {
                    return (
                      <TableRow tabIndex={-1} key={row.id}>
                        <TableCell
                          sx={{
                            display: "flex",
                            justifyContent: "center",
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
                              width: { xs: "10rem", md: "28vw" },
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
                                  name={row}
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
                                      <Trans i18nKey={"chooseARole"} />
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

  const handleChange = async (event: any) => {
    try {
      const {
        target: { value, name },
      } = event;
      const { id: roleId } = value;
      const { id: userId } = name;
      await editUserRole.query({ userId, roleId });
      setChangeData((prev: boolean) => !prev);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const editUserRole = useQuery({
    service: (args, config) =>
      service.editUserRole({ assessmentId, ...args }, config),
    runOnMount: false,
  });
  return (
    <Select
      labelId="demo-multiple-name-label"
      id="demo-multiple-name"
      value={row?.role?.title}
      onChange={handleChange}
      name={row}
      MenuProps={MenuProps}
      sx={{
        width: "100%",
        height: "100%",
        boxShadow: "none",
        ".MuiOutlinedInput-notchedOutline": {
          border: 0,
        },
        border: editUserRole.loading
          ? "1px solid #2974b442"
          : row.editable
            ? "1px solid #2974B4"
            : "1px solid #2974b442",
        fontSize: "0.875rem",
        borderRadius: "0.5rem",
        "&.MuiOutlinedInput-notchedOutline": {
          border: 0,
        },
        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          border: 0,
        },
        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            border: 0,
          },
        ".MuiSvgIcon-root": {
          fill: editUserRole.loading
            ? "1px solid #2974b442"
            : row.editable
              ? "1px solid #2974B4"
              : "1px solid #2974b442",
        },
        "& .MuiSelect-select": {
          padding: "4px 5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
      IconComponent={KeyboardArrowDownIcon}
      inputProps={{
        renderValue: () =>
          editUserRole.loading ? (
            <CircularProgress style={{ color: "#2974b442" }} size="1rem" />
          ) : (
            row?.role?.title
          ),
      }}
      disabled={!row.editable}
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
          <Trans i18nKey={"chooseARole"} />
        </Typography>
      </Box>
      {listOfRoles?.map((role: any, index: number) => (
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
          {listOfRoles && listOfRoles.length > index + 1 && (
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
      ))}
    </Select>
  );
};

const OnHoverInputTitleSetting = (props: any) => {
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const {
    data,
    shortTitle,
    type,
    editable,
    infoQuery,
    color,
    AssessmentInfoQuery,
    displayEdit,
  } = props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [inputData, setInputData] = useState<string>(data);
  const [inputDataShortTitle, setInputDataShortTitle] =
    useState<string>(shortTitle);
  const handleCancel = () => {
    setShow(false);
    setInputData(data);
    setHasError(false);
  };
  const { assessmentId } = useParams();
  const { service } = useServiceContext();
  const updateAssessmentQuery = useQuery({
    service: (args, config) =>
      service.updateAssessment(
        args ?? {
          id: assessmentId,
          data: {
            title: inputData,
            shortTitle: inputDataShortTitle === "" ? null : inputDataShortTitle,
            colorId: color?.id || 6,
          },
        },
        config,
      ),
    runOnMount: false,
  });
  const updateAssessmentTitle = async () => {
    try {
      const res = await updateAssessmentQuery.query();
      res.message && toast.success(res.message);
      await infoQuery();
      await AssessmentInfoQuery();
    } catch (e) {
      const err = e as ICustomError;
      setHasError(true);
      if (Array.isArray(err.response?.data?.message)) {
        toastError(err.response?.data?.message[0]);
      } else if (err.response?.data?.hasOwnProperty("message")) {
        toastError(err.response?.data?.message);
      }
    }
  };
  const inputProps: React.HTMLProps<HTMLInputElement> = {
    style: {
      textAlign:
        type == "title"
          ? firstCharDetector(inputData)
            ? "right"
            : "left"
          : type == "shortTitle"
            ? firstCharDetector(inputDataShortTitle)
              ? "right"
              : "left"
            : "left",
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
            <OutlinedInput
              inputProps={inputProps}
              error={hasError}
              fullWidth
              defaultValue={
                type == "title" ? inputData : inputDataShortTitle || ""
              }
              onChange={(e) =>
                type == "title"
                  ? setInputData(e.target.value)
                  : setInputDataShortTitle(e.target.value)
              }
              value={type == "title" ? inputData : inputDataShortTitle}
              required={true}
              multiline={true}
              sx={{
                minHeight: "38px",
                borderRadius: "4px",
                paddingRight: "12px;",
                fontWeight: "700",
                fontSize: "0.875rem",
                "&.MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.MuiOutlinedInput-root:hover": {
                  border: 0,
                  outline: "none",
                },
                "& .MuiOutlinedInput-input:focused": {
                  border: 0,
                  outline: "none",
                },
                "&.MuiOutlinedInput-root.Mui-selected": {
                  border: 0,
                  outline: "none",
                },
                "&:hover": { border: "1px solid #79747E" },
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    title="Submit Edit"
                    edge={theme.direction == "rtl" ? "start" : "end"}
                    sx={{
                      background: "#49CED0",
                      borderRadius: "2px",
                      height: { xs: "26px", sm: "36px" },
                      width: { xs: "26px", sm: "36px" },
                      margin: "3px",
                    }}
                    onClick={updateAssessmentTitle}
                  >
                    <DoneIcon sx={{ color: "#fff" }} />
                  </IconButton>
                  <IconButton
                    title="Cancel Edit"
                    edge={theme.direction == "rtl" ? "start" : "end"}
                    sx={{
                      background: "#E04B7C",
                      borderRadius: "2px",
                      height: { xs: "26px", sm: "36px" },
                      width: { xs: "26px", sm: "36px" },
                    }}
                    onClick={handleCancel}
                  >
                    <CloseIcon sx={{ color: "#fff" }} />
                  </IconButton>
                </InputAdornment>
              }
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
              fontWeight={500}
              sx={{
                fontSize: { xs: "1rem", sm: "1.375rem" },
                fontFamily: languageDetector(data)
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
              lineHeight={"normal"}
            >
              {type == "title" && data?.replace(/<\/?p>/g, "")}
              {type == "shortTitle" && shortTitle?.replace(/<\/?p>/g, "")}
            </Typography>
            {(isHovering || displayEdit) && (
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
