// KitAside.tsx
import * as React from "react";
import { Grid, Box, Button, Divider, Menu, MenuItem } from "@mui/material";
import { Text } from "@/components/common/Text";
import { styles } from "@styles";
import {
  EditOutlined,
  FileDownloadOutlined,
  ArrowDropDownRounded,
  ArrowDropUpRounded,
  FileUploadOutlined,
} from "@mui/icons-material";
import UpdateAssessmentKitDialog from "./UpdateAssessmentKitDialog";
import {
  CEDialog,
  CEDialogActions,
} from "@/components/common/dialogs/CEDialog";
import { Trans, useTranslation } from "react-i18next";
import useMenu from "@/hooks/useMenu";
import { KitStatsType } from "../model/types";
import { useKitAside } from "../model/useKitAside";

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {icon}
    <Box sx={{ ...styles.centerCV }}>
      <Text variant="bodyMedium" color="background.onVariant">
        {title}
      </Text>
      <Text variant="semiBoldLarge" color="background.on">
        {value ?? "-"}
      </Text>
    </Box>
  </Box>
);

const StatsGrid = ({
  items,
  columns = 3,
}: {
  items: { title: string; value: React.ReactNode }[];
  columns?: number;
}) => (
  <Box
    sx={{
      ...styles.centerCVH,
      background: "#fff",
      borderRadius: "12px",
      flex: 1,
      px: 4,
    }}
  >
    <Grid container rowGap={3} py={2} columnSpacing={0}>
      {items.map((it, index, arr) => {
        const isLastInRow = (index + 1) % columns === 0;
        const isLastItem = index === arr.length - 1;
        const showDivider = !isLastInRow && !isLastItem;
        return (
          <React.Fragment key={it.title}>
            <Grid item xs={12 / columns - 0.05} sx={{ position: "relative" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text variant="bodyMedium" color="background.onVariant">
                  {it.title}
                </Text>
                <Text variant="semiBoldLarge" color="background.on">
                  {it.value}
                </Text>
              </Box>
            </Grid>
            {showDivider && <Divider orientation="vertical" flexItem />}
          </React.Fragment>
        );
      })}
    </Grid>
  </Box>
);

const TwoColRow = ({
  left,
  right,
}: {
  left: { title: string; value: React.ReactNode; icon?: React.ReactNode };
  right: { title: string; value: React.ReactNode; icon?: React.ReactNode };
}) => (
  <Box
    sx={{
      ...styles.centerV,
      alignItems: "center",
      background: "#fff",
      borderRadius: "12px",
      p: 2,
      flex: 1,
    }}
  >
    <Grid container>
      <Grid item xs={7}>
        <StatCard {...left} />
      </Grid>
      <Grid item xs={5}>
        <StatCard {...right} />
      </Grid>
    </Grid>
  </Box>
);

type Props = {
  stats: KitStatsType;
  languages: string | string[];
  assessmentKitTitle: string;
  draftVersionId: number | null;
};

const KitAside = ({
  stats,
  languages,
  assessmentKitTitle,
  draftVersionId,
}: Props) => {
  const { t } = useTranslation();

  const {
    creationDate,
    lastUpdated,
    gridItems,
    languagePriceRow,
    row2,
    handleDownloadDSL,
    handleCreateViaKitDesigner,
    dslDialog,
    draftDialog,
    menu,
  } = useKitAside({
    stats,
    languages,
    assessmentKitTitle,
    draftVersionId,
  });

  return (
    <Grid container rowSpacing={2} columnSpacing={3} position="sticky" top={60}>
      {/* Dates */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            ...styles.centerCH,
            background: "#fff",
            borderRadius: "12px",
            py: 2,
            flex: 1,
          }}
        >
          <Text variant="bodyMedium" color="background.onVariant">
            {t("common.creationDate")}
          </Text>
          <Text variant="semiBoldLarge" color="background.on">
            {creationDate}
          </Text>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            ...styles.centerCH,
            background: "#fff",
            borderRadius: "12px",
            py: 2,
            flex: 1,
          }}
        >
          <Text variant="bodyMedium" color="background.onVariant">
            {t("common.lastUpdated")}
          </Text>
          <Text variant="semiBoldLarge" color="background.on">
            {lastUpdated}
          </Text>
        </Box>
      </Grid>

      {/* Grid stats */}
      <Grid item xs={12}>
        <StatsGrid items={gridItems} columns={3} />
      </Grid>

      {/* Rows */}
      <Grid item xs={12}>
        <TwoColRow
          left={languagePriceRow.left}
          right={languagePriceRow.right}
        />
      </Grid>
      <Grid item xs={12}>
        <TwoColRow left={row2.left} right={row2.right} />
      </Grid>

      {/* Actions */}
      <Grid item xs={12} md={6}>
        <Button
          onClick={handleDownloadDSL}
          variant="outlined"
          fullWidth
          startIcon={<FileDownloadOutlined />}
          size="small"
        >
          <Text variant="semiBoldLarge">{t("kitDetail.downloadDSLKit")}</Text>
        </Button>
      </Grid>

      {/* Edit menu */}
      <Grid item xs={12} md={6}>
        <EditMenu
          menu={menu}
          onOpenDsl={() => dslDialog.openDialog({})}
          onOpenDraft={() => draftDialog.openDialog({})}
        />
      </Grid>

      {/* Dialogs */}
      <UpdateAssessmentKitDialog {...dslDialog} />

      <CEDialog
        open={draftDialog.open}
        closeDialog={draftDialog.onClose}
        title={
          <>
            <EditOutlined />
            <Trans i18nKey="kitDetail.editViaKitDesigner" />
          </>
        }
        maxWidth="sm"
      >
        <Text>
          <Trans
            i18nKey={
              draftVersionId
                ? "kitDetail.continueEdittingDraft"
                : "kitDetail.createNewDraftDesc"
            }
          />
        </Text>
        <CEDialogActions
          loading={false}
          onClose={draftDialog.onClose}
          submitButtonLabel={
            draftVersionId ? t("common.continue") : t("kitDetail.newDraft")
          }
          cancelLabel={t("common.cancel")}
          onSubmit={handleCreateViaKitDesigner}
        />
      </CEDialog>
    </Grid>
  );
};

