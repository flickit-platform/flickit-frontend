import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";

export const downloadFile = async ({ link }: { link: string }) => {
  try {
    if (!link) return;

    const response = await fetch(link);
    if (!response.ok)
      throw new Error(`Failed to fetch file: ${response.statusText}`);

    const blob = await response.blob();

    const reg = /\/([^/?]+)\?/;
    const match = reg.exec(link);
    const fileName = match?.[1] ?? "download";

    const a = document.createElement("a");
    const urlBlob = URL.createObjectURL(blob);

    a.href = urlBlob;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(urlBlob);
  } catch (e) {
    const err = e as ICustomError;
    toastError(err);
  }
};
