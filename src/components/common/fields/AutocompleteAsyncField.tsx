import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import throttle from "lodash/throttle";
import TextField from "@mui/material/TextField";
import { TQueryServiceFunction, useQuery } from "@utils/useQuery";
import {
  Controller,
  ControllerRenderProps,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import getFieldError from "@utils/getFieldError";
import Box from "@mui/material/Box";
import { LoadingSkeleton } from "../loadings/LoadingSkeleton";
import forLoopComponent from "@utils/forLoopComponent";
import ErrorDataLoading from "../errors/ErrorDataLoading";
import { styles } from "@styles";
import { SPACE_LEVELS, TQueryProps } from "@/types/index";
import LoadingButton from "@mui/lab/LoadingButton";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import uniqueId from "@/utils/uniqueId";
import Chip from "@mui/material/Chip";
import { t } from "i18next";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import languageDetector from "@utils/languageDetector";
import { SxProps, Theme } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";

type TUnionAutocompleteAndAutocompleteAsyncFieldBase = Omit<
  IAutocompleteAsyncFieldBase,
  "serviceQueryData" | "field"
>;

interface IAutocompleteAsyncFieldProps
  extends TUnionAutocompleteAndAutocompleteAsyncFieldBase {
  rules?: Omit<
    RegisterOptions<any, any>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  filterFields?: any;
  createItemQuery?: any;
  setError?: any;
}

const AutocompleteAsyncField = (props: any) => {
  const {
    name,
    rules = {},
    multiple,
    defaultValue = multiple ? undefined : null,
    required = false,
    hasAddBtn = false,
    editable = false,
    filterFields = ["title"],
    createItemQuery,
    setError,
    searchable,
    disabled,
    ...rest
  } = props;
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={{ ...rules, required }}
      shouldUnregister={true}
      defaultValue={defaultValue}
      render={({ field, fieldState, formState }) => {
        return (
          <AutocompleteBaseField
            {...rest}
            multiple={multiple}
            name={name}
            required={required}
            field={field}
            defaultValue={defaultValue}
            editable={editable}
            hasAddBtn={hasAddBtn}
            filterFields={filterFields}
            createItemQuery={createItemQuery}
            setError={setError}
            searchable={searchable}
            disabled={disabled}
          />
        );
      }}
    />
  );
};

interface IAutocompleteAsyncFieldBase
  extends Omit<AutocompleteProps<any, any, any, any>, "renderInput"> {
  field: ControllerRenderProps<any, any>;
  formatRequest?: (request: any) => any;
  name: string;
  helperText?: ReactNode;
  label: string | JSX.Element;
  filterSelectedOption?: (options: readonly any[], value: any) => any[];
  required?: boolean;
  searchOnType?: boolean;
  editable?: boolean;
  hasAddBtn?: boolean;
  filterFields?: any[];
  filterOptionsByProperty?: (option: any) => boolean;
  createItemQuery?: any;
  setError?: any;
  searchable?: boolean;
}

