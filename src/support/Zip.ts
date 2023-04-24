import JSZip from "jszip";

export async function getJsonFromZip(zipFile: ArrayBuffer) {
  const zip = new JSZip();
  const unzipped = await zip.loadAsync(zipFile);
  return Object.values(unzipped.files)[0].async("string");
}
