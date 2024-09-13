const noteSettings = {
    'C': { frequency: 261.63, waveform: 'sine', amplitude: 0.1, phase: 0, duration: 1, harmonics: [1], envelope: [0.1, 0.1, 0.5, 0.1] },
    'D': { frequency: 293.66, waveform: 'sine', amplitude: 0.1, phase: 0, duration: 1, harmonics: [1], envelope: [0.1, 0.1, 0.5, 0.1] },
    'E': { frequency: 329.63, waveform: 'sine', amplitude: 0.1, phase: 0, duration: 1, harmonics: [1], envelope: [0.1, 0.1, 0.5, 0.1] },
    'F': { frequency: 349.23, waveform: 'sine', amplitude: 0.1, phase: 0, duration: 1, harmonics: [1], envelope: [0.1, 0.1, 0.5, 0.1] },
    'G': { frequency: 392.00, waveform: 'sine', amplitude: 0.1, phase: 0, duration: 1, harmonics: [1], envelope: [0.1, 0.1, 0.5, 0.1] },
    'A': { frequency: 440.00, waveform: 'sine', amplitude: 0.1, phase: 0, duration: 1, harmonics: [1], envelope: [0.1, 0.1, 0.5, 0.1] },
    'B': { frequency: 493.88, waveform: 'sine', amplitude: 0.1, phase: 0, duration: 1, harmonics: [1], envelope: [0.1, 0.1, 0.5, 0.1] },
    'custom': { frequency: 440, waveform: 'sine', amplitude: 0.1, phase: 0, duration: 1, harmonics: [1], envelope: [0.1, 0.1, 0.5, 0.1] }
};

function playNote(frequency) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1); // Duration is 1 second
}

function playCustomSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    const frequency = parseFloat(document.getElementById('frequency-slider').value);
    const waveform = document.getElementById('waveform-dropdown').value;
    const amplitude = parseFloat(document.getElementById('amplitude-slider').value);
    const phase = parseFloat(document.getElementById('phase-slider').value);
    const duration = parseFloat(document.getElementById('duration-slider').value);
    const harmonics = document.getElementById('harmonics-input').value.split(',').map(Number);
    const envelope = document.getElementById('envelope-input').value.split(',').map(Number);

    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(amplitude, audioContext.currentTime);

    if (envelope.length === 4) {
        const [attack, decay, sustain, release] = envelope;
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(amplitude, now + attack);
        gainNode.gain.linearRampToValueAtTime(amplitude * sustain, now + attack + decay);
        gainNode.gain.linearRampToValueAtTime(0, now + attack + decay + release);
    }

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);

    if (harmonics.length > 1) {
        harmonics.forEach(harmonic => {
            if (harmonic > 1) {
                const harmonicOscillator = audioContext.createOscillator();
                harmonicOscillator.type = waveform;
                harmonicOscillator.frequency.setValueAtTime(frequency * harmonic, audioContext.currentTime);
                harmonicOscillator.connect(gainNode);
                harmonicOscillator.start();
                harmonicOscillator.stop(audioContext.currentTime + duration);
            }
        });
    }
}

function updateValue(type, value) {
    if (type === 'waveform') {
        document.getElementById('waveform-dropdown').value = value;
    } else {
        document.getElementById(`${type}-input`).value = value;
    }
}

function updateSlider(type, value) {
    if (type === 'waveform') {
        document.getElementById('waveform-dropdown').value = value;
    } else {
        document.getElementById(`${type}-slider`).value = value;
    }
}

function updateCustomSettings(note) {
    if (note === 'custom') {
        return; // Do nothing if 'Custom' is selected
    }
    const settings = noteSettings[note];
    document.getElementById('frequency-slider').value = settings.frequency;
    document.getElementById('frequency-input').value = settings.frequency;
    document.getElementById('waveform-dropdown').value = settings.waveform;
    document.getElementById('amplitude-slider').value = settings.amplitude;
    document.getElementById('amplitude-input').value = settings.amplitude;
    document.getElementById('phase-slider').value = settings.phase;
    document.getElementById('phase-input').value = settings.phase;
    document.getElementById('duration-slider').value = settings.duration;
    document.getElementById('duration-input').value = settings.duration;
    document.getElementById('harmonics-input').value = settings.harmonics.join(',');
    document.getElementById('envelope-input').value = settings.envelope.join(',');
}
