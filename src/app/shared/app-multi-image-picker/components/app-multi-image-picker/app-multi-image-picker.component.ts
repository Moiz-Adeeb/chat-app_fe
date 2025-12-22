import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild, ElementRef,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AppButtonComponent} from '../../../app-button/components/app-button/app-button.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-multi-image-picker',
  templateUrl: './app-multi-image-picker.component.html',
  styleUrls: ['./app-multi-image-picker.component.css'],
  imports: [NgIf, NgForOf],
  standalone: true,
})
export class AppMultiImagePickerComponent implements OnInit {
  ngOnInit(): void {
  }

  @Input() images: string[] = [];
  @Output() imagesChange = new EventEmitter<string[]>();
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;


  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    const maxImages = 6;
    const newImages = [...this.images];
    Array.from(files).forEach((file) => {
      if (newImages.length < maxImages) {
        const reader = new FileReader();
        reader.onload = () => {
          newImages.push(reader.result as string);
          this.images = newImages;
          this.imagesChange.emit(newImages);
        };
        reader.readAsDataURL(file);
      }
    });

    this.fileInputRef.nativeElement.value = '';
  }

  triggerFileInput() {
    this.fileInputRef.nativeElement.click();
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
    this.imagesChange.emit([...this.images]);
  }
}
