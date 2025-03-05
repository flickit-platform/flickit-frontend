import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import zip from "@assets/svg/ZIP.svg";
import txt from "@assets/svg/TXT.svg";
import gif from "@assets/svg/GIF.svg";
import png from "@assets/svg/PNG.svg";
import bpm from "@assets/svg/BMP.svg";
import jpeg from "@assets/svg/JPEG.svg";
import doc from "@assets/svg/DOC.svg";
import docx from "@assets/svg/DOCX.svg";
import xls from "@assets/svg/XSL.svg";
import rar from "@assets/svg/RAR.svg";
import xtar from "@assets/svg/TAR.svg";
import { Trans } from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";
import { useServiceContext } from "@providers/ServiceProvider";
import { ICustomError } from "@utils/CustomError";
import DialogTitle from "@mui/material/DialogTitle";
import toastError from "@utils/toastError";
import { t } from "i18next";
import { useQuery } from "@utils/useQuery";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import UploadIcon from "@/assets/svg/UploadIcon.svg";
import TextField from "@mui/material/TextField";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import FileType from "@components/questions/iconFiles/fileType";
import { AcceptFile } from "@utils/acceptFile";

const checkTypeUpload = (
  dropZoneData: any,
  setDisplayFile: any,
  setTypeFile: any,
) => {
  if (!dropZoneData || dropZoneData.length === 0) return;

  const file = dropZoneData[0];
  const fileType = file.type;
  setDisplayFile(URL.createObjectURL(file) && fileType);

  const typeMapping = {
    "application/pdf": "pdf",
    "application/zip": "zip",
    "text/plain": "txt",
    "application/msword": "doc",
    "application/x-rar-compressed": "xrar",
    "application/x-tar": "xtar",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.oasis.opendocument.spreadsheet": "ods",
  } as any;

  if (fileType.startsWith("image")) {
    setTypeFile(fileType.split("/")[1]);
  } else if (typeMapping[fileType]) {
    setTypeFile(typeMapping[fileType]);
  }
};

const DropZoneArea = (props: any) => {
  const { setDropZone, MAX_SIZE, children } = props;
  return (
    <Dropzone
      accept={{
        ...AcceptFile,
      }}
      onDrop={(acceptedFiles) => {
        if (acceptedFiles[0]?.size && acceptedFiles[0]?.size > MAX_SIZE) {
          return toast(t("uploadAcceptableSize"), { type: "error" });
        }
        if (acceptedFiles?.length && acceptedFiles.length >= 1) {
          setDropZone(acceptedFiles);
        } else {
          return toast(t("thisFileNotAcceptable"), { type: "error" });
        }
      }}
    >
      {children}
    </Dropzone>
  );
};

