import { Directive, Input, forwardRef, HostListener, OnChanges } from '@angular/core';
import { AbstractCamera } from './abstract-camera';
import * as THREE from 'three';

@Directive({
  selector: 'atft-perspective-camera',
  providers: [{ provide: AbstractCamera, useExisting: forwardRef(() => PerspectiveCameraDirective) }]
})
export class PerspectiveCameraDirective extends AbstractCamera<THREE.PerspectiveCamera> implements OnChanges{

  // @Input() cameraTarget: THREE.Object3D;

  @Input() fov: number;
  @Input() near: number;
  @Input() far: number;

  @Input() positionX: number;
  @Input() positionY: number;
  @Input() positionZ: number;


  constructor() {
    console.log('PerspectiveCameraDirective.constructor');
    super();
  }

  protected afterInit(): void {
    console.log('PerspectiveCameraDirective.afterInit');
    // let aspectRatio = undefined; // Updated later
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      undefined,
      this.near,
      this.far
    );



    // Set position and look at
    this.camera.position.x = this.positionX;
    this.camera.position.y = this.positionY;
    this.camera.position.z = this.positionZ;
    this.camera.updateProjectionMatrix();
  }

  ngOnChanges($e): void {
    
    this.updateCamPosition();
    
    
  }

  public updateAspectRatio(aspect: number) {
    console.log('PerspectiveCameraDirective.updateAspectRatio: ' + aspect);
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }


  protected updateCamPosition() {
    this.camera.position.x = this.positionX;
    this.camera.position.y = this.positionY;
    this.camera.position.z = this.positionZ;
    this.camera.updateProjectionMatrix();
    // console.log(this.camera);
  }

}
