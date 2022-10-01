class Sound {

  constructor(context) {
    this.context = context;
  }

  setup() {
    this.oscillator = this.context.createOscillator();
    this.gainNode = this.context.createGain();

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.oscillator.type = 'sine';
  }

  play(value) {
    this.setup();

    this.oscillator.frequency.value = value;
    this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.01);

    this.oscillator.start(this.context.currentTime);
    this.stop(this.context.currentTime);
  }

  stop() {
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 1);
    this.oscillator.stop(this.context.currentTime + 1);
  }}



let context = new (window.AudioContext || window.webkitAudioContext)();


document.addEventListener('mousemove', cursor);
var stick = document.querySelector('.stick');
var glow1 = document.querySelector('.stick .glow-1');
var glow2 = document.querySelector('.stick .glow-2');
var notes = document.querySelectorAll('.note');

notes.forEach(note => {
  note.addEventListener('mouseenter', () => {
    playSound(note);
    showGlow();
    setTimeout(hideGlow, 300);
  });
  note.addEventListener('mouseleave', hideGlow);
});

function playSound(note) {
  let sound = new Sound(context);
  let value = note.dataset.frequency;
  sound.play(value);
  sound.stop();
}

function showGlow() {
  glow1.style.animationPlayState = "running";
  glow2.style.animationPlayState = "running";
  glow1.classList.remove('hidden');
  glow2.classList.remove('hidden');
}

function hideGlow() {
  glow1.style.animationPlayState = "paused";
  glow2.style.animationPlayState = "paused";
  glow1.classList.add('hidden');
  glow2.classList.add('hidden');
}

function cursor(e) {
  stick.style.top = e.clientY - 12 + "px";
  stick.style.left = e.clientX + 12 + "px";
}