import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppButtonComponent } from '../../../app-button/components/app-button/app-button.component';
import { NgIf } from '@angular/common';
import { UploadService } from '../../../../services/image.service';
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-image-picker-with-upload-button',
  templateUrl: './app-image-picker-with-upload-button.component.html',
  styleUrls: ['./app-image-picker-with-upload-button.component.css'],
  imports: [AppButtonComponent, NgIf],
  standalone: true,
})
export class AppImagePickerWithUploadButtonComponent implements OnInit {
  constructor(
    private alertService: AlertService,
    private imageService: UploadService,
  ) {}

  @Input() defaultImage: string = '/assets/svg/default_avatar.svg';
  @Input() label: string = 'Upload Image';
  @Input() useAlternateView: boolean = false;
  @Output() imageSelected = new EventEmitter<File>();
  @Input() fileControl = new FormControl<string | undefined>(undefined);
  @ViewChild('fileInput') fileInput!: HTMLInputElement;
  previewUrl: string | ArrayBuffer | null = null;

  ngOnInit() {
    const existingValue = this.fileControl?.value;
    if (existingValue) {
      this.previewUrl = existingValue;
    }

    // Optional: React to future changes (e.g. if parent sets image after init)
    this.fileControl.valueChanges.subscribe((value) => {
      if (value && !this.previewUrl) {
        this.previewUrl = value;
      }
    });
  }

  removeImage() {
    this.previewUrl = null;
    this.fileControl.setValue(null);
    this.fileInput.value = '';
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    (event.target as HTMLInputElement).value = '';
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        const base64String = reader.result as string;
        this.fileControl.setValue(base64String);
      };
      reader.readAsDataURL(file);
      this.uploadFile(file);
    }
  }

  private uploadFile(file: File) {
    this.alertService.startLoadingMessage();
    // this.imageClient.image_CreateImageUploadUrl().subscribe(async (image) => {
    //   this.imageService.uploadFile(file, image.url ?? '');
    //   this.imageSelected.emit(file);
    //   this.alertService.stopLoadingMessage();
    //   this.fileControl.setValue(image.file);
    // });
  }

  triggerFileInput(input: HTMLInputElement): void {
    input.click();
  }
}
