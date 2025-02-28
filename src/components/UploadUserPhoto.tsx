import { getCloudinarySignature } from "@delatte/shared/services";

export const uploadUserProfile = async (file: File): Promise<string | null> => {
  const signatureData = await getCloudinarySignature("perfil-usuarios");
  if (!signatureData) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("timestamp", signatureData.timestamp.toString());
  formData.append("signature", signatureData.signature);
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
  formData.append("folder", "delatte/perfil_usuarios");

  const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dzahaicup/image/upload", {
    method: "POST",
    body: formData,
  });

  const uploadData = await uploadResponse.json();
  return uploadData.secure_url || null;
};
