import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel, { InputLabelProps } from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectProps } from "@mui/material/Select";

import { useFormContext, UseFormRegister } from "react-hook-form";
import getFieldError from "@utils/getFieldError";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import { LoadingSkeleton } from "../loadings/LoadingSkeleton";
import ListItemButton from "@mui/material/ListItemButton";
import { Trans } from "react-i18next";
import { useEffect } from "react";
import { theme } from "@/config/theme";
import uniqueId from "@/utils/uniqueId";

const selectField = () => {
  return <div>selectField</div>;
};

interface ISelectFieldUC extends ISelectField {}

const SelectFieldUC = (props: ISelectFieldUC) => {
  const { name, ...rest } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { hasError, errorMessage } = getFieldError(errors, name);
  return (
    <SelectField
      {...rest}
      name={name}
      register={register}
      helperText={errorMessage as string}
      error={hasError}
    />
  );
};

interface ISelectField extends SelectProps {
  renderOption?: (option: any) => JSX.Element;
  InputLabelProps?: InputLabelProps;
  helperText?: string | JSX.Element | Element;
  options?: any[];
  nullable?: boolean;
  name: string;
  size?: "small" | "medium";
  loading?: boolean;
  renderLoading?: () => JSX.Element;
  error?: boolean;
  fetchOptions?: any;
  register?: UseFormRegister<any>;
  defaultOption?: any;
  selectedOptions?: any;
  loadMore?: boolean;
  loadMoreHandler?: any;
  getTotalHandler?: any;
  totalItem?: number;
  children?: any;
  sx?: any;
  value?: string;
  IconComponent?: any;
  onChange?: (e: any) => void;
}

export const SelectField = (props: ISelectField) => {
  const {
    name,
    required,
    InputLabelProps = {},
    helperText = null,
    defaultValue = "",
    label,
    options = [],
    nullable = true,
    size = "small",
    loading = false,
    renderOption = defaultRenderOption,
    renderLoading = defaultRenderLoading,
    fetchOptions,
    error,
    register,
    defaultOption,
    selectedOptions = [],
    loadMore,
    loadMoreHandler,
    getTotalHandler,
    totalItem,
    children,
    ...rest
  } = props;

  useEffect(() => {
    if (totalItem) {
      getTotalHandler(totalItem);
    }
  }, [totalItem]);

  let selectOptions;
  if (selectedOptions?.length > 0) {
    const filteredData = options.filter(
      (item: any) =>
        !selectedOptions.some((excludeItem: any) => excludeItem.id === item.id),
    );
    selectOptions = [{ id: "", title: "---" }, ...filteredData];
  } else {
    selectOptions = nullable ? [{ id: "", title: "---" }, ...options] : options;
  }
  return (
    <FormControl fullWidth error={error} size={size} variant="outlined">
      <InputLabel
        required={required}
        id={`select_label_id_${name}`}
        sx={{
          backgroundColor: "white",
          paddingLeft: theme.direction === "ltr" ? "4px" : "unset",
          paddingRight: theme.direction === "rtl" ? "4px" : "unset",
          pr: "4px",
        }}
      >
        {label}
      </InputLabel>
      <Select
        {...rest}
        {...(register ? register(name, { required }) : {})}
        defaultValue={defaultValue ?? defaultOption?.id}
        labelId={`select_label_id_${name}`}
        sx={{
          ...(rest?.sx ?? {}),
          "& .MuiSelect-select": { display: "flex", alignItems: "center" },
        }}
      >
        {!!children && children}
        {!children && loading
          ? renderLoading()
          : selectOptions.map((option: any) => {
              return renderOption(option);
            })}
        {!children && loadMore && (
          <ListItemButton
            onClick={() => loadMoreHandler((prev: number) => prev + 1)}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Trans i18nKey="common.loadMore" />
          </ListItemButton>
        )}
      </Select>
      {helperText && <FormHelperText>{helperText as any}</FormHelperText>}
    </FormControl>
  );
};

const ColorOption = ({ value }: { value: string }) => {
  return (
    <Box sx={{ ...styles.centerVH }} color={value} mr={1}>
      <ColorLensRoundedIcon color="inherit" fontSize="small" />
    </Box>
  );
};

const defaultRenderOption = (option: any) => {
  return (
    <MenuItem
      value={option.id}
      key={option.id}
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {option.code ? <ColorOption value={option.code} /> : null}
      <Box
        sx={{
          background: option.code,
          width: "100%",
          color: option.code,
        }}
      >
        {option.title}
      </Box>
    </MenuItem>
  );
};

const defaultRenderLoading = () => {
  return [1, 2, 3, 4].map(() => {
    return (
      <Box m={0.5} key={uniqueId()}>
        <LoadingSkeleton sx={{ borderRadius: 1 }} height="36px" width="100%" />
      </Box>
    );
  });
};

export { selectField, SelectFieldUC };
