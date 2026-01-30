import { createClient } from "@/lib/supabase/server";

export const uploadService = {
  /**
   * Upload un fichier vers Supabase Storage
   */
  async uploadFile(file: File, bucket: string): Promise<string> {
    const supabase = await createClient(); 

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Erreur lors de l'upload : ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  },

  /**
   * Supprime un fichier du stockage
   */
  async deleteFile(url: string, bucket: string): Promise<void> {
    const supabase = await createClient();
    
    try {
      // Extraction sécurisée du nom de fichier (on retire les paramètres de query si présents)
      const fileName = url.split('/').pop()?.split('?')[0];
      if (!fileName) return;

      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (error) throw error;
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier:", error);
    }
  }
};