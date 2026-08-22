"use client";

import { Mic, Square } from "lucide-react";
import { useRef, useState } from "react";

export default function SoundRecorder({sendAudio}) {
  const [isRecording, setIsRecording] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const toggleRecording = async () => {
    // STOP
    if (isRecording) {
      recorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    // START
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        const audioUrl = URL.createObjectURL(audioBlob);

        console.log("Audio:", audioBlob);
        console.log("Audio URL:", audioUrl);
        sendAudio(audioBlob)

        // Recording ke baad stream bhi stop
        stream.getTracks().forEach((track) => track.stop());

        // Test ke liye audio play
        const audio = new Audio(audioUrl);
        audio.play();
      };

      recorder.start();

      recorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access denied:", error);
    }
  };

  return (
    <button onClick={toggleRecording}>
      {isRecording ? <Square size={20} /> : <Mic size={20} />}
    </button>
  );
}