const AutocompleteBaseField = (
  props: IAutocompleteAsyncFieldBase & Omit<TQueryProps, "data">,
) => {
  const {
    editable,
    field,
    formatRequest = (request) => request,
    helperText,
    label,
    getOptionLabel = (option) => {
      if (option) {
        return typeof option === "string"
          ? option
          : (option?.[filterFields[0]] ?? option.inputValue);
      } else {
        return "";
      }
    },
    filterSelectedOption = (options: readonly any[], value: any): any[] =>
      value
        ? options.filter((option) => option?.id != value?.id)
        : (options as any[]),
    renderOption,
    noOptionsText,
    required,
    loaded,
    loading,
    error,
    options: optionsData,
    query,
    errorObject,
    abortController,
    defaultValue,
    hasAddBtn,
    searchOnType = true,
    multiple,
    filterFields = ["title"],
    filterOptionsByProperty = () => true,
    createItemQuery,
    setError,
    searchable = true,
    disabled,
    filterSelectedOptions = true,
    ...rest
  } = props;
  const { name, onChange, ref, value, ...restFields } = field;
  const {
    formState: { errors },
  } = useFormContext();
  const isFirstFetchRef = useRef(true);
  const { hasError, errorMessage } = getFieldError(errors, name);

  const [inputValue, setInputValue] = useState(
    () => getOptionLabel(defaultValue) ?? "",
  );
  const [options, setOptions] = useState<any[]>([]);
  useEffect(() => {
    if (!searchable) {
      query?.();
    }
  }, []);

  const fetch = useMemo(
    () =>
      searchable
        ? throttle((request: any) => {
            query?.({ query: formatRequest(request) });
          }, 800)
        : () => {},
    [],
  );
  const createSpaceQuery = async () => {
    try {
      setOpen(false);
      const newOption: any = await createItemQuery(inputValue);
      setOptions((prevOptions) => [...prevOptions, newOption]);
      onChange(newOption);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!searchOnType && !isFirstFetchRef.current) {
      return;
    }

    if (getOptionLabel(value) === inputValue) {
      fetch("");
    } else {
      fetch(inputValue);
    }
    isFirstFetchRef.current = false;
  }, [inputValue, fetch]);

  useEffect(() => {
    let active = true;
    if (loaded && active) {
      setOptions(optionsData as any);
      defaultValue && onChange(defaultValue);
    }
    return () => {
      active = false;
    };
  }, [loaded]);

  const getFilteredOptions = (options: any[], params: any) => {
    return options
      .filter(filterOptionsByProperty)
      .filter((option) =>
        filterFields.some((field) =>
          String(option[field])
            ?.toLowerCase()
            ?.includes(params.inputValue.toLowerCase()),
        ),
      );
  };

  const loadingButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event?.key === "Enter") {
        event.preventDefault();

        if (loadingButtonRef.current && inputValue && hasAddBtn) {
          loadingButtonRef.current.click();
          setOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputValue, hasAddBtn]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleBlur = () => {
    const exactMatch = options.find(
      (option) =>
        getOptionLabel(option).toLowerCase() === inputValue.toLowerCase(),
    );

    if (exactMatch) {
      onChange(exactMatch);
    } else if (inputValue && hasAddBtn) {
      createSpaceQuery();
    }

    setOpen(false);
  };
  return (
    <Autocomplete
      {...restFields}
      defaultValue={defaultValue}
      value={value ?? (multiple ? undefined : null)}
      multiple={multiple}
      loading={loading}
      open={open}
      onOpen={handleOpen}
      clearOnBlur={!hasAddBtn}
      loadingText={
        options.length > 5 ? <LoadingComponent options={options} /> : undefined
      }
      size="small"
      autoHighlight
      getOptionLabel={getOptionLabel}
      options={(() => {
        if (!query) {
          return optionsData;
        } else if (error) {
          return [{}];
        } else if (editable) {
          return options.filter(
            (option: any) =>
              !value.some((selectedOpts: any) => selectedOpts.id === option.id),
          );
        } else {
          return options;
        }
      })()}
      autoComplete
      disablePortal={false}
      includeInputInList
      filterSelectedOptions={filterSelectedOptions}
      filterOptions={(options, params) => {
        const filtered = getFilteredOptions(options, params);
        const exactMatch = optionsData?.find(
          (option) =>
            getOptionLabel(option).toLowerCase() === inputValue.toLowerCase(),
        );

        if (
          params.inputValue !== "" &&
          !filtered.some(
            (option) => getOptionLabel(option) === params.inputValue,
          ) &&
          hasAddBtn &&
          !exactMatch
        ) {
          filtered.push({
            inputValue: params.inputValue,
            title: `Add "${params.inputValue}"`,
          });
        }

        return filtered;
      }}
      onBlur={() => {
        setOpen(false);
      }}
      onChange={(event: any, newValue: any) => {
        if (newValue?.inputValue) {
          onChange({ [filterFields[0]]: newValue.inputValue });
        } else {
          onChange(newValue);
          setOpen(false);
        }
      }}
      onInputChange={(event: any, newInputValue) => {
        if (event?.key === "Enter") return;
        setInputValue(newInputValue);
        if (setError) {
          setError(undefined);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{ required, ...params.InputLabelProps }}
          label={label}
          fullWidth
          inputRef={ref}
          error={hasError || errorObject?.response?.data.message}
          helperText={
            (errorMessage as ReactNode) ||
            (errorObject?.response?.data.message &&
              t(`${errorObject?.response?.data.message}`)) ||
            helperText
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: farsiFontFamily,
              "& .MuiAutocomplete-endAdornment": {
                left: theme.direction == "rtl" ? "9px" : "unset",
                right: theme.direction == "ltr" ? "9px" : "unset",
              },
            },
          }}
          name={name}
          onBlur={handleBlur}
        />
      )}
      disabled={disabled}
      popupIcon={
        disabled ? <LockOutlinedIcon /> : <ArrowDropDownOutlinedIcon />
      }
      renderOption={(props, option) =>
        option.inputValue ? (
          <li {...props}>
            <LoadingButton
              fullWidth
              onClick={createSpaceQuery}
              sx={{ justifyContent: "start", textTransform: "none" }}
              ref={loadingButtonRef}
            >
              <Trans i18nKey="common.add" /> "{option.inputValue}"
            </LoadingButton>
          </li>
        ) : (
          <li {...props} style={{ display: "flex", gap: "8px" }}>
            <Box
              sx={{
                fontFamily: languageDetector(option?.[filterFields[0]])
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
            >
              {option?.[filterFields[0]]}
            </Box>
            {!!option?.[filterFields[1]] && (
              <Box
                sx={{
                  ...theme.typography.semiBoldSmall,
                  color: "#3D4D5C80",
                }}
              >
                (
                {option?.[filterFields[1]].code
                  ? option?.[filterFields[1]].code
                  : option?.[filterFields[1]]}
                )
              </Box>
            )}
            {(option?.isPrivate ||
              option?.type?.code === SPACE_LEVELS.PREMIUM) && (
              <Chip
                size="small"
                sx={{
                  marginInlineStart: "auto",
                  ...(option?.type?.code === SPACE_LEVELS.PREMIUM && {
                    background:
                      "linear-gradient(to right top,#1B4D7E 0%,#2D80D2 33%,#1B4D7E 100%)",
                  }),
                }}
                color={option?.isPrivate ? "secondary" : "default"}
                label={
                  <Typography
                    sx={{ ...theme.typography.semiBoldSmall, color: "#fff" }}
                  >
                    {option?.isPrivate ? (
                      <Trans i18nKey="common.privateTitle" />
                    ) : (
                      option?.type?.title
                    )}
                  </Typography>
                }
              />
            )}
          </li>
        )
      }
      noOptionsText={
        error ? (
          <Box sx={{ ...styles.centerVH }}>
            <ErrorDataLoading />
          </Box>
        ) : (
          noOptionsText
        )
      }
      {...rest}
    />
  );
};

const LoadingComponent = ({ options }: { options: readonly any[] }) => {
  return (
    <Box display="flex" flexDirection="column" m={-1}>
      {forLoopComponent(options.length, () => (
        <LoadingSkeleton
          width="100%"
          height="36px"
          sx={{ my: 0.3, borderRadius: 1 }}
          key={uniqueId()}
        />
      ))}
    </Box>
  );
};

export const useConnectAutocompleteField = <T extends any = any>(props: {
  service: TQueryServiceFunction<T>;
  accessor?: string;
}) => {
  const { service, accessor = "items" } = props;
  const serviceQueryData = useQuery({
    service,
    runOnMount: false,
    initialData: [],
    accessor,
  });

  const { data: options, ...rest } = serviceQueryData;
  return { ...rest, options };
};

export default AutocompleteAsyncField;
