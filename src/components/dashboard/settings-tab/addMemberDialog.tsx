import { useEffect, useRef, useState } from "react";
import { useServiceContext } from "@/providers/service-provider";
import { useParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery";
import FormControl from "@mui/material/FormControl";
import { ICustomError } from "@/utils/custom-error";
import { SelectHeight } from "@/utils/select-height";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import FormProviderWithForm from "@common/FormProviderWithForm";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "@common/fields/AutocompleteAsyncField";
import LoadingButton from "@mui/lab/LoadingButton";
import useScreenResize from "@/hooks/useScreenResize";
import Settings from "@mui/icons-material/Settings";
import showToast from "@/utils/toast-error";
import { CEDialog } from "@/components/common/dialogs/CEDialog";
import { useTheme } from "@mui/material";
import { AxiosRequestConfig } from "axios";
import { Text } from "@/components/common/Text";

export enum EUserInfo {
  "NAME" = "displayName",
  "EMAIL" = "email",
}
export enum EUserType {
  "DEFAULT" = "default",
  "NONE" = "none",
  "EXISTED" = "existed",
}

const AddMemberDialog = (props: {
  expanded: boolean;
  onClose: () => void;
  setChangeData?: any;
  cancelText: any;
  confirmText: any;
  listOfRoles: any[];
  assessmentId: any;
}) => {
  const theme = useTheme();
  const {
    expanded,
    onClose,
    cancelText,
    confirmText,
    setChangeData,
    listOfRoles = [],
    assessmentId,
  } = props;

  const [addedEmailType, setAddedEmailType] = useState<string>(
    EUserType.DEFAULT,
  );
  const [memberOfSpace, setMemberOfSpace] = useState<any[]>([]);
  const [memberSelectedId, setMemberSelectedId] = useState<any>("");
  const [memberSelectedEmail, setMemberSelectedEmail] = useState<any>("");
  const [roleSelected, setRoleSelected] = useState({ id: 0, title: "Viewer" });
  const { service } = useServiceContext();
  const { spaceId = "" } = useParams();

  const inviteMemberToAssessment = useQuery({
    service: (args, config) =>
      service.assessments.member.inviteUser(args, config),
    runOnMount: false,
  });

  const spaceMembersQueryData = useQuery({
    service: (args, config) =>
      service.space.getMembers({ spaceId, page: 0, size: 100 }, config),
  });
  const fetchAssessmentMembers = useQuery({
    service: (args?: any, config?: AxiosRequestConfig) => {
      const { page = 0, size = 10 } = args ?? {};
      return service.assessments.member.getUsers(
        { assessmentId, page, size },
        config,
      );
    },
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const addRoleMemberQueryData = useQuery({
    service: (args, config) =>
      service.assessments.member.assignUserRole(
        args ?? {
          assessmentId,
          userId: memberSelectedId,
          roleId: roleSelected.id,
        },
        config,
      ),
    runOnMount: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChangeRole = (event: any) => {
    const {
      target: {
        value: { id, title },
      },
    } = event;
    setRoleSelected({ id, title });
  };

  const loadMembers = async () => {
    try {
      setAddedEmailType(EUserType.DEFAULT);

      const { data } = spaceMembersQueryData;
      const result = await fetchAssessmentMembers.query({
        page: 0,
        size: 100,
      });

      const member = result?.items ?? [];
      const spaceItems = data?.items ?? [];

      if (!spaceItems.length) {
        setMemberOfSpace([]);
        return;
      }

      const filteredItem = spaceItems.filter((item: any) =>
        member.some((userListItem: any) => item.id === userListItem.id),
      );

      setMemberOfSpace(filteredItem);
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  useEffect(() => {
    if (!expanded) return;
    loadMembers();
  }, [expanded]);

  const closeDialog = () => {
    onClose();
    setMemberSelectedId("");
    setRoleSelected({ id: 0, title: "Viewer" });
  };

  const onConfirm = async (e: any) => {
    try {
      addedEmailType === EUserType.NONE
        ? await inviteMemberToAssessment.query({
            email: memberSelectedEmail,
            assessmentId,
            roleId: roleSelected.id,
          })
        : await addRoleMemberQueryData.query();
      setChangeData((prev: boolean) => !prev);
      closeDialog();
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };
  const handleClick = async (e: any) => {
    setLoading(true);
    try {
      await onConfirm(e);
    } finally {
      setLoading(false);
    }
  };
  const ITEM_HEIGHT = 59;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = SelectHeight(ITEM_HEIGHT, ITEM_PADDING_TOP);

  const formMethods = useForm({ shouldUnregister: true });
  useEffect(() => {
    const updateMemberSelected = async () => {
      try {
        const emailValue = await formMethods.getValues("email");
        setMemberSelectedEmail(emailValue?.email);
        if (emailValue?.id) {
          setMemberSelectedId(emailValue?.id);
          if (addedEmailType !== EUserType.EXISTED) {
            setAddedEmailType(EUserType.DEFAULT);
          }
        }
      } catch (error) {
        console.error("Failed to get form value", error);
      }
    };

    updateMemberSelected();
  }, [formMethods.watch("email")]);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const handleEnterKeyDown = (event: any) => {
      if (event.key === "Enter" && buttonRef.current) {
        const openDropdowns = document.querySelectorAll(
          ".MuiAutocomplete-option",
        );
        if (openDropdowns.length === 0) {
          buttonRef.current.click();
        }
      }
    };

    window.addEventListener("keydown", handleEnterKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleEnterKeyDown, true);
    };
  }, []);
  const fullScreen = useScreenResize("sm");

  return (
    <CEDialog
      open={expanded}
      closeDialog={closeDialog}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      title={
        <>
          <Settings
            sx={{
              marginInlineStart: "unset",
              scrollMarginInlineEnd: 1,
            }}
          />
          <Trans i18nKey="settings.assignRole" />
        </>
      }
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent={"flex-start"}
        px={3}
        sx={{ gap: { xs: "0rem", sm: "1rem" } }}
        width="100%"
        mt={1}
      >
        <Text sx={{ whiteSpace: "noWrap" }}>
          <Trans i18nKey="common.add" />
        </Text>
        <Box width="50%">
          <FormProviderWithForm formMethods={formMethods}>
            <EmailField
              memberOfSpace={memberOfSpace}
              setAddedEmailType={setAddedEmailType}
            />
          </FormProviderWithForm>
        </Box>
        <Text sx={{ whiteSpace: "nowrap" }}>
          <Trans i18nKey="common.as" />
        </Text>
        <FormControl sx={{ width: "40%" }}>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            value={roleSelected?.title}
            displayEmpty
            onChange={handleChangeRole}
            sx={{
              height: "40px",
            }}
            IconComponent={KeyboardArrowDownIcon}
            inputProps={{
              renderValue: () =>
                roleSelected?.title == "" ? (
                  <Box
                    sx={{
                      color: "#6C7B8E",
                      fontSize: "0.6rem",
                      textAlign: "left",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Trans i18nKey="settings.chooseARole" />
                  </Box>
                ) : (
                  roleSelected.title
                ),
            }}
            MenuProps={MenuProps}
          >
            <Box
              sx={{
                paddingY: "16px",
                color: "#9DA7B3",
                textAlign: "center",
                borderBottom: "1px solid #9DA7B3",
              }}
            >
              <Text sx={{ fontSize: "0.875rem" }}>
                <Trans i18nKey="settings.chooseARole" />
              </Text>
            </Box>
            {listOfRoles?.map((role: any, index: number) => {
              return (
                <MenuItem
                  style={{ display: "block" }}
                  key={role.title}
                  value={role}
                  id={role.id}
                  sx={{
                    "&.MuiMenuItem-root:hover": {
                      ...(roleSelected?.title == role.title
                        ? {
                            backgroundColor: "#9CCAFF",
                            color: "#004F83",
                          }
                        : {
                            backgroundColor: "#EFEDF0",
                            color: "#1B1B1E",
                          }),
                    },
                    bgcolor: roleSelected?.title == role.title ? "#9CCAFF" : "",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "240px",
                      color: "text.primary",
                      fontSize: "0.875rem",
                      lineHeight: "21px",
                      fontWeight: 500,
                      paddingY: "1rem",
                    }}
                  >
                    <Text>{role.title}</Text>
                    <div
                      style={{
                        color: theme.palette.text.primary,
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
                        backgroundColor: "#9DA7B3",
                        mx: "auto",
                      }}
                    ></Box>
                  )}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      {addedEmailType !== EUserType.DEFAULT && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            backgroundColor: "rgba(255, 249, 196, 0.31)",
            padding: 1,
            borderRadius: 2,
            marginInline: 3,
            maxWidth: "100%",
          }}
        >
          <InfoOutlinedIcon
            color="primary"
            sx={{
              marginInlineStart: "unset",
              marginInlineEnd: 1,
            }}
          />
          <Text variant="bodyLarge">
            {addedEmailType === EUserType.EXISTED ? (
              <Trans i18nKey="user.emailExistsInApp" />
            ) : (
              <Trans i18nKey="user.emailDoesNotExistInApp" />
            )}
          </Text>
        </Box>
      )}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: 2,
          padding: "16px",
          justifyContent: "flex-end",
        }}
      >
        <Button onClick={closeDialog}>{cancelText}</Button>
        <LoadingButton
          variant="contained"
          onClick={handleClick}
          loading={loading}
          ref={buttonRef}
        >
          {confirmText}
        </LoadingButton>
      </Box>
    </CEDialog>
  );
};
const EmailField = ({
  memberOfSpace,
  setAddedEmailType,
}: {
  memberOfSpace: any;
  setAddedEmailType: any;
}) => {
  const { service } = useServiceContext();
  const { spaceId = "" } = useParams();
  const queryData = useConnectAutocompleteField({
    service: (args, config) =>
      service.space.getMembers({ spaceId, page: 0, size: 100 }, config),
    accessor: "items",
  });
  const loadUserByEmail = useQuery({
    service: (args, config) => service.user.getByEmail(args, config),
    runOnMount: false,
  });

  const [error, setError] = useState(undefined);

  const createItemQuery = async (inputValue: any) => {
    try {
      setError(undefined);
      const response = await loadUserByEmail.query({ email: inputValue });
      response.id
        ? setAddedEmailType(EUserType.EXISTED)
        : setAddedEmailType(EUserType.NONE);
      const newOption = { email: inputValue, id: response.id };
      return newOption;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  useEffect(() => {
    setAddedEmailType(EUserType.DEFAULT);
  }, [error]);

  return (
    <Box mt={error ? "20px" : "0px"}>
      <AutocompleteAsyncField
        {...queryData}
        name={EUserInfo.EMAIL}
        required={true}
        label={<Trans i18nKey="user.email" />}
        data-cy={EUserInfo.EMAIL}
        hasAddBtn={true}
        filterFields={[EUserInfo.EMAIL, EUserInfo.NAME]}
        filterOptionsByProperty={(option: any) =>
          !option.isOwner &&
          !memberOfSpace.some(
            (userListItem: any) => option.id === userListItem.id,
          )
        }
        createItemQuery={createItemQuery}
        errorObject={error}
        setError={setError}
        searchable={false}
      />
    </Box>
  );
};

export default AddMemberDialog;
