import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { theme } from "@/config/theme";
import data from "./greport.json";

const sectionStyle = {
  marginTop: "16px",
  padding: "16px",
};

const textStyle = {
  fontSize: "14px",
  lineHeight: "1.8",
  color: "#424242",
};

const sectionTitleStyle = {
  fontWeight: "bold",
  marginBottom: "12px",
};

const TitleBox = () => (
  <Box
    sx={{
      position: "absolute",
      top: "-24px",
      left: "24px",
      backgroundColor: theme.palette.primary.main,
      color: "white",
      padding: "16px 24px",
      border: "1px solid #ddd",
      borderRadius: 5,
    }}
  >
    <Typography
      variant="h5"
      sx={{
        fontWeight: "bold",
        margin: 0,
      }}
    >
      این گزارش چگونه ساخته شده است؟
    </Typography>
  </Box>
);

const Section = ({ title, children }: any) => (
  <Box sx={sectionStyle}>
    <Typography color="primary" variant="h6" sx={sectionTitleStyle}>
      {title}
    </Typography>
    <Typography sx={textStyle}>{children}</Typography>
  </Box>
);

const StepsTable = ({ steps }: any) => (
  <TableContainer component={Box}>
    <Table sx={{ width: "100%" }}>
      <TableBody>
        {steps.map((item: any, index: any) => (
          <TableRow key={index}>
            <TableCell sx={{ padding: "8px", width: "20%" }}>
              {item.index}
            </TableCell>
            <TableCell sx={{ padding: "8px", width: "30%" }}>
              {item.title}
            </TableCell>
            <TableCell sx={{ padding: "8px" }}>{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const ReportCard = () => {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#EAF3FC",
        borderRadius: "16px",
        padding: "24px",
        width: "100%",
        marginTop: 8,
        border: "3px solid #2466A8",
      }}
    >
      <TitleBox />

      <Section title="شفاف‌سازی و سلب مسئولیت">
        این گزارش با رویکرد ارزیابی مبتنی بر شواهد تولید شده و تا حدی به اطلاعات
        ارائه‌شده توسط مصاحبه‌شوندگان اتکا دارد. یافته‌های این گزارش قطعیت صد در
        صد نخواهد داشت. در صورت تایید مدیران، فرایند ارزیابی برای بررسی عمیق‌تر
        شواهد و افزایش ضریب اطمینان ادامه خواهد یافت.
      </Section>

      <Section title="گام‌های ارزیابی">
        گام‌های زیر روند انجام کار را توصیف می‌کند:
        <StepsTable steps={data.steps} />
      </Section>

      <Section title="کیت ارزیابی">
        برای ارزیابی وضعیت سامانه از کیت ارزیابی Internal Software Team Audit
        استفاده شده است. این کیت ۱۱ شاخص اصلی را روی سه موضوع نرم‌افزار، تیم و
        محیط عملیات اندازه‌گیری می‌نماید و امتیاز هر شاخص را در قالب ۵ سطح بلوغ
        گزارش می‌نماید. این کیت مشتمل بر ۱۶ پرسشنامه است که در ادامه هر کدام از
        این موارد به تفکیک بررسی می‌شوند.
      </Section>

      <Section title="سطوح بلوغ">
        در این کیت ارزیابی، ۵ سطح بلوغ مختلف وجود دارد که تعریف هر کدام در جدول
        زیر نوشته شده است. در انتهای فرایند ارزیابی سطح بلوغ هر یک از شاخص‌ها
        تعیین می‌گردد.
      </Section>

      <Section title="موضوعات و شاخص‌های ارزیابی">
        در این کیت ۱۱ شاخص تحت سه موضوع نرم‌افزار، تیم و محیط عملیات مورد
        ارزیابی و امتیازدهی قرار می‌گیرد. جدول زیر به توضیح هر یک از موضوعات و
        شاخص‌ها اختصاص دارد. حوزه نرم افزار روی بررسی ساختار و کیفیت کد و
        فناوری‌ها مستقل از شرایط محیط عملیات تمرکز دارد. حوزه تیم بر نحوه‌ی کار
        تیم، چابکی، ساختار تیم، نقش‌ها و ابزارها نظارت می‌کند. محیط عملیات نیز
        مسائلی شرایط محیط عملیات شامل منابع، فرایندها و فناوری‌ها را ارزیابی
        میکند.
      </Section>
    </Box>
  );
};

export default ReportCard;
