import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import type { ToastMessage } from "../types";

const cleanAscii = (value: string) => value.normalize('NFKD').replace(/[^\x20-\x7E]/g, ' ');
const escapePdf = (value: string) => cleanAscii(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

function makeOnePagePdf(title: string, lines: string[]) {
  const streamLines = [
    "BT",
    "/F1 18 Tf",
    "50 790 Td",
    `(${escapePdf(title)}) Tj`,
    "/F1 10 Tf",
    "0 -28 Td",
    ...lines.flatMap((line) => [`(${escapePdf(line)}) Tj`, "0 -17 Td"]),
    "ET",
  ];
  const stream = streamLines.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

export async function shareDemoPdf(
  title: string,
  lines: string[],
  notify: (toast: ToastMessage) => void,
) {
  try {
    const safeName =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 45) || "school-document";
    const file = new File(
      Paths.document,
      `${safeName}-${Date.now()}.pdf`,
    );
    file.create();
    await file.write(makeOnePagePdf(title, lines));
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/pdf",
        dialogTitle: "Open or save PDF",
        UTI: "com.adobe.pdf",
      });
    } else {
      notify({
        title: "PDF created",
        message: `A demo PDF was created at: ${file.uri}`,
        tone: "success",
      });
    }
  } catch (error) {
    console.error("Unable to create or share the demo PDF.", error);
    notify({
      title: "PDF unavailable",
      message: "Unable to create the sample PDF.",
      tone: "error",
    });
  }
}
