import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConfigurationService } from '../../../../services/configuration.service';

@Component({
  selector: 'app-image-picker',
  templateUrl: './app-image-picker.component.html',
  styleUrls: ['./app-image-picker.component.css'],
  standalone: true,
})
export class AppImagePickerComponent implements OnInit {
  @Input() defaultImage: string = '/assets/img/avatar.png';
  @Output() imageSelected = new EventEmitter<File>();
  @Input() fileControl = new FormControl<string | undefined>(undefined);
  constructor(private configurationService: ConfigurationService) {}
  previewUrl: string | ArrayBuffer | null = null;
  ngOnInit() {
    const existingValue = this.fileControl?.value;
    this.setPreviewUrl(existingValue);

    this.fileControl.valueChanges.subscribe((value) => {
      this.setPreviewUrl(value);
    });
  }

  private setPreviewUrl(value: string | undefined | null) {
    if (!value) return;

    if (value.startsWith('/')) {
      this.previewUrl = this.configurationService.baseUrl + value;
    } else {
      this.previewUrl = value;
    }
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        const base64String = reader.result as string;
        this.fileControl.setValue(base64String);
      };
      reader.readAsDataURL(file);
      this.imageSelected.emit(file);
    }
  }

  get imageToShow(): string | ArrayBuffer | null {
    return this.previewUrl || this.defaultImage;
  }
}
