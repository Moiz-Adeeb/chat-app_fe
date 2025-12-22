import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-upload',
  standalone: false,
  templateUrl: './app-upload.component.html',
  styleUrl: './app-upload.component.scss',
})
export class AppUploadComponent {
  @Input() label: string | null = 'Click to Upload';
  fileName: string | null = null;
  fileBase64: string | null = null;
  isDragging = false;

  @Input() fileControl = new FormControl<string | undefined>(undefined); // FormControl for handling file

  @Output() fileUploaded = new EventEmitter<{
    base64: string;
    fileType: string;
    extension: string;
    file: File;
  }>();
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      this.convertToBase64(file);
    }
  }

  private convertToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.fileBase64 = reader.result as string;
      this.fileControl.setValue(this.fileBase64);
      const fileExtension = '.' + (file.name.split('.').pop() || '');
      this.fileUploaded.emit({
        base64: this.fileBase64,
        fileType: file.type,
        extension: fileExtension,
        file: file,
      });
    };
  }
}
