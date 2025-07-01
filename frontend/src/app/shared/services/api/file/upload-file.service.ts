import { Injectable, inject } from '@angular/core';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../../../../environments/environment';

import { ToastHandlingService } from '../../core/toast/toast-handling.service';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  private readonly toastHandlingService = inject(ToastHandlingService);

  private readonly supabaseClient: SupabaseClient;

  private readonly SUPABASE_URL = environment.supabase.url;
  private readonly SUPABASE_KEY = environment.supabase.key;

  constructor() {
    this.supabaseClient = createClient(this.SUPABASE_URL, this.SUPABASE_KEY);
  }

  async uploadFile(
    file: Blob | File,
    fileName: string,
    bucket: string
  ): Promise<string | null> {
    try {
      const { data, error } = await this.supabaseClient.storage
        .from(bucket)
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (error || !data) {
        this.toastHandlingService.errorGeneral();
        return null;
      }

      const { data: publicData } = this.supabaseClient.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicData?.publicUrl || null;
    } catch (err) {
      this.toastHandlingService.errorGeneral();
      return null;
    }
  }
}
