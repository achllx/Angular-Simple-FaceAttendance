import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import * as faceapi from 'face-api.js';
import { LocationService } from 'src/app/service/location/location.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit {
  userId: string = '';
  recordType: string = '';
  areaValidation: boolean = false;
  validation: boolean | undefined;
  message: string = ''
  userName: string = '';
  userAgency: string = '';
  Image: any;
  labels: [] = [];

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private service: ApiService,
    private location: LocationService
  ) {}

  username: String = '';
  desc: String = '';

  async ngOnInit() {
    this.message = 'Please Wait'
    this.activeRouter.params.subscribe((params) => {
      this.userId = params['id'];
      this.recordType = params['type'];
      this.service.getUserData().subscribe((res) => {
        this.userName = res.data[0].user_name;
        this.userAgency = res.data[0].user_agency_id;

        this.service.getFace(this.userAgency).subscribe((res) => {
          this.labels = res.data;
        });
      });

      this.location
        .getLocationValid()
        .then((result) => {
          this.areaValidation = result; // Use the result as needed
        })
        .catch((error) => {
          console.error(error); // Handle any errors that occurred
        });
    });

    const video = document.getElementById('video');
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('assets/weight'),
      faceapi.nets.faceLandmark68Net.loadFromUri('assets/weight'),
      faceapi.nets.faceRecognitionNet.loadFromUri('assets/weight'),
    ])
      .then(() => this.startWebcam(video))
      .then(() => this.faceRecognition(video));
  }

  startWebcam(video: any) {
    this.desc = 'Wait the camera playing';
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        video.srcObject = stream;
        this.desc = 'Look at camera';
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getLabeledFaceDescriptions() {
    return Promise.all(
      this.labels.map(async (label) => {
        const descriptions: any = [];
        for (let i = 1; i <= 1; i++) {
          const img = await faceapi.fetchImage(
            `http://localhost:3000/${label}/${i}.jpeg`
          ); // Lokasi folder
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections?.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }

  async faceRecognition(video: any) {
    const labeledFaceDescriptors = await this.getLabeledFaceDescriptions();
    const faceMatcher: any = new faceapi.FaceMatcher(labeledFaceDescriptors);

    video.addEventListener('playing', () => {
      location.reload();
    });

    const canvas: any = faceapi.createCanvasFromMedia(video);
    canvas.style.position = 'absolute'; // Mengatur posisi canvas atau border deteksi
    canvas.style.left = '0';
    this.insertAfter(video, canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    let checkFace = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

      const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor);
      });

      if (results.length === 0) {
        //empty
      } else {
        if (results[0]._label === this.userName) {
          if (this.areaValidation) {
            this.validation = true;
            this.message = 'Face Recognized'
            clearInterval(checkFace);
            navigator.mediaDevices
              .getUserMedia({
                video: true,
                audio: false,
              })
              .then((stream) => {
                stream.getVideoTracks()[0].stop();
                video.srcObject = stream;
              });
            this.service.takeRecord(this.recordType).subscribe((res) => {
              if (res.msg === 'Data created successfully') {
                this.message = 'Success Record Attendance'
                this.router.navigate([`/absentia/${this.userId}/time-management`]);
              }
            });
          } else {
            this.validation = false;
            this.message = "Outside Area"
          }
        } else {
          this.validation = false;
          this.message = 'Face Not Recognized'
        }
      }

      // results.forEach((result, i) => {
      //   const box = resizedDetections[i].detection.box;
      //   const drawBox = new faceapi.draw.DrawBox(box, {
      //     label: result,
      //   });
      //   drawBox.draw(canvas);
      // });
    }, 1000);
  }

  insertAfter(referenceNode: any, newNode: any) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  backBtn() {
    this.router.navigate([`absentia/${this.userId}/time-management`]);
  }
}