const MyDropzone = (props: any) => {
  const { setDropZone, dropZoneData } = props;
  const [displayFile, setDisplayFile] = useState<string | null>(null);
  const [typeFile, setTypeFile] = useState<string | null>(null);
  const MAX_SIZE = 2097152;

  useEffect(() => {
    checkTypeUpload(dropZoneData, setDisplayFile, setTypeFile);
  }, [dropZoneData]);

  const theme = useTheme();

  const fileTypeImages: Record<string, string> = {
    gif: gif,
    png: png,
    bpm: bpm,
    jpeg: jpeg,
    jpg: jpeg,
    pdf: "",
    zip: zip,
    plain: txt,
    xrar: rar,
    docx: docx,
    doc: doc,
    xlsx: xls,
    ods: xls,
    xtar: xtar,
  };

  return (
    <DropZoneArea setDropZone={setDropZone} MAX_SIZE={MAX_SIZE}>
      {({ getRootProps, getInputProps }: any) =>
        dropZoneData ? (
          <Box
            sx={{
              height: "199px",
              maxWidth: "280px",
              mx: "auto",
              width: "100%",
              border: "1px solid #C4C7C9",
              borderRadius: "32px",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Button
              sx={{
                position: "absolute",
                top: "3px",
                right: "3px",
                cursor: "pointer",
                fontSize: "13px",
              }}
              onClick={() => setDropZone(null)}
            >
              <Trans i18nKey={"remove"} />
            </Button>

            {typeFile === "pdf" ? (
              <section style={{ width: "50%", height: "70%" }}>
                <FileType />
              </section>
            ) : (
              fileTypeImages[typeFile || ""] && (
                <img
                  style={{ width: "40%", height: "60%" }}
                  src={displayFile ? fileTypeImages[typeFile || ""] : "#"}
                  alt={`${typeFile} file`}
                />
              )
            )}

            <Typography sx={{ ...theme.typography.titleMedium }}>
              {dropZoneData[0]?.name?.length > 14
                ? dropZoneData[0]?.name?.substring(0, 10) +
                  "..." +
                  dropZoneData[0]?.name?.substring(
                    dropZoneData[0]?.name?.lastIndexOf("."),
                  )
                : dropZoneData[0]?.name}
            </Typography>
          </Box>
        ) : (
          <section style={{ cursor: "pointer" }}>
            <Box
              sx={{
                height: "199px",
                maxWidth: "280px",
                mx: "auto",
                width: "100%",
                border: "1px solid #C4C7C9",
                borderRadius: "12px",
              }}
            >
              <div
                {...getRootProps()}
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "20px 0px",
                }}
              >
                <input {...getInputProps()} />
                <img
                  alt="upload"
                  src={UploadIcon}
                  style={{ width: "80px", height: "80px" }}
                />
                <Typography
                  sx={{
                    ...theme.typography.titleMedium,
                    color: "#243342",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Trans i18nKey={"dragYourFile"} />
                  <Typography
                    sx={{ ...theme.typography.titleMedium, color: "#205F94" }}
                  >
                    <Trans i18nKey={"locateIt"} />
                  </Typography>
                </Typography>
              </div>
            </Box>
          </section>
        )
      }
    </DropZoneArea>
  );
};

export const EvidenceAttachmentsDialogs = (props: any) => {
  const {
    expanded,
    onClose,
    uploadAttachment,
    uploadAnother,
    evidenceId,
    evidencesQueryData,
    setAttachmentData,
    setEvidencesData,
    createAttachment,
  } = props;
  const MAX_DESC_TEXT = 100;
  const MAX_SIZE = 2097152;

  const { service } = useServiceContext();
  const abortController = useMemo(() => new AbortController(), [evidenceId]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);
  const [dropZoneData, setDropZone] = useState(null);
  const [btnState, setBtnState] = useState("");
  const addEvidenceAttachments = useQuery({
    service: (args, config) =>
      service.addEvidenceAttachments(args, { signal: abortController.signal }),
    runOnMount: false,
  });
  useEffect(() => {
    if (dropZoneData) {
      if (
        (dropZoneData[0] as any)?.size &&
        (dropZoneData[0] as any)?.size > 2097152
      ) {
        toast(t("uploadAcceptableSize"), { type: "error" });
      }
    }
  }, [dropZoneData]);

  const handelDescription = (e: any) => {
    if (e.target.value.length < MAX_DESC_TEXT) {
      setDescription(e.target.value);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handelSendFile = async (recognize: any) => {
    if (description.length > 1 && description.length < 3) {
      return setError(true);
    }
    if (!dropZoneData) {
      return toast(t("attachmentRequired"), { type: "error" });
    }
    if (error && description.length >= 100) {
      return toast(t("max100characters"), { type: "error" });
    }

    if (dropZoneData[0].size > MAX_SIZE) {
      return toast(t("uploadAcceptableSize"), { type: "error" });
    }
    if (expanded.count >= 5) {
      return toast("Each evidence can have up to 5 attachments.", {
        type: "error",
      });
    }
    try {
      if (dropZoneData && !error) {
        const data = {
          id: evidenceId,
          attachment: dropZoneData[0],
          description: description,
        };
        setBtnState(recognize);
        await addEvidenceAttachments.query({ evidenceId, data });
        if (!createAttachment) {
          const { items } = await evidencesQueryData.query();
          setEvidencesData(items);
        }
        setAttachmentData(true);
        setDropZone(null);
        setDescription("");
        if (recognize == "self") {
          onClose();
        }
      }
    } catch (e: any) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const closeDialog = () => {
    onClose();
    setDropZone(null);
    setDescription("");
  };

  const theme = useTheme();
  return (
    <Dialog
      open={expanded.expended}
      onClose={closeDialog}
      maxWidth={"sm"}
      fullWidth
      sx={{
        ".MuiDialog-paper::-webkit-scrollbar": {
          display: "none",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
      }}
    >
      <DialogTitle textTransform="uppercase">
        <Trans i18nKey="uploadAttachment" />
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "unset",
          background: "#fff",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%", height: "auto" }}>
            <Typography
              sx={{
                ...theme.typography.headlineSmall,
                mx: "auto",
                display: "flex",
                justifyContent: "center",
                paddingBottom: "24px",
                gap: "5px",
              }}
            >
              <Trans i18nKey={"uploadAttachment"} />
              <Typography sx={{ ...theme.typography.headlineSmall }}>
                {expanded.count} <Trans i18nKey={"of"} /> 5{" "}
              </Typography>
            </Typography>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#73808C",
                maxWidth: "300px",
                textAlign: theme.direction == "rtl" ? "right" : "left",
                mx: "auto",
              }}
            >
              <Box sx={{ display: "flex", gap: "2px", mx: "auto" }}>
                <InfoOutlinedIcon
                  style={{ color: "#73808C" }}
                  sx={{
                    marginRight: theme.direction === "ltr" ? 1 : "unset",
                    marginLeft: theme.direction === "rtl" ? 1 : "unset",
                    width: "12px",
                    height: "12px",
                    fontSize: "11px",
                    lineHeight: "12px",
                    letterSpacing: "0.5px",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "11px",
                    lineHeight: "12px",
                    letterSpacing: "0.5px",
                  }}
                >
                  <Trans i18nKey="uploadAcceptable" />
                </Typography>
              </Box>
            </Typography>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#73808C",
                maxWidth: "300px",
                textAlign: "left",
                paddingBottom: "1rem",
                mx: "auto",
              }}
            >
              <Box sx={{ display: "flex", gap: "2px" }}>
                <InfoOutlinedIcon
                  style={{ color: "#73808C" }}
                  sx={{
                    marginRight: theme.direction === "ltr" ? 1 : "unset",
                    marginLeft: theme.direction === "rtl" ? 1 : "unset",
                    width: "12px",
                    height: "12px",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "11px",
                    lineHeight: "12px",
                    letterSpacing: "0.5px",
                  }}
                >
                  <Trans i18nKey="uploadAcceptableSize" />
                </Typography>
              </Box>
            </Typography>
            <MyDropzone setDropZone={setDropZone} dropZoneData={dropZoneData} />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "70%" }, mx: "auto" }}>
            <Typography
              sx={{
                ...theme.typography.headlineSmall,
                color: "#243342",
                paddingBottom: "1rem",
              }}
            >
              <Trans i18nKey={"additionalInfo"} />
            </Typography>
            <TextField
              sx={{
                overflow: "auto",
                "&::placeholder": {
                  ...theme.typography.bodySmall,
                  color: "#000",
                },
              }}
              rows={3}
              id="outlined-multiline-static"
              multiline
              fullWidth
              value={description}
              onChange={(e) => handelDescription(e)}
              variant="standard"
              inputProps={{
                sx: {
                  fontSize: "13px",
                  marginTop: "4px",
                  background: "rgba(0,0,0,0.06)",
                  padding: "5px",
                },
              }}
              placeholder={t(`addDescriptionToAttachment`) as string}
              error={error}
              helperText={
                description.length >= 1 && error && description.length <= 3
                  ? "Please enter at least 3 characters"
                  : description.length >= 1 && error && "maximum 100 characters"
              }
            />
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: 2,
            padding: "16px",
          }}
          justifyContent="center"
        >
          <LoadingButton
            onClick={() => handelSendFile("another")}
            value={"another"}
            loading={addEvidenceAttachments.loading && btnState == "another"}
          >
            {uploadAnother}
          </LoadingButton>
          <LoadingButton
            variant="contained"
            onClick={() => handelSendFile("self")}
            value={"self"}
            loading={addEvidenceAttachments.loading && btnState == "self"}
          >
            {uploadAttachment}
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
