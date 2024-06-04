import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { BrowserMultiFormatReader, Result, NotFoundException } from '@zxing/library';

@Component({
  selector: 'app-scanner-qr',
  templateUrl: './scanner-qr.component.html',
  styleUrls: ['./scanner-qr.component.scss'],
})
export class ScannerQRComponent implements AfterViewInit, OnDestroy{
    @ViewChild('video', { static: false }) video: ElementRef<HTMLVideoElement> | undefined;
  
    private codeReader: BrowserMultiFormatReader;
    public qrResult: string;
  
    constructor() {
      this.codeReader = new BrowserMultiFormatReader();
      this.qrResult = '';
    }
  
    ngAfterViewInit(): void {
      if (this.video) {
        this.startScan();
      }
    }
  
    startScan(): void {
      if (!this.video) {
        console.error('Video element not found!');
        return;
      }
  
      this.codeReader.decodeFromVideoDevice(null, this.video.nativeElement, (result: Result | null, error: any) => {
        if (result) {
          this.qrResult = result.getText();
          alert(`QR Code Data: ${this.qrResult}`);
        }
        if (error && !(error instanceof NotFoundException)) {
          console.error('Error scanning QR code', error);
        }
      });
    }
  
    ngOnDestroy(): void {
      this.codeReader.reset();
    }
  }