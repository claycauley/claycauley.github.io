class AudioRecordingButton {
  constructor(buttonSelector = '#audioRecordButton') {
    this.button = document.querySelector(buttonSelector);
    this.recordingTimeout = null;
    this.isRecording = false;
    
    if (this.button) {
      this.button.addEventListener('click', () => this.toggle());
    }
  }

  toggle() {
    this.isRecording ? this.cancel() : this.start();
  }

  start() {
    this.button.classList.add('recording');
    this.isRecording = true;
    if (this.recordingTimeout) clearTimeout(this.recordingTimeout);
    this.recordingTimeout = setTimeout(() => this.stop(), 30000); // Length of time for the animation to last, default is 30 seconds
    console.log('Recording started');
  }

  stop() {
    this.button.classList.remove('recording');
    this.isRecording = false;
    console.log('Recording stopped');
  }

  cancel() {
    if (this.recordingTimeout) clearTimeout(this.recordingTimeout);
    this.stop();
    console.log('Recording cancelled');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AudioRecordingButton('#audioRecordButton');
});
