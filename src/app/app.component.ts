import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PerspectiveCamera } from 'three';
import { Tween, autoPlay } from 'es6-tween';


declare const FaceDetector: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public rotationX = 0.0;
  public rotationY = 0.0;
  public rotationZ = 0.0;

  public translationY = 0.0;

  public camX = 100;
  public camY = 0;
  public camZ = 0;

  private fps = 10;

  private faceDetector = new FaceDetector();
  public faceCenterCoord;


  @ViewChild('vid', { static: true }) private vid: ElementRef;

  @ViewChild('thecam', { static: true }) private cam: PerspectiveCamera;

  private nEl: HTMLVideoElement;

  constructor() {

    autoPlay(true);

    // let coords = {x:0};
    // let tween = new Tween(coords)
    //   .to({x:100}, 1000)
    //   .on('update', ({x}) => {
    //     console.log(`The value: ${x}`);
    //   })
    //   .start();


  }

  drawLoop() {
    setTimeout(() => {
       requestAnimationFrame(() => {
         this.faceDetector.detect(this.nEl).then( DetectedFaces => {
          // console.log(DetectedFaces);
          if (DetectedFaces.length > 0) {

            // console.log(DetectedFaces);

            // Tweening simulates tracking the face position at higher intervals than the fps, essentially interpolating the inbetween positions and smooths out the movement.
            // Get the last position of the tracked face
            let coords = { x: this.camX, y: this.camY };

            // Create a new tween that generates and emits the values inbetween the current position and the last position.
            let tween = new Tween(coords)
              .to({
                x: DetectedFaces[0].boundingBox.left + (DetectedFaces[0].boundingBox.width / 2),
                y: DetectedFaces[0].boundingBox.top + (DetectedFaces[0].boundingBox.height / 2)
              }, 1000 / this.fps)
              .on('update', ({ x, y }) => {
                this.camX = x;
                this.camY = y;
              })
              .start();

            // // // Non-Tween Cam movement (requires much higher framerate and is way more taxing on the hardware)
            // this.camX = DetectedFaces[0].boundingBox.left + (DetectedFaces[0].boundingBox.width / 2);
            // this.camY = DetectedFaces[0].boundingBox.top + (DetectedFaces[0].boundingBox.height / 2);


            this.faceCenterCoord = [DetectedFaces[0].boundingBox.left + (DetectedFaces[0].boundingBox.width / 2), DetectedFaces[0].boundingBox.top + (DetectedFaces[0].boundingBox.height / 2)];
            // console.log(this.cam.nativeElement);
          }

          this.drawLoop();
        });

      });
      // console.log('theloop');
      // console.log(this.ctrack.getCurrentPosition());
    }, 1000 / this.fps);

  }


  gumSuccess(stream: MediaStream) {
    this.nEl = this.vid.nativeElement;

    // console.log('Delicious GUM!', stream);
    this.nEl.srcObject = stream;

    this.nEl.onloadedmetadata = () => {
      this.nEl.play();

      // this.faceDetector.detect(this.nEl).then(DetectedFace => {
      //   console.log(this.cam.position);
      // });

      this.drawLoop();
    };


  }
  gumFail() {
    console.log('No GUM for you!');
  }

  ngOnInit() {


    this.nEl = this.vid.nativeElement;
    // console.log(this.vid);    

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.gumSuccess(stream);
    }).catch(() => {
      this.gumFail();
    });
  }
}
