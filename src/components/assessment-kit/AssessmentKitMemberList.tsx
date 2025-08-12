import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Grid from "@mui/material/Grid";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { styles } from "@styles";
import { useForm } from "react-hook-form";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { ICustomError } from "@utils/CustomError";
import { t } from "i18next";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@utils/stringAvatar";
import showToast from "@utils/toastError";

const tableCellStyles = {
  minWidth: {
    xs: "12rem",
    sm: "16rem",
    md: "20vw",
  },
  textAlign: { xs: "left", md: "center" },
  display: { xs: "none", md: "inline-block" },
  color: "#9DA7B3",
  fontSize: "1rem",
};

const avatarStyles = {
  width: 40,
  height: 40,
  display: { xs: "none", sm: "flex" },
};

const chipStyles = {
  marginRight: document.dir === "ltr" ? 1 : "unset",
  marginLeft: document.dir === "rtl" ? 1 : "unset",
  opacity: 0.7,
  color: "#9A003C",
  borderColor: "#9A003C",
};

const textStyles = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  fontSize: "0.875rem",
  color: "#1B1B1E",
  fontWeight: 500,
};

const deleteButtonStyles = {
  "&:hover": { color: "#d32f2f" },
};

export default function MemberList(props: any) {
  const { title, btnLabel, listOfUser, columns, query, hasBtn } = props;
  const { openEGModal, setOpenEGModal, deleteEGMember, onCloseEGModal } =
    useEGPermision({ query });

  return (
    <Box
      alignItems="flex-start"
      px={{ xs: "15px", sm: "51px" }}
      mb={4}
      gap={2}
      textAlign="center"
      height="auto"
      minHeight="350px"
      width="100%"
      bgcolor="background.containerLowest"
      borderRadius={2}
      py={4}
      sx={{ ...styles.centerH }}
    >
      <Box height="100%" width="100%">
        <Box
          width="100%"
          justifyContent="space-between"
          sx={{ ...styles.centerV }}
        >
          <div></div>
          <Typography color="#9DA7B3" variant="headlineMedium">
            <Trans i18nKey={title} />
          </Typography>
          {hasBtn && (
            <Button
              variant="contained"
              onClick={() => setOpenEGModal(true)}
              sx={{
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <AddIcon fontSize="small" />
              <Trans i18nKey={btnLabel} />
            </Button>
          )}
        </Box>
        <Divider sx={{ width: "100%", marginTop: "24px" }} />
        <TableContainer
          sx={{ maxHeight: 840, "&::-webkit-scrollbar": { display: "none" } }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{
                width: "100%",
                overflow: "hidden",
                position: "sticky",
                top: 0,
                zIndex: 3,
                backgroundColor: "background.containerLowest",
              }}
            >
              <TableRow
                sx={{
                  display: "inline",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {columns.map((column: any) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={tableCellStyles}
                  >
                    <Trans i18nKey={`${column.label}`} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listOfUser.length > 0 &&
                listOfUser.map((row: any) => (
                  <TableRow
                    key={row.id}
                    sx={{ bgcolor: !row.editable ? "#ebe8e85c" : "" }}
                  >
                    <TableCell
                      sx={{
                        ...styles.centerV,
                        justifyContent: "space-evenly",
                        border: "none",
                        gap: { xs: "0px", md: "1.3rem" },
                        paddingX: { xs: "0px", md: "1rem" },
                      }}
                    >
                      <UserInfoCell row={row} />
                      <Box
                        display={{ xs: "none", md: "flex" }}
                        justifyContent="center"
                        width={{ xs: "10rem", sm: "14rem", md: "20vw" }}
                      >
                        <Typography sx={textStyles}>{row.email}</Typography>
                      </Box>
                      <Box
                        width={{ xs: "10rem", sm: "14rem", md: "20vw" }}
                        sx={{ ...styles.centerH }}
                      >
                        <DeleteActionCell
                          row={row}
                          deleteEGMember={deleteEGMember}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider sx={{ width: "100%", marginBlock: "24px" }} />
      </Box>
      {openEGModal && (
        <AddMemberModal
          query={query}
          open={openEGModal}
          close={onCloseEGModal}
        />
      )}
    </Box>
  );
}

const UserInfoCell = ({ row }: any) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-start",
      minWidth: { xs: "10rem", sm: "14rem", md: "20vw" },
      width: { xs: "10rem", sm: "14rem", md: "20vw" },
    }}
  >
    <Box
      justifyContent="flex-start"
      gap={1}
      paddingLeft={{ lg: "30%" }}
      sx={{ ...styles.centerV }}
    >
      <Avatar
        {...stringAvatar(
          row?.displayName
            ? row?.displayName.toUpperCase()
            : row?.name.toUpperCase(),
        )}
        src={row.pictureLink}
        sx={avatarStyles}
      />
      <Typography sx={textStyles}>{row.displayName ?? row.name}</Typography>
      {!row.editable && (
        <Chip
          sx={chipStyles}
          label={<Trans i18nKey="common.owner" />}
          size="small"
          variant="outlined"
        />
      )}
    </Box>
  </Box>
);

const DeleteActionCell = ({ row, deleteEGMember }: any) => (
  <Box
    justifyContent="flex-start"
    gap={{ xs: "0px", md: ".7rem" }}
    sx={{ ...styles.centerV }}
  >
    <Tooltip
      disableHoverListener={row.editable}
      title={<Trans i18nKey="spaces.spaceOwnerRoleIsNotEditable" />}
    >
      <Box width="30%" sx={{ ...styles.centerVH }}>
        <IconButton
          sx={deleteButtonStyles}
          size="small"
          disabled={!row.editable}
          onClick={() => deleteEGMember(row.id)}
        >
          <DeleteRoundedIcon />
        </IconButton>
      </Box>
    </Tooltip>
  </Box>
);

const useEGPermision = (props: any) => {
  const { query } = props;

  const [openEGModal, setOpenEGModal] = useState(false);

  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();

  const deleteMemberToKitPermissionQueryData = useQuery({
    service: (args, config) =>
      service.assessmentKit.member.remove(args, config),
    runOnMount: false,
  });
  const deleteEGMember = async (id: any) => {
    try {
      await deleteMemberToKitPermissionQueryData.query({
        assessmentKitId: assessmentKitId,
        userId: id,
      });
      await query.query();
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const onCloseEGModal = () => {
    setOpenEGModal(false);
  };

  return { onCloseEGModal, deleteEGMember, openEGModal, setOpenEGModal };
};

const AddMemberModal = (props: any) => {
  const { close, query, ...rest } = props;
  const formMethods = useForm({ shouldUnregister: true });
  const inputRef = useRef<HTMLInputElement>(null);
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();

  const addMemberQueryData = useQuery({
    service: (args, config) => service.assessmentKit.member.add(args, config),
    runOnMount: false,
  });
  const onSubmit = async () => {
    try {
      const res = await addMemberQueryData.query({
        assessmentKitId: assessmentKitId,
        email: inputRef.current?.value,
      });
      res?.message && showToast(res.message, { variant: "success" });
      await query.query();
      close();
    } catch (e) {
      const error = e as ICustomError;
      close();
      if (error?.response?.data.hasOwnProperty("message")) {
        if (Array.isArray(error.response?.data?.message)) {
          showToast(error.response?.data?.message[0]);
        } else {
          showToast(error);
        }
      }
    }
  };

  return (
    <CEDialog
      {...rest}
      fullScreen={false}
      closeDialog={close}
      title={
        <>
          <PersonAddIcon sx={{ mr: 1 }} />
          <Trans i18nKey="expertGroups.addMember" />
        </>
      }
    >
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container spacing={2} sx={styles.formGrid}>
          <Grid item xs={12}>
            <AddMember inputRef={inputRef} queryData={query} />
          </Grid>
        </Grid>
        <CEDialogActions
          closeDialog={close}
          loading={addMemberQueryData.loading}
          type="submit"
          onSubmit={formMethods.handleSubmit(onSubmit)}
          submitButtonLabel={"common.add"}
        />
      </FormProviderWithForm>
    </CEDialog>
  );
};
const AddMember = (props: any) => {
  const { inputRef } = props;
  return (
    <Box component="form" mb={2} mt={0}>
      <TextField
        fullWidth
        type="email"
        size="small"
        variant="outlined"
        inputRef={inputRef}
        placeholder={t("user.enterEmailOfTheUserYouWantToAdd") as string}
        label={<Trans i18nKey="user.userEmail" />}
      />
    </Box>
  );
};
