export const uploadImageToCloudinary = async (
  file: File,
  publicId?: string
): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'zrd47ahk'); // ← すでにOK
  if (publicId) {
    formData.append('public_id', publicId);
  }

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dkjcpkfi1/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Cloudinary upload error:', data);
      return null;
    }

    // ✅ ここで1:1のURLに加工
    const transformedUrl = data.public_id
      ? `https://res.cloudinary.com/dkjcpkfi1/image/upload/w_600,h_600,c_fill,g_auto/${data.public_id}.${data.format}`
      : data.secure_url;

    return transformedUrl || null;
  } catch (err) {
    console.error('Cloudinary upload exception:', err);
    return null;
  }
};
