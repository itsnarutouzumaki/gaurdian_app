import { generatePDF } from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import { NativeModules, PermissionsAndroid, Platform } from "react-native";
import Share from "react-native-share";
import type { ToastMessage } from "../types";

type PdfDownloadNativeModule = {
  savePdfToDownloads(sourcePath: string, fileName: string): Promise<string>;
};

const pdfDownloadModule =
  NativeModules.PdfDownloadModule as PdfDownloadNativeModule | undefined;

function messageFromError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function safeFileName(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 45) || "school-document"
  );
}

export async function sharePdfDocument(
  title: string,
  html: string,
  notify: (toast: ToastMessage) => void,
) {
  const fileName = `${safeFileName(title)}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  try {
    if (Platform.OS === "android" && !pdfDownloadModule) {
      throw new Error("PDF downloads are not available right now.");
    }
    if (
      Platform.OS === "android" &&
      Number(Platform.Version) < 29
    ) {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
        notify({
          title: "Storage permission required",
          message: "Allow storage access to save the PDF in Downloads.",
          tone: "error",
        });
        return;
      }
    }

    const generated = await generatePDF({
      html,
      fileName,
      shouldPrintBackgrounds: true,
    });
    if (!generated.filePath || !(await RNFS.exists(generated.filePath))) {
      throw new Error("The PDF generator did not create an output file.");
    }

    const savedFile = await RNFS.stat(generated.filePath);
    if (Number(savedFile.size) <= 0) {
      throw new Error("The generated PDF is empty.");
    }

    if (Platform.OS === "android") {
      await pdfDownloadModule!.savePdfToDownloads(generated.filePath, fileName);
      notify({
        title: "PDF downloaded",
        message: `${fileName}.pdf saved to Downloads/Parent App.`,
        tone: "success",
      });
      return;
    }

    await Share.open({
      url: `file://${generated.filePath}`,
      type: "application/pdf",
      title,
      failOnCancel: false,
    });
  } catch (error) {
    console.error("Unable to generate, download, or share the PDF.", error);
    notify({
      title: Platform.OS === "android" ? "PDF download failed" : "PDF unavailable",
      message: messageFromError(error),
      tone: "error",
    });
  }
}
