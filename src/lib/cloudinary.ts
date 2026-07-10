const CLOUD_NAME = "ou3p2mmc";
const UPLOAD_PRESET = "uditas_gallery";

export async function uploadToCloudinary(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.secure_url) resolve(res.secure_url);
        else reject(new Error(res?.error?.message || "Upload failed"));
      } catch (err) {
        reject(err);
      }
    };
    xhr.onerror = () => reject(new Error("Network error uploading to Cloudinary"));
    xhr.send(form);
  });
}

export async function uploadManyToCloudinary(
  files: File[],
  onEach?: (index: number, pct: number) => void,
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadToCloudinary(files[i], (pct) => onEach?.(i, pct));
    urls.push(url);
  }
  return urls;
}
