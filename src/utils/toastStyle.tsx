import {farsiFontFamily, primaryFontFamily} from "@config/theme";
import i18next from "i18next";

const langFa =  ()=>  i18next.language == "fa"

export const toastStyle : any = () =>{

    return { fontFamily: langFa() ? farsiFontFamily : primaryFontFamily, direction:  langFa() ? "rtl" :  "ltr" }
}