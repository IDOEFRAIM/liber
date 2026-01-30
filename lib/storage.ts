import { createClient } from "@/lib/supabase/client"; // Ou ton client admin

export const uploadService = {
  async uploadFile(file: File, bucket: string) {
    const supabase = createClient();
    
    // On crée un nom de fichier unique pour éviter les collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // 1. Upload du fichier
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Erreur lors de l'upload : ${uploadError.message}`);
    }

    // 2. Récupération de l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  },

  async deleteFile(url: string, bucket: string) {
    const supabase = createClient();
    // On extrait le nom du fichier de l'URL
    const fileName = url.split('/').pop();
    
    if (fileName) {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);
      
      if (error) console.error("Erreur suppression storage:", error.message);
    }
  }
};