const EditMenu = ({
  menu,
  onOpenDsl,
  onOpenDraft,
}: {
  menu: ReturnType<typeof useMenu>;
  onOpenDsl: () => void;
  onOpenDraft: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Button
        variant="contained"
        size="small"
        endIcon={menu.open ? <ArrowDropUpRounded /> : <ArrowDropDownRounded />}
        fullWidth
        onClick={menu.openMenu}
      >
        <Text variant="semiBoldLarge">
          <Trans i18nKey="kitDetail.editKit" />
        </Text>
      </Button>
      <Menu
        anchorEl={menu.anchorEl}
        open={menu.open}
        onClose={menu.closeMenu}
        PaperProps={{ style: { maxHeight: 48 * 4.5 } }}
      >
        <MenuItem
          onClick={() => {
            menu.closeMenu();
            onOpenDraft();
          }}
          sx={{ gap: 1 }}
        >
          <EditOutlined fontSize="small" color="primary" />
          <Text variant="bodyMedium">{t("kitDetail.viaKitDesigner")}</Text>
        </MenuItem>
        <MenuItem
          onClick={() => {
            menu.closeMenu();
            onOpenDsl();
          }}
          sx={{ gap: 1 }}
        >
          <FileUploadOutlined fontSize="small" color="primary" />
          <Text variant="bodyMedium">{t("kitDetail.uploadDSL")}</Text>
        </MenuItem>
      </Menu>
    </>
  );
};

export default KitAside;
