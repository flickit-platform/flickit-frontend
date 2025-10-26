import { ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import throttle from "lodash/throttle";
import TextField from "@mui/material/TextField";
import { TQueryServiceFunction, useQuery } from "@/hooks/useQuery";
import {
  Controller,
  ControllerRenderProps,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import getFieldError from "@/utils/get-field-error";
import Box from "@mui/material/Box";
import { LoadingSkeleton } from "../loadings/LoadingSkeleton";
import forLoopComponent from "@/utils/for-loop-component";
import ErrorDataLoading from "../errors/ErrorDataLoading";
import { styles } from "@styles";
import { SPACE_LEVELS, TQueryProps } from "@/types/index";
import LoadingButton from "@mui/lab/LoadingButton";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import uniqueId from "@/utils/unique-id";
import Chip from "@mui/material/Chip";
import { t } from "i18next";
import { Trans } from "react-i18next";
import languageDetector from "@/utils/language-detector";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import showToast from "@/utils/toast-error";
import { useTheme } from "@mui/material";
import premiumIcon from "@/assets/svg/premium.svg";
import HomeIcon from "@mui/icons-material/Home";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { useTypingCaret } from "@/hooks/useTypingCaret";
import { Text } from "../Text";
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
  isFocused?: boolean;
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
    isFocused,
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
            isFocused={isFocused}
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
  label: string | ReactElement;
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
  showIconBeforeOption?: boolean;
  isFocused?: boolean;
  style?: any;
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
    showIconBeforeOption,
    isFocused,
    style,
    ...rest
  } = props;
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      const err = e as any;
      onChange(value);
      showToast(err);
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

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleBlur = () => {
    const exactMatch = optionsData.find(
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

  useEffect(() => {
    if (!hasAddBtn) return;
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

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isFocused]);

  const { isTyping, inputBind } = useTypingCaret(100000);

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
          {...inputBind}
          InputLabelProps={{ required, ...params.InputLabelProps }}
          label={label}
          fullWidth
          inputRef={inputRef}
          error={hasError || errorObject?.response?.data.message}
          helperText={
            (hasError && (errorMessage as ReactNode)) ||
            (errorObject?.response?.data.message &&
              t(`${errorObject?.response?.data.message}`)) ||
            helperText
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: farsiFontFamily,
            },
            "& .MuiInputBase-input": {
              caretColor: isFocused && !isTyping ? "transparent" : undefined,
            },
            ...style
          }}
          name={name}
          onBlur={handleBlur}
        />
      )}
      disabled={disabled}
      popupIcon={
        disabled ? <LockOutlinedIcon /> : <ArrowDropDownOutlinedIcon />
      }
      renderOption={(props, option) => {
        return option.inputValue ? (
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
              fontFamily={
                languageDetector(option?.[filterFields[0]])
                  ? farsiFontFamily
                  : primaryFontFamily
              }
              gap="4.5px"
              sx={{ ...styles.centerVH }}
            >
              {showIconBeforeOption &&
                (option?.isDefault ? (
                  <HomeIcon
                    sx={{ fontSize: "20px", color: "background.onVariant" }}
                  />
                ) : (
                  <FolderOutlinedIcon
                    sx={{ color: "background.onVariant", fontSize: "20px" }}
                  />
                ))}
              {option?.[filterFields[0]]}
            </Box>
            {!!option?.[filterFields[1]] && (
              <Box color="#3D4D5C80" sx={{ ...theme.typography.semiBoldSmall }}>
                (
                {option?.[filterFields[1]].code
                  ? option?.languages
                      .map((lang: { code: string; title: string }) => lang.code)
                      .join(", ")
                  : option?.[filterFields[1]]}
                )
              </Box>
            )}
            {option?.isPrivate && (
              <Chip
                size="small"
                sx={{
                  marginInlineStart: "auto",
                }}
                color={option?.isPrivate ? "secondary" : "default"}
                label={
                  <Text
                    variant="semiBoldSmall"
                    color="background.containerLowest"
                  >
                    <Trans i18nKey="common.privateTitle" />
                  </Text>
                }
              />
            )}
            {option?.type?.code === SPACE_LEVELS.PREMIUM && (
              <Box
                component={"img"}
                src={premiumIcon}
                sx={{ height: "20px", width: "20px" }}
              />
            )}
          </li>
        );
      }}
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

export const useConnectAutocompleteField = <T = any,>(props: {
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
