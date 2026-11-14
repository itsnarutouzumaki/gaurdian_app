const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sharedRoot = path.resolve(root, "..", "shared");
const photoDirectory = path.join(sharedRoot, "assets", "photos");
const outputPath = path.join(root, "src", "data", "schoolPhotos.generated.ts");
const appPhotoDirectory = path.join(root, "src", "assets", "school-photos");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const brandingAssets = [
  [
    path.join(sharedRoot, "assets", "logo", "logo.png"),
    path.join(root, "src", "assets", "branding", "logo.png"),
  ],
  [
    path.join(sharedRoot, "assets", "splash", "photo.png"),
    path.join(root, "src", "assets", "branding", "welcome-background.png"),
  ],
];

fs.mkdirSync(photoDirectory, { recursive: true });

const compareFileNames = (left, right) => {
  const normalizedLeft = left.toLowerCase();
  const normalizedRight = right.toLowerCase();
  if (normalizedLeft < normalizedRight) return -1;
  if (normalizedLeft > normalizedRight) return 1;
  return left < right ? -1 : left > right ? 1 : 0;
};
const photoFiles = fs
  .readdirSync(photoDirectory, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      supportedExtensions.has(path.extname(entry.name).toLowerCase()),
  )
  .map((entry) => entry.name)
  .sort(compareFileNames);
fs.mkdirSync(appPhotoDirectory, { recursive: true });
const requires = photoFiles.map((fileName) => {
  const appPhotoPath = path.join(appPhotoDirectory, fileName);
  fs.copyFileSync(path.join(photoDirectory, fileName), appPhotoPath);
  const relativePath = path
    .relative(path.dirname(outputPath), appPhotoPath)
    .split(path.sep)
    .join("/");
  return `  require(${JSON.stringify(relativePath)}),`;
});

const generatedSource = [
  'import type { ImageSourcePropType } from "react-native";',
  "",
  "export const schoolPhotoSources: readonly ImageSourcePropType[] = [",
  ...requires,
  "];",
  "",
].join("\n");

fs.writeFileSync(outputPath, generatedSource);
for (const [sourcePath, destinationPath] of brandingAssets) {
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
}
console.log(
  `Generated ${photoFiles.length} school photo reference(s) and synced ${brandingAssets.length} branding asset(s).`,
);
