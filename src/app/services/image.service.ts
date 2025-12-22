import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File, buffer: ArrayBuffer, imageUrl: string): void {
    const url = imageUrl;
    const headers = new HttpHeaders({
      // Only include this if the signed URL was generated with content type
      'Skip-Auth': 'true', // Custom header to skip auth
      'Content-Type': file.type,
    });
    this.http.put(url, file, { headers, observe: 'response' }).subscribe({
      next: (response) => {},
      error: (error) => {},
    });
  }
